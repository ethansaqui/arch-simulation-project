import { parse } from "path";

const convertButton = document.getElementById('convertButton') as HTMLInputElement;
const baseSelect = document.getElementById('baseSelect') as HTMLInputElement;
const binaryInput = document.getElementById('binaryInput') as HTMLInputElement;
const exponentInput = document.getElementById('exponentInput') as HTMLInputElement;

baseSelect.addEventListener('change', handleBaseSelectChange);

function inputReadOnly(value : boolean) {
    binaryInput.readOnly = value;
    exponentInput.readOnly = value; 
}

function handleBaseSelectChange() {
    inputReadOnly(false);
    if(baseSelect.value == '2')
        binaryInput.placeholder="Enter a binary mantissa"
    else if(baseSelect.value == '10')
        binaryInput.placeholder="Enter a decimal mantissa"
    else {
        binaryInput.placeholder="NaN"
        inputReadOnly(true);
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

/* since we're using ordinary ts, we can't use export or require due to it using commonJS for compilation making us need
to install webpack, so im just putting the conversion code here*/
function extractSign(mantissa : string) : string {
    if(mantissa[0] == '-') 
        return "1"
    return "0";
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

function normalizeMantissa(floatingPoint : Array<string>) {
    const mantissa = floatingPoint[2];
    var firstOnePosition = mantissa.indexOf('1');
    const radixPointPosition = mantissa.indexOf('.');

    if(firstOnePosition < radixPointPosition) {
        firstOnePosition++;

        floatingPoint[1] = (parseInt(floatingPoint[1]) + (radixPointPosition - firstOnePosition)).toString();
    }
    else
        floatingPoint[1] = (parseInt(floatingPoint[1]) - (firstOnePosition - radixPointPosition)).toString();
        

    var result = mantissa.split('');

    result.splice(radixPointPosition, 1);
    result.splice(firstOnePosition, 0, '.');
    result.splice(0, firstOnePosition - 1);
    if(result.length > 53) {
        result = result.slice(0, 53);
    }
    
    floatingPoint[2] = result.join('');

    while(floatingPoint[2].length < 54) {    
        floatingPoint[2] += "0";
    }
}

function split4Bits(value : string) : Array<string> {
    var result = [];
    for(var i = 0; i < value.length; i += 4) {
        result.push(value.slice(i, i + 4));
    }
    return result;
}

function convertToHex(value : string) : string {
    return parseInt(value, 2).toString(16);
}

function updateResult(floatingPoint : Array<string>) {
    const sign = floatingPoint[0];
    const exponent = floatingPoint[1];
    const mantissa = floatingPoint[2];
    const float64 = sign + exponent + mantissa.split('.')[1];

    const signBit = document.getElementById('signBit') as HTMLInputElement;
    const exponentBits = document.getElementById('exponentBits') as HTMLInputElement;
    const mantissaBits = document.getElementById('mantissaBits') as HTMLInputElement;
    const hexResult = document.getElementById('hexResult') as HTMLInputElement;

    signBit.value = sign;
    exponentBits.value = exponent;
    mantissaBits.value = mantissa.split('.')[1];
    
    hexResult.value = "0x" + split4Bits(float64).map(convertToHex).join('').toUpperCase();
}

export default function convertToFloat64(mantissa : string, exponent : string, base : number) : string {
    const sign = extractSign(mantissa);

    console.log(
        "Sign: " + sign + "\n" +
        "Mantissa: " + mantissa + "\n" +
        "Exponent: " + exponent + "\n" +
        "Base: " + base + "\n"
    )
    const floatingPoint = [sign, exponent, mantissa]

    if (base == 2) {
        normalizeMantissa(floatingPoint);
        floatingPoint[1] = convertExponentToBinary(floatingPoint[1]);
        console.log(floatingPoint);
        updateResult(floatingPoint);
    }


    return "0";
}
