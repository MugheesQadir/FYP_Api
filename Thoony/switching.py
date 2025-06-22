from machine import Pin
import time

flow_pin1 = Pin(2, Pin.IN)
flow_pin2 = Pin(3, Pin.IN)

relay1 = Pin(4, Pin.OUT)
relay2 = Pin(5, Pin.OUT)

while True:
    print('flow meter value 1:', flow_pin1.value(), 'flow meter value 2:', flow_pin2.value())
    
    if flow_pin1.value() > 0:
        print("")
        print("Gas ON")
        relay1.value(1)    # Gas valve relay ON
        relay2.value(0)    # Cylinder relay OFF
    elif flow_pin1.value() == 0 and flow_pin2.value() > 0:
        print("Cylinder ON")
        relay1.value(0)    # Gas valve relay OFF
        relay2.value(1)    # Cylinder relay ON
    else:
        print("Gas OFF and Cylinder Empty")
        relay1.value(0)    # Both OFF
        relay2.value(0)

    time.sleep(0.1)
