import urequests
import network
from machine import Pin, PWM , time_pulse_us,ADC
import time, gc
import math
import utime

# -------------------- CONFIGURATION --------------------
SSID = "Quaid-e-Azam"
PASSWORD = "1133557799"

API_BASE = "http://10.106.181.116:5000"
FLASK_URL_ALL_PORTS = f"{API_BASE}/List_Compartment_Appliance"
FLASK_URL_UPDATE = f"{API_BASE}/Update_Compartment_Appliance_status"

FLASK_URL_ALL_PORTS_LOCK = f"{API_BASE}/List_Compartment_Lock"

FLASK_URL_SET_water_level_State = f"{API_BASE}/set_water_level_state"
FLASK_URL_SET_TEMPERATURE_level_State = f"{API_BASE}/set_temperature_level_state"

BUTTON_PORT_MAP = {6: 1, 7: 2, 8: 3, 9: 4, 10: 5}

buzzer = Pin(16, Pin.OUT)

ir_sensor1 = Pin(17, Pin.IN)
ir_sensor2 = Pin(18, Pin.IN)
ir_sensor3 = Pin(19, Pin.IN)
ir_sensor4 = Pin(20, Pin.IN)

trig = Pin(21, Pin.OUT)  # Trig pin as output
echo = Pin(22, Pin.IN)   # Echo pin as input

temp_sensor = ADC(Pin(27))
adc = ADC(Pin(28))  # GP28 = ADC2

# -------------------- STATE VARIABLES --------------------
relay_pins = {}
appliance_map = {}

servo_pwms = {}

sero_pins = {}
locks_maps = {}

button_pins = {pin: Pin(pin, Pin.IN, Pin.PULL_DOWN) for pin in BUTTON_PORT_MAP}
previous_button_states = {pin: 0 for pin in BUTTON_PORT_MAP}

#Volage Sensoing

VREF = 3.3          # Pico's reference voltage
SAMPLES = 2000      # Number of samples per cycle
LINE_FREQ = 50      # 50Hz for most countries
SAMPLE_DELAY = 100  # microseconds between samples

# Calibration factors (adjust these!)
ZERO_OFFSET = 1.65  # Typically VREF/2 (1.65V)
CALIBRATION_FACTOR = 0.0022  # Start with this, adjust during calibration

#--------------------- Voltage Sensing --------------------

def read_voltage_rms():
    samples = []
    
    # Sample the waveform for one complete cycle
    for _ in range(SAMPLES):
        adc_value = adc.read_u16()
        voltage = (adc_value / 65535) * VREF
        samples.append(voltage)
        time.sleep_us(SAMPLE_DELAY)
    
    # Calculate RMS voltage
    sum_squares = 0.0
    for sample in samples:
        # Remove DC offset
        ac_component = sample - ZERO_OFFSET
        sum_squares += ac_component * ac_component
    
    rms_voltage = math.sqrt(sum_squares / len(samples))
    
    # Convert to actual AC voltage
    ac_voltage = rms_voltage / CALIBRATION_FACTOR
    
    return round(ac_voltage, 2)

def calibrate(known_voltage):
    print("Calibrating with known voltage:", known_voltage, "V")
    raw_rms = read_voltage_rms() * CALIBRATION_FACTOR  # Get raw RMS without scaling
    new_factor = raw_rms / known_voltage
    print("New calibration factor:", new_factor)
    return new_factor


# -------------------- WIFI CONNECTION --------------------
def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    timeout = 10

    print("[WiFi] Connecting to network...")
    while not wlan.isconnected() and timeout > 0:
        time.sleep(1)
        timeout -= 1

    if wlan.isconnected():
        print(f"[WiFi] Connected | IP: {wlan.ifconfig()[0]}")
    else:
        raise RuntimeError("[WiFi] Connection failed")

# -------------------- API FUNCTIONS --------------------
def get_appliances():
    try:
        response = urequests.get(FLASK_URL_ALL_PORTS)
        if response.status_code == 200:
            return response.json()
        print(f"[API] Failed to fetch appliances: {response.status_code}")
    except Exception as e:
        print(f"[API] Error fetching appliances: {e}")
    return []

