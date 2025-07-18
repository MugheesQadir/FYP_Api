from machine import Pin, PWM
import time

# Blue servo SG90 = GPIO2
servo1 = PWM(Pin(2))

# Black servo MG995 = GPIO3
servo2 = PWM(Pin(3))

servo1.freq(50)
servo2.freq(50)

def set_angle(servo, angle):
    min_u16 = 1638
    max_u16 = 8192
    duty = int(min_u16 + (angle / 180) * (max_u16 - min_u16))
    servo.duty_u16(duty)

while True:
    print("Ignitor Off")
    set_angle(servo1, 0)    # Blue SG90
    set_angle(servo2, 35)   # Black MG995
    time.sleep(2)
    
    print("Ignitor On")
    set_angle(servo1, 35)
    set_angle(servo2, 70)
    time.sleep(1)
