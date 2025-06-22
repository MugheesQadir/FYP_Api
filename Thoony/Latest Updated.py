import urequests
import network
from machine import Pin, PWM, time_pulse_us
import time, gc

# -------------------- CONFIGURATION --------------------
SSID = "Quaid-e-Azam"
PASSWORD = "1133557799"

API_BASE = "http://192.168.158.116:5000"
FLASK_URL_ALL_PORTS = f"{API_BASE}/List_Compartment_Appliance"
FLASK_URL_UPDATE = f"{API_BASE}/Update_Compartment_Appliance_status"
FLASK_URL_SCHEDULE = f"{API_BASE}/check_schedule_update_status"
FLASK_URL_ALL_PORTS_LOCK = f"{API_BASE}/List_Compartment_Lock"
FLASK_URL_LOCK_SCHEDULE_STATUS = f"{API_BASE}/check_lock_schedule_update_status"
FLASK_URL_SET_WATER_LEVEL_STATE = f"{API_BASE}/set_water_level_state"

BUTTON_PORT_MAP = {6: 1, 7: 2, 8: 3, 9: 4, 10: 5}

# -------------------- HARDWARE SETUP --------------------
buzzer = Pin(16, Pin.OUT)

ir_sensors = [Pin(pin, Pin.IN) for pin in (17, 18, 19, 20)]
trig = Pin(21, Pin.OUT)
echo = Pin(22, Pin.IN)

relay_pins = {}
appliance_map = {}
servo_pwms = {}
servo_pins = {}
lock_map = {}
button_pins = {pin: Pin(pin, Pin.IN, Pin.PULL_DOWN) for pin in BUTTON_PORT_MAP}
previous_button_states = {pin: 0 for pin in BUTTON_PORT_MAP}

# -------------------- WIFI CONNECTION --------------------
def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    print("[WiFi] Connecting to network...")
    
    for _ in range(10):
        if wlan.isconnected():
            print(f"[WiFi] Connected | IP: {wlan.ifconfig()[0]}")
            return
        time.sleep(1)

    raise RuntimeError("[WiFi] Connection failed")

# -------------------- API FUNCTIONS --------------------
def safe_get(url):
    try:
        response = urequests.get(url)
        if response.status_code == 200:
            data = response.json()
            response.close()
            return data
        print(f"[API] Failed: {response.status_code}")
    except Exception as e:
        print(f"[API] Error: {e}")
    return []

def safe_post(url, payload):
    try:
        response = urequests.post(url, json=payload)
        response.close()
    except Exception as e:
        print(f"[API] Post Error: {e}")

def get_appliances():
    return safe_get(FLASK_URL_ALL_PORTS)

def get_locks():
    return safe_get(FLASK_URL_ALL_PORTS_LOCK)

def update_schedule_status():
    safe_get(FLASK_URL_SCHEDULE)

def update_lock_schedule_status():
    safe_get(FLASK_URL_LOCK_SCHEDULE_STATUS)

def send_status_update(appliance, status):
    payload = {"id": appliance["id"], "status": status}
    print(f"[API] Status Update: Port {appliance['port']} → {status}")
    safe_post(FLASK_URL_UPDATE, payload)

def set_water_level_state(state):
    payload = {"state": state}
    safe_post(FLASK_URL_SET_WATER_LEVEL_STATE, payload)

# -------------------- RELAY & SERVO SETUP --------------------
def setup_relays(appliances):
    for item in appliances:
        port = item["port"]
        pin = Pin(port, Pin.OUT)
        pin.value(item["status"])
        relay_pins[port] = pin
        appliance_map[port] = item
        print(f"[Relay] Initialized GPIO {port} → {'ON' if item['status'] else 'OFF'}")

def sync_relays(appliances):
    for item in appliances:
        port = item["port"]
        if port in relay_pins:
            relay_pins[port].value(item["status"])

def setup_servos(locks):
    for item in locks:
        port = item["port"]
        servo_pin = Pin(port, Pin.OUT)
        servo_pin.value(item["status"])
        servo_pins[port] = servo_pin
        lock_map[port] = item
        print(f"[SERVO] Initialized GPIO {port} → {'ON' if item['status'] else 'OFF'}")

def sync_servos(locks):
    for item in locks:
        port = item["port"]
        if port in servo_pins:
            status = item["status"]
            servo_pins[port].value(status)
            set_servo_angle(port, 0 if status else 40)

# -------------------- WATER LEVEL SENSOR --------------------
def measure_distance():
    trig.value(0)
    time.sleep_us(2)
    trig.value(1)
    time.sleep_us(10)
    trig.value(0)

    pulse_time = time_pulse_us(echo, 1, 30000)  # Timeout after 30ms
    if pulse_time < 0:
        return -1

    distance = (pulse_time * 0.0343) / 2
    print(f"check distance {distance}")
    return int(distance)

def send_water_level_state():
    distance = measure_distance()
    if distance > 0:
        set_water_level_state(distance)
        print(f"water level: {distance}")

# -------------------- BUTTON HANDLING --------------------
def check_buttons():
    for pin, port in BUTTON_PORT_MAP.items():
        current = button_pins[pin].value()
        if current != previous_button_states[pin]:
            if port in relay_pins and port in appliance_map:
                relay_pins[port].value(current)
                send_status_update(appliance_map[port], current)
                action = "ON" if current else "OFF"
                print(f"[Button] GPIO {pin} {'Pressed' if current else 'Released'} → Relay {port} {action}")
            previous_button_states[pin] = current

# -------------------- SERVO MOTOR CONTROL --------------------
def set_servo_angle(port, angle):
    duty = int(1638 + (angle / 180) * 8192)
    pwm = servo_pwms.get(port)
    if not pwm:
        pwm = PWM(Pin(port))
        pwm.freq(50)
        servo_pwms[port] = pwm
    pwm.duty_u16(duty)

# -------------------- ALARM SYSTEM --------------------
def check_intrusion():
    triggered = sum(sensor.value() == 0 for sensor in ir_sensors)

    print(f"IRs:", ", ".join(str(sensor.value()) for sensor in ir_sensors))

    if triggered >= 2:
        print("⚠️ Rays Cut! Intrusion Detected!")
        buzzer.value(1)
        time.sleep(0.5)
        buzzer.value(0)
    else:
        print("✅ Clear - No interruption")

# -------------------- MAIN LOOP --------------------
def main():
    connect_to_wifi()

    setup_relays(get_appliances())
    setup_servos(get_locks())

    last_schedule_update = time.time()

    while True:
        check_buttons()
        sync_relays(get_appliances())
        sync_servos(get_locks())
        send_water_level_state()
        check_intrusion()

        # Refresh schedule status every 60 seconds
        if int(time.time()) % 10 == 0:
            update_schedule_status()
            update_lock_schedule_status()
            last_schedule_update = time.time()

        gc.collect()
        time.sleep(0.02)

# -------------------- ENTRY POINT --------------------
try:
    main()
except Exception as e:
    print("[System] Fatal error:", e)
finally:
    gc.collect()