def send_status_update(appliance, status):
    try:
        payload = {"id": appliance["id"], "status": status}
        response = urequests.post(FLASK_URL_UPDATE, json=payload)
        print(f"[API] Status Update: Port {appliance['port']} → {status} | Code: {response.status_code}")
        response.close()
    except Exception as e:
        print(f"[API] Update Error: {e}")

def get_Locks():
    try:
        response = urequests.get(FLASK_URL_ALL_PORTS_LOCK)
        if response.status_code == 200:
            return response.json()
        print(f"[API] Failed to fetch Locks: {response.status_code}")
    except Exception as e:
        print(f"[API] Error fetching Locks: {e}")
    return []
        
def set_water_level_state(state):
    try:
        data = {"state": state}
        response = urequests.post(FLASK_URL_SET_water_level_State, json=data)        
        response.close()  # Free up memory
    except Exception as e:
        print(f"Error sending water level state: {e}")
        
def set_temperature_level_state(state):
    try:
        data = {"state": state}
        response = urequests.post(FLASK_URL_SET_TEMPERATURE_level_State, json=data)        
        response.close()  # Free up memory
    except Exception as e:
        print(f"Error sending Temperature level state: {e}")

# -------------------- RELAY SETUP --------------------
def setup_relays(appliances):
    for item in appliances:
        port = item["port"]
        relay_pins[port] = Pin(port, Pin.OUT)
        relay_pins[port].value(item["status"])
        appliance_map[port] = item
        print(f"[Relay] Initialized GPIO {port} → {'ON' if item['status'] else 'OFF'}")

def sync_relays(appliances):
    for item in appliances:
        port = item["port"]
        if port in relay_pins:
            relay_pins[port].value(item["status"])
            
# -------------------- SERVO SETUP --------------------
def setup_servo(locks):
    for item in locks:
        port = item["port"]
        sero_pins[port] = Pin(port, Pin.OUT)
        sero_pins[port].value(item["status"])
        locks_maps[port] = item
        print(f"[SERVO] Initialized GPIO {port} → {'ON' if item['status'] else 'OFF'}")

def sync_serco(locks):
    for item in locks:
        port = item["port"]
        if port in sero_pins:
            status = item["status"]
            sero_pins[port].value(status)
            if status == 1:
                set_servo_angle(port, 0)
            else:
                set_servo_angle(port, 40)
                
#------------------------Water Level-----------------------
def measure_distance():
    # Send a 10µs pulse to Trig pin
    trig.value(0)  # Ensure Trig is low
    time.sleep_us(2)
    trig.value(1)  # Send high pulse
    time.sleep_us(10)
    trig.value(0)  # Return to low

    # Measure the time Echo pin stays high
    pulse_time = time_pulse_us(echo, 1)  # Wait for Echo to go high and measure time

    # Calculate distance (speed of sound = 0.0343 cm/µs)
    distance = (pulse_time * 0.0343) / 2  # Divide by 2 for one-way distance
    print(f"check distance {distance}")
    return int(distance)

    return -1  # All attempts failed

def read_temperature():
    
    adc_value = temp_sensor.read_u16()
    voltage = (adc_value * 3.3) / 65535   # Convert ADC to voltage
    temperature_f = voltage * 100         # 10mV per °F
    temperature_c = (temperature_f - 32) * 5 / 9  # Convert to °C

    return round(temperature_f, 2), round(temperature_c, 2)


def send_water_level_state():
    distance = measure_distance()  # Get distance
    if distance > 0:
        set_water_level_state(distance)
        print(f"water level : {distance}")
        
def send_temperature_level_state():
    temp_f, temp_c = read_temperature()  # Get distance
    if temp_c > 0:
        set_temperature_level_state(temp_c)
        print("Temperature: {:.2f} °F / {:.2f} °C".format(temp_f, temp_c))

