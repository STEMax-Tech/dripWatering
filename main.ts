pins.analogWritePin(AnalogPin.P13, 0)
pins.analogWritePin(AnalogPin.P14, 0)
let soilMoisture = 0
let valueThreshold = 40
valueThreshold = EEPROM.readw(0)
// read old value threshold value of moiture
let timeRemainSetup = 0
let motorDrip = 1
let moiture = 40
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.on()
I2C_LCD1602.BacklightOn()
let symbol_LCD = "/-|"
let counterSymbol = 0
// I2C_LCD1602.show_string("Hello", 0, 0)
basic.forever(function on_forever() {
    let string: string;
    
    if (timeRemainSetup > 0) {
        // setup on process
        string = "Setup: Threshold"
        I2C_LCD1602.ShowString(string, 0, 0)
        if (valueThreshold == 100) {
            string = "Value: 100%     "
        } else {
            string = `Value: ${valueThreshold}` + "%          "
        }
        
        I2C_LCD1602.ShowString(string, 0, 1)
    } else {
        if (valueThreshold == 100) {
            string = "info: Thres 100%"
        } else {
            string = `info: Thres ${valueThreshold}` + "%     "
        }
        
        I2C_LCD1602.ShowString(string, 0, 0)
        if (moiture == 100) {
            string = "Current: 100%   "
        } else {
            string = `Current: ${moiture}` + "%     "
        }
        
        I2C_LCD1602.ShowString(string, 0, 1)
        if (motorDrip) {
            counterSymbol += 1
            if (counterSymbol == 3) {
                counterSymbol = 0
            }
            
            I2C_LCD1602.ShowString(symbol_LCD[counterSymbol], 15, 1)
        } else {
            I2C_LCD1602.ShowString("-", 15, 1)
        }
        
    }
    
    basic.pause(10)
})
basic.forever(function on_forever2() {
    let counter: number;
    
    
    if (input.buttonIsPressed(Button.A)) {
        timeRemainSetup = 5
        counter = 0
        while (input.buttonIsPressed(Button.A)) {
            timeRemainSetup = 5
            counter = counter + 1
            basic.pause(10)
            if (counter > 30) {
                valueThreshold = valueThreshold + 5
                basic.pause(300)
            }
            
        }
        valueThreshold = valueThreshold + 1
        if (valueThreshold > 100) {
            valueThreshold = 100
        }
        
    }
    
    if (input.buttonIsPressed(Button.B)) {
        timeRemainSetup = 5
        counter = 0
        while (input.buttonIsPressed(Button.B)) {
            timeRemainSetup = 5
            counter += 1
            basic.pause(10)
            if (counter > 30) {
                valueThreshold -= 5
                basic.pause(300)
            }
            
        }
        valueThreshold = valueThreshold - 1
        if (valueThreshold < 0) {
            valueThreshold = 0
        }
        
    }
    
    basic.pause(100)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function on_logo_event_pressed() {
    
    timeRemainSetup = 5
    basic.showIcon(IconNames.Yes, 1000)
    basic.clearScreen()
    EEPROM.writew(0, valueThreshold)
})
basic.forever(function on_forever6() {
    
    basic.pause(1000)
    if (timeRemainSetup > 0) {
        timeRemainSetup -= 1
    }
    
})
basic.forever(function on_forever4() {
    
    let valueAnalog = 0
    for (let i = 0; i < 10; i++) {
        valueAnalog += pins.analogReadPin(AnalogPin.P0)
        basic.pause(10)
    }
    valueAnalog = Math.round(valueAnalog / 10)
    moiture = Math.trunc((1023 - valueAnalog) / 1023 * 100)
})
basic.forever(function on_forever10() {
    
    if (valueThreshold >= moiture) {
        motorDrip = 1
        pins.analogWritePin(AnalogPin.P13, 800)
        pins.analogWritePin(AnalogPin.P14, 0)
    } else {
        motorDrip = 0
        pins.analogWritePin(AnalogPin.P13, 0)
        pins.analogWritePin(AnalogPin.P14, 0)
    }
    
})
