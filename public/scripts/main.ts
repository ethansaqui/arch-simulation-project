import e from "express";

interface FloatingPoint {
    sign : string;
    exponent : string;
    mantissa : string;
    base: number;
}

const convertButton = document.getElementById('convertButton') as HTMLInputElement;
const baseSelect = document.getElementById('baseSelect') as HTMLInputElement;
const binaryInput = document.getElementById('binaryInput') as HTMLInputElement;
const exponentInput = document.getElementById('exponentInput') as HTMLInputElement;

baseSelect.addEventListener('change', handleBaseSelectChange);

function changeReadOnlyValue(value : boolean) {
    binaryInput.readOnly = value;
    exponentInput.readOnly = value; 
}

function handleBaseSelectChange() {
    changeReadOnlyValue(false);
    if(baseSelect.value == '2'){
        binaryInput.placeholder="Enter a binary mantissa"
        exponentInput.placeholder="Enter an exponent"
    }
    else if(baseSelect.value == '10') {
        binaryInput.placeholder="Enter a decimal mantissa"
        exponentInput.placeholder="Enter an exponent"
    }
    else {
        binaryInput.placeholder="NaN"
        exponentInput.placeholder="NaN"
        binaryInput.value = "";
        exponentInput.value = "";
        changeReadOnlyValue(true);

    }   
}

convertButton.addEventListener('click', handleConvertButtonClick);

function handleConvertButtonClick() {
    convertToFloat64(binaryInput.value, exponentInput.value, parseInt(baseSelect.value));
    if(baseSelect.value == '2')
        console.log("Convert binary to float64");
    else if(baseSelect.value == '10')
        console.log("Convert decimal to float64");
    else
        console.log("NaN");
}

function extractSign(mantissa : string) : string {
    if(mantissa[0] == '-') 
        return "1"
    return "0";
}

function normalizeDecimalPoint(mantissa: string, exponent: string) : string {
// shift decimal point based on exponent
    let result = mantissa;
    const originalRadixPointPosition = result.indexOf('.');
    let newRadixPointPosition = Math.max(originalRadixPointPosition + parseInt(exponent), 0);
    let exponentValue = parseInt(exponent);
    let resLength = result.length;
    let resArray = result.split(''); // 1, 0, . , 2
    resArray.splice(originalRadixPointPosition, 1);
    result = resArray.join('');

    while(exponentValue > 0) {
        if(originalRadixPointPosition + exponentValue >= resLength) {
            result += "0";
        }
        exponentValue--;
    }
    while(exponentValue < 0) {
        if(originalRadixPointPosition + exponentValue < 0) {
            result = "0" + result;
        }
        exponentValue++;
    }

    var resultArr = result.split('');
    resultArr.splice(newRadixPointPosition, 0, '.');
    return resultArr.join('');
}

function convertDecimalToBinary(input: FloatingPoint) : FloatingPoint {
    const mantissa = input.mantissa;
    // Change to base 2 using change of base 
    let exponent= input.exponent
    const normalizedMantissa = normalizeDecimalPoint(mantissa, exponent);
    // separate mantissa into 2 parts: 1 after the decimal point and 1 before the decimal point
    const mantissaParts = normalizedMantissa.split('.');

    const beforeDecimalPoint = mantissaParts[0];
    const afterDecimalPoint = mantissaParts[1];

    let exponentValue = "0";

    // convert the after decimal point part to binary as a fraction
    var afterDecimalPointBinary = "";
    
    var afterDecimalPointValue = parseInt(afterDecimalPoint) / Math.pow(10, Math.ceil(afterDecimalPoint.length / 2));
    afterDecimalPointValue /= Math.pow(10, afterDecimalPoint.length - Math.ceil(afterDecimalPoint.length / 2))

    while(afterDecimalPointValue > 0) {
        afterDecimalPointValue *= 2;
        if(afterDecimalPointValue >= 1) {
            afterDecimalPointBinary += "1";
            afterDecimalPointValue -= 1;
        }
        else
            afterDecimalPointBinary += "0";
    }

    // convert the before decimal point part to binary
    var beforeDecimalPointBinary = "";
    var beforeDecimalPointValue = parseInt(beforeDecimalPoint);
    
    if  (beforeDecimalPointValue == Infinity) {
        beforeDecimalPointBinary = "1";
        var ctr = 0;
        exponentValue = "1023";
        while(ctr < 52) {
            beforeDecimalPointBinary += "0";
            ctr++;
        }
    } else {
        while(beforeDecimalPointValue > 0) {
            beforeDecimalPointBinary = (beforeDecimalPointValue % 2).toString() + beforeDecimalPointBinary;
            beforeDecimalPointValue = Math.floor(beforeDecimalPointValue / 2);
        }
    }

    // combine the 2 parts
    var result = beforeDecimalPointBinary + "." + afterDecimalPointBinary;

    return {sign: input.sign,
            exponent: exponentValue,
            mantissa: result,
            base: input.base} as FloatingPoint;
}

function convertExponentToBinary(value: string) : string {
    var result = parseInt(value) + 1023;
    var binary = result.toString(2);
    while(binary.length < 11) {
        binary = "0" + binary;
    }
    return binary;
}