# -------------------- BUTTON HANDLING --------------------
def check_buttons():
    for pin, port in BUTTON_PORT_MAP.items():
        current_state = button_pins[pin].value()
        previous_state = previous_button_states[pin]

        if port in relay_pins and port in appliance_map:
            if current_state and not previous_state:
                relay_pins[port].value(1)
                send_status_update(appliance_map[port], 1)
                print(f"[Button] GPIO {pin} Pressed → Relay {port} ON")

            elif not current_state and previous_state:
                relay_pins[port].value(0)
                send_status_update(appliance_map[port], 0)
                print(f"[Button] GPIO {pin} Released → Relay {port} OFF")

        previous_button_states[pin] = current_state

#---------------------servo angle ------------------
def set_servo_angle(port, angle):
    duty = int(1638 + (angle / 180) * 8192)  # 1638 = 2.5%, 8192 = 12.5% of 65535
    if port not in servo_pwms:
        pwm = PWM(Pin(port))
        pwm.freq(50)
        servo_pwms[port] = pwm
    else:
        pwm = servo_pwms[port]

    pwm.duty_u16(duty)
    
#----------------------alarm system------------------
def check_intrusion():
    value1 = ir_sensor1.value()
    value2 = ir_sensor2.value()
    value3 = ir_sensor3.value()
    value4 = ir_sensor4.value()

    print(f"IR1: {value1}, IR2: {value2}, IR3: {value3}, IR4: {value4}")

    triggered = sum(val <= 0 for val in [value1, value2, value3, value4])

    if triggered >= 2:
        print("⚠️ Rays Cut! Intrusion Detected!")
        buzzer.value(1)
        time.sleep(0.5)
        buzzer.value(0)
    else:
        print("✅ Clear - No interruption")
        
#-------------------- System Off -------------------
def SystemOff():
    print("⚠️ Turning everything OFF...")

    # First: just turn OFF GPIOs (no API calls yet)
    for port, pin in relay_pins.items():
        pin.value(0)
        print(f"[SystemOff] Relay GPIO {port} → OFF")

    # Lock all servo motors
    for port in sero_pins:
        set_servo_angle(port, 40)  # Locked
        print(f"[SystemOff] Servo GPIO {port} → Locked")

    # Buzzer off
    buzzer.value(0)
    print("[SystemOff] Buzzer OFF")

    # GPIO cleanup
    used_ports = list(BUTTON_PORT_MAP.keys()) + list(range(16, 29))
    for pin_num in used_ports:
        try:
            Pin(pin_num, Pin.OUT).value(0)
        except:
            pass

    print("✅ All devices turned OFF Successfully.")



# -------------------- MAIN LOOP --------------------
def main():
    voltage = read_voltage_rms()
    if voltage > 245:
        print("Dangerous Voltages ", voltage, " V")
        SystemOff()
        return
    elif voltage >= 180 and voltage <= 245:
        print("Voltages Stables : ", voltage, " V")
        
        connect_to_wifi()
        appliances = get_appliances()
        setup_relays(appliances)

        locks = get_Locks()
        setup_servo(locks)

        while True:
            voltage = read_voltage_rms()
            if voltage > 245:
                print("Dangerous Voltages ", voltage, " V")
                SystemOff()
                return
            elif voltage >= 180 and voltage <= 245:
                print("\nVoltages Stables : ", voltage, " V")

                check_buttons()
                updated_appliances = get_appliances()
                sync_relays(updated_appliances)

                updated_locks = get_Locks()
                sync_serco(updated_locks)

                send_water_level_state()
                send_temperature_level_state()

                # check_intrusion()

                gc.collect()
                time.sleep(0.02)

            elif voltage < 180:
                print("System Off because of low voltages : ", voltage, " V")
                SystemOff()
                return
            else:
                print("Unknown voltages : ", voltage, " V")
                SystemOff()

    elif voltage < 180:
        print("System Off because low voltages : ", voltage, " V")
        SystemOff()
        return
    else:
        print("Unknown voltages : ", voltage, " V")
        SystemOff()

# -------------------- ENTRY POINT --------------------
try:
    main()
except Exception as e:
    print("[System] Fatal error:", e)
finally:
    gc.collect()
