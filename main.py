pins.analog_write_pin(AnalogPin.P13, 0)
pins.analog_write_pin(AnalogPin.P14, 0)
soilMoisture = 0
valueThreshold = 40
valueThreshold = EEPROM.readw(0) #read old value threshold value of moiture
timeRemainSetup = 0
motorDrip = 1
moiture = 40
I2C_LCD1602.lcd_init(39)
I2C_LCD1602.on()
I2C_LCD1602.backlight_on()
symbol_LCD = "/-|"
counterSymbol = 0
#I2C_LCD1602.show_string("Hello", 0, 0)

def on_forever():
    global valueThreshold, moiture, symbol_LCD, counterSymbol, timeRemainSetup, motorDrip
    if timeRemainSetup > 0: #setup on process
        string = "Setup: Threshold"
        I2C_LCD1602.show_string(string, 0, 0)
        if (valueThreshold == 100):
            string = "Value: 100%     "
        else:
            string = "Value: %2d" % (valueThreshold, 0) + "%          "
        I2C_LCD1602.show_string(string, 0, 1)
    else:
        if (valueThreshold == 100):
            string = "info: Thres 100%"
        else:
            string = "info: Thres %2d"% (valueThreshold, 0) + "%     "
        I2C_LCD1602.show_string(string, 0, 0)
        if moiture == 100:
            string = "Current: 100%   "
        else:
            string = "Current: %2d" % (moiture, 0) + "%     "
        I2C_LCD1602.show_string(string, 0, 1)
        if motorDrip:
            counterSymbol += 1
            if counterSymbol == 3:
                counterSymbol = 0
            I2C_LCD1602.show_string(symbol_LCD[counterSymbol], 15, 1)
        else:
            I2C_LCD1602.show_string("-", 15, 1)
    basic.pause(10)
basic.forever(on_forever)

def on_forever2():
    global valueThreshold
    global timeRemainSetup
    if input.button_is_pressed(Button.A):
        timeRemainSetup = 5
        counter = 0
        while input.button_is_pressed(Button.A):
            timeRemainSetup = 5
            counter = counter + 1
            basic.pause(10)
            if counter > 30:
                valueThreshold = valueThreshold + 5
                basic.pause(300)
        valueThreshold = valueThreshold + 1
        if valueThreshold > 100:
            valueThreshold = 100
    if input.button_is_pressed(Button.B):
        timeRemainSetup = 5
        counter = 0
        while input.button_is_pressed(Button.B):
            timeRemainSetup = 5
            counter += 1
            basic.pause(10)
            if counter > 30:
                valueThreshold -= 5
                basic.pause(300)
        valueThreshold = valueThreshold - 1
        if valueThreshold < 0:
            valueThreshold = 0
    basic.pause(100)
basic.forever(on_forever2)

def on_logo_event_pressed():
    global timeRemainSetup, valueThreshold
    timeRemainSetup = 5
    basic.show_icon(IconNames.YES, 1000)
    basic.clear_screen()
    EEPROM.writew(0, valueThreshold)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_event_pressed)

def on_forever6():
    global timeRemainSetup
    basic.pause(1000)
    if timeRemainSetup > 0:
        timeRemainSetup -= 1
basic.forever(on_forever6)

def on_forever4():
    global moiture
    valueAnalog = 0
    for i in range (10):
        valueAnalog += pins.analog_read_pin(AnalogPin.P0)
        basic.pause(10)
    valueAnalog = Math.round(valueAnalog/10)
    moiture = int((1023 - valueAnalog)/1023*100)
basic.forever(on_forever4)

def on_forever10():
    global motorDrip, valueThreshold, moiture
    if valueThreshold >= moiture:
        motorDrip = 1
        pins.analog_write_pin(AnalogPin.P13, 800)
        pins.analog_write_pin(AnalogPin.P14, 0)
    else:
        motorDrip = 0
        pins.analog_write_pin(AnalogPin.P13, 0)
        pins.analog_write_pin(AnalogPin.P14, 0)
basic.forever(on_forever10)
