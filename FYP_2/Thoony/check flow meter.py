from machine import Pin
import time

flow_pin1 = Pin(2, Pin.IN)

while True:
    print('flow meter value 1:', flow_pin1.value())

    time.sleep(0.1)

