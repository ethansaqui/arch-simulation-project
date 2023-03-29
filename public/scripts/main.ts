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
    if(baseSelect.value == '2')
        binaryInput.placeholder="Enter a binary mantissa"
    else if(baseSelect.value == '10')
        binaryInput.placeholder="Enter a decimal mantissa"
    else {
        binaryInput.placeholder="NaN"
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
    var result = mantissa;
    const originalRadixPointPosition = result.indexOf('.');
    var newRadixPointPosition = Math.max(originalRadixPointPosition + parseInt(exponent), 0);
    var exponentValue = parseInt(exponent);
    var resLength = result.length;
    var resArray = result.split(''); // 1, 0, . , 2
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
    console.log(resultArr.join(''))
    return resultArr.join('');
}

function convertDecimalToBinary(input: FloatingPoint) : FloatingPoint {
    const mantissa = input.mantissa;
    const exponent = input.exponent;

    const normalizedMantissa = normalizeDecimalPoint(mantissa, exponent);
    // separate mantissa into 2 parts: 1 after the decimal point and 1 before the decimal point
    const mantissaParts = normalizedMantissa.split('.');
    console.log(mantissaParts)
    const beforeDecimalPoint = mantissaParts[0];
    const afterDecimalPoint = mantissaParts[1];

    // convert the after decimal point part to binary as a fraction
    var afterDecimalPointBinary = "";
    var afterDecimalPointValue = parseInt(afterDecimalPoint) / Math.pow(10, afterDecimalPoint.length);

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
    while(beforeDecimalPointValue > 0) {
        beforeDecimalPointBinary = (beforeDecimalPointValue % 2).toString() + beforeDecimalPointBinary;
        beforeDecimalPointValue = Math.floor(beforeDecimalPointValue / 2);
    }

    // combine the 2 parts
    var result = beforeDecimalPointBinary + "." + afterDecimalPointBinary;
   
    return {sign: input.sign,
            exponent: "0",
            mantissa: result,
            base: input.base} as FloatingPoint;
}

function convertExponentToBinary(value: string) : string {
    console.log(parseInt(value))
    var result = parseInt(value) + 1023;
    console.log(result)
    var binary = result.toString(2);
    while(binary.length < 11) {
        binary = "0" + binary;
    }
    return binary;
}

function normalizeBinaryMantissa(input : FloatingPoint) : FloatingPoint {
    var mantissa = input.mantissa;
    var exponent = input.exponent;
    var firstOnePosition = mantissa.indexOf('1');
    const radixPointPosition = mantissa.indexOf('.');

    if(firstOnePosition < radixPointPosition) {
        firstOnePosition++;

        exponent = (parseInt(exponent) + (radixPointPosition - firstOnePosition)).toString();
    }
    else
        exponent = (parseInt(exponent) - (firstOnePosition - radixPointPosition)).toString();
        

    var result = mantissa.split('');
    result.splice(radixPointPosition, 1);
    result.splice(firstOnePosition, 0, '.');
    result.splice(0, firstOnePosition - 1);
    if(result.length > 53) {
        result = result.slice(0, 53);
    }
    
    mantissa = result.join('');

    while(mantissa.length < 54) {    
        mantissa += "0";
    }

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

function handleSpecialCases(result : FloatingPoint) : FloatingPoint {
    // Case 1: Zero
    if (result.mantissa.indexOf('1') == -1){
        result.exponent = "-1023";
    }
    // Case 2: Infinity
    else if (parseInt(result.exponent) > 1023) {
        result.exponent = "1024";
        result.mantissa = "1.0";
        result = normalizeBinaryMantissa(result);
    }
    // Case 3: NaN
    if (Number.isNaN(result.base)){
        result.exponent = "1024";
        result.mantissa = "1.10";    // Assume qNAN
        result = normalizeBinaryMantissa(result);
    }    
    return result;
}

export default function convertToFloat64(mantissa : string, exponent : string, base : number) : string {
    const sign = extractSign(binaryInput.value);

    console.log(
        "Sign: " + sign + "\n" +
        "Mantissa: " + mantissa + "\n" +
        "Exponent: " + exponent + "\n" +
        "Base: " + base + "\n"
    )
    const input = {
        sign: sign,
        mantissa: mantissa,
        exponent: exponent,
        base: base
    }

    if(input.mantissa.indexOf('.') == -1) {
        input.mantissa += ".0";
    }

    var result : FloatingPoint;
    if (base == 2)
        result = normalizeBinaryMantissa(input);
    else if (base == 10) 
        result = convertDecimalToBinary(input);
    else
        result = {sign: "0", mantissa: "0", exponent: "0", base: NaN} as FloatingPoint;

    result = normalizeBinaryMantissa(result);
    result = handleSpecialCases(result);
    console.log(result);
    result.exponent = convertExponentToBinary(result.exponent);
    displayResults(result);

    return "0";
}
