import dht
from machine import Pin, ADC
import time

# Sensor Pins Setup
flame_sensor = ADC(Pin(27))
smoke_adc = ADC(Pin(28))
relay = Pin(4, Pin.OUT)
relay.value(1)  # Initial OFF state

while True:
    try:
        
        # Read other sensors
        smoke_value = smoke_adc.read_u16()
        voltage = smoke_value * 3.3 / 65535
        flame_detected = flame_sensor.read_u16()
        
        print("💨 Smoke Value (raw):", smoke_value)
        print("🔌 Voltage:", round(voltage, 2), "V")
        print("🔥 Flame value:", flame_detected)
        
        # Detection logic
        if flame_detected < 30000:  # Flame detected
            print("\n🔥 Flame Detected!")
            relay.value(0)
        elif voltage > 1.0 and flame_detected < 30000:
            print("\n⚠️ smoke detected!")
            relay.value(0)
        else:
            print("\n✅ Normal conditions")
            relay.value(1)
        
        print("-----------------------------------")
        time.sleep(2)  # Increased delay between readings
    
    except Exception as e:
        print("Main loop error:", e)
        time.sleep(5)  # Longer delay on error
