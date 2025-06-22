from machine import Pin, PWM
from time import sleep

# Servo motor signal wire is connected to GP15
servo = PWM(Pin(2))
servo.freq(50)  # 50Hz for servo motor

while True:
    # 0 degrees
    servo.duty_u16(1638)  # 8192  4915  1638
    print("0 degree")
    sleep(1)

    
