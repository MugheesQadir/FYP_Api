from machine import Pin
import time, gc

SSID = "Quaid-e-Azam"
PASSWORD = "1133557799"

API_BASE = "http://192.168.158.116:5000"
FLASK_URL_ALL_PORTS = f"{API_BASE}/List_Compartment_Appliance"

flow_pin1 = Pin(2, Pin.IN)
flow_pin2 = Pin(3, Pin.IN)

relay1 = Pin(4, Pin.OUT)
relay2 = Pin(5, Pin.OUT)

#-------------------- Connect to Wifi ----------------

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

#-----------------------------------------------
    
def main():
    #connect_to_wifi()    

    while True:
        relay1.value(1)    # Gas valve relay ON
        relay2.value(1)    # Cylinder relay ON
        #print("Relay1 and Relay2 are forced to ON")
        #print("")
        time.sleep(1)    
        #print('Gas value:', flow_pin1.value(), 'LPG value:', flow_pin2.value())
        print("")
        
        if flow_pin1.value() > 0:
            print("Gas ON")
            print("")
            relay1.value(1)    # Gas valve relay ON
            relay2.value(0)    # Cylinder relay OFF
        elif flow_pin1.value() == 0 and flow_pin2.value() > 0:
            print("Cylinder ON")
            print("")
            relay1.value(0)    # Gas valve relay OFF
            relay2.value(1)    # Cylinder relay ON
        else:
            print("Gas OFF and Cylinder Empty")
            print("")

        gc.collect()
        time.sleep(1)
#------------------------ Api method -----------------------        

#----------------------------------
    
try:
    main()
except Exception as e:
    print("[System] Fatal error:", e)
finally:
    gc.collect()