function normalizeBinaryMantissa(input : FloatingPoint) : FloatingPoint {
    var mantissa = input.mantissa;
    var exponent = input.exponent;

    // Find the first one in the mantissa
    var firstOneIndex = mantissa.indexOf('1');

    // Find the radix point in the mantissa
    var radixPointIndex = mantissa.indexOf('.');
    if (radixPointIndex == -1) {
        radixPointIndex = mantissa.length;
    }
    
    if (firstOneIndex < radixPointIndex) {
        var offset = radixPointIndex - firstOneIndex - 1;
        exponent = (parseInt(exponent) + offset).toString();
    } else {
        var offset = firstOneIndex - radixPointIndex ;
        exponent = (parseInt(exponent) - offset).toString();
    }

    console.log(exponent, offset)
    // Remove any leading zeros
    mantissa = mantissa.slice(firstOneIndex);

    // Add back the radix point if it was removed
    if (firstOneIndex < 0) {
        mantissa = "0." + mantissa;
    }
    else {
        mantissa = mantissa.replace('.', '');
        mantissa = mantissa.slice(0, 1) + "." + mantissa.slice(1);
    }

    // Pad the mantissa to fit 52 bits + the characters "1."
    while(mantissa.length < 54) {
        mantissa += "0";
    }

    console.log("Hello", mantissa);


    return {sign: input.sign, 
            exponent: exponent, 
            mantissa: mantissa, 
            base: input.base} as FloatingPoint;
}

function splitToNibbles(value : string) : Array<string> {
    var result = [];
    for(var i = 0; i < value.length; i += 4) {
        result.push(value.slice(i, i + 4));
    }
    return result;
}

function convertToHex(float64 : string) : string {
    var result = splitToNibbles(float64)

    return "0x" + result.map((nibble) => parseInt(nibble, 2).toString(16)).join('').toUpperCase();
}

function displayResults(floatingPoint : FloatingPoint) {
    const sign = floatingPoint.sign;
    const exponent = floatingPoint.exponent;
    const mantissa = floatingPoint.mantissa;
    const float64 = sign + exponent + mantissa.split('.')[1];

    const signBit = document.getElementById('signBit') as HTMLInputElement;
    const exponentBits = document.getElementById('exponentBits') as HTMLInputElement;
    const mantissaBits = document.getElementById('mantissaBits') as HTMLInputElement;
    const hexResult = document.getElementById('hexResult') as HTMLInputElement;

    signBit.value = sign;
    exponentBits.value = exponent;
    mantissaBits.value = mantissa.split('.')[1];

    hexResult.value = convertToHex(float64);
}

function denormalizeMantissa(input : FloatingPoint) : FloatingPoint {
    let result = input;
    let exponent = parseInt(result.exponent);

    result.exponent = "-1023";
    while (exponent < -1023) {
        result.mantissa = "0" + result.mantissa;
        exponent++;
    }
    result.mantissa = result.mantissa.slice(0, 53);
    
    result.mantissa = result.mantissa.split('.').join('');
    result.mantissa = "0." + result.mantissa;

    return result;
}

function handleSpecialCases(result : FloatingPoint) : FloatingPoint {
    // Case 1: Pure Zero
    if (result.mantissa.indexOf('1') == -1){
        result.exponent = "-1023";
    }

    // Case 2: Denormalized
    else if (parseInt(result.exponent) <= -1023) {
        result = denormalizeMantissa(result);
    }

    // Case 3: Infinity
    else if (parseInt(result.exponent) > 1023) {
        result.exponent = "1024";
        result.mantissa = "1.0";
        result = normalizeBinaryMantissa(result);
    }
    // Case 4: NaN
    if (Number.isNaN(result.base)){
        result.exponent = "1024";
        result.mantissa = "1.10";    // Assume qNAN
        result = normalizeBinaryMantissa(result);
    }    
    return result;
}

function cutNegativeSign (value : string) : string {
    return value.slice(1);
}


export default function convertToFloat64(mantissa : string, exponent : string, base : number) {
    const sign = extractSign(binaryInput.value);
    const input = {
        sign: sign,
        mantissa: mantissa,
        exponent: exponent,
        base: base
    }

    if(input.mantissa.indexOf('.') == -1) {
        input.mantissa += ".0";
    }

    if (sign == "1") {
        input.mantissa = cutNegativeSign(input.mantissa);
    }

    var result : FloatingPoint;
    if (base == 2) {
        result = normalizeBinaryMantissa(input);
    }
    else if (base == 10) {
        result = convertDecimalToBinary(input);
    }
    else {
        result = {sign: "0", mantissa: "0", exponent: "0", base: NaN} as FloatingPoint;
    }
    result = normalizeBinaryMantissa(result);
    result = handleSpecialCases(result);
    result.exponent = convertExponentToBinary(result.exponent);

    // Make sure everything is the correct length
    result.sign = result.sign.slice(0, 1);
    result.exponent = result.exponent.slice(0, 11);
    result.mantissa = result.mantissa.slice(0, 54);
    
    displayResults(result);

}

export function copyHex() {
    const sourceText = document.getElementById("hexResult") as HTMLInputElement;

    navigator.clipboard.writeText(sourceText.value)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Error copying text: ', err);
    });
}

export function copyResult() {
    const signBit = document.getElementById("signBit") as HTMLInputElement;
    const exponentBits = document.getElementById("exponentBits") as HTMLInputElement;
    const mantissaBits = document.getElementById("mantissaBits") as HTMLInputElement;

    let sourceText = signBit.value + " " + exponentBits.value + " " + mantissaBits.value;

    navigator.clipboard.writeText(sourceText)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
    });
}