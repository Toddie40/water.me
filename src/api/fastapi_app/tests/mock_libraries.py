class ADS:
    """
    Silly little class to implement the used features of the 
    adafruit_ads1x15.ads1115 ADS class
    """
    P0 = "test_0"
    P1 = "test_1"
    P2 = "test_2"

    def ADS1115(i2c):
        return "testing ads1115 module"

class AnalogIn:
    def __init__(self, ads, ads_pin):
        self.ads = ads
        self.ads_pin = ads_pin
