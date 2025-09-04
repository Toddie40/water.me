import RPi.GPIO as GPIO
import sys
import os
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import time

class RPIController:

    def __init__(self):
        # GPIO pins for the valves
        self.valves = {
            1 : 18,
            2 : 27,
            3 : 22
        }

        # GPIO pin for the pum
        self.pump = 23

        # sensors -- analogue signal so have to set up our I2C protocol from our Analogue to Digital Converter
        SCL_pin = board.SCL
        SDA_pin = board.SDA
        i2c = busio.I2C(SCL_pin, SDA_pin)

        ads = ADS.ADS1115(i2c)

        self.sensors = {
            1: AnalogIn(ads, ADS.P0), 
            2: AnalogIn(ads, ADS.P1),
            3: AnalogIn(ads, ADS.P2)
        }

        # set up the valves and pump pins for output
        # valves
        for valve_no, pin in self.valves.items():
            GPIO.setup(pin, GPIO.OUT)
        
        # pump
        GPIO.setup(self.pump, GPIO.OUT)
    
    def start_pump(self):
        return GPIO.output(self.pump, 1)

    def stop_pump(self):
        return GPIO.output(self.pump, 0)

    def read_sensor(self, sensor_no):
        # this will need to be made a bit cleverer to convert whatever our voltage is into a meaningful moisture valve
        # perhaps the datasheet will help
        return self.sensors[sensor_no].voltage

    def close_all_valves(self):
        for valve_no, pin in self.valves.items():
            self.close_valve(valve_no)

    def open_valve(self, valve_no):
        GPIO.output(self.valves[valve_no], 1)

    def close_valve(self, valve_no):
        GPIO.output(self.valves[valve_no], 0)
                
    def water(self, plant_no):
        self.close_all_valves()
        self.open_valve(plant_no)
        self.start_pump()
        for i in range(5):
            time.sleep(1)
            yield f"watering... (i seconds)"
        self.stop_pump()
        self.close_valve(plant_no)
        return "done"

    # exit handling for panic closing if the pump doesn't stop!
    def on_app_close(self, sig, frame):
        os.write(sys.stdout.fileno(),b"\nIt appears you have panic closed! Shutting off the pump and stopping the app.\n")
        self.stop_pump()
        GPIO.cleanup()
        sys.exit(0)









        