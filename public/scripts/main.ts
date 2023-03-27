
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

function normalizeMantissa(floatingPoint : Array<string>) {
    const mantissa = floatingPoint[2];
    var firstOnePosition = mantissa.indexOf('1');
    const radixPointPosition = mantissa.indexOf('.');

    if(firstOnePosition < radixPointPosition) {
        firstOnePosition++;

        floatingPoint[1] = (parseInt(floatingPoint[1]) - (radixPointPosition - firstOnePosition)).toString();
    }
    else
        floatingPoint[1] = (parseInt(floatingPoint[1]) + (firstOnePosition - radixPointPosition)).toString();
        

    var result = mantissa.split('');
    
    console.log(firstOnePosition," ", radixPointPosition)

    result.splice(radixPointPosition, 1);
    result.splice(firstOnePosition, 0, '.');
    result.splice(0, firstOnePosition - 1);
    if(result.length > 53) {
        result = result.slice(0, 53);
    }
    
    floatingPoint[2] = result.join('');
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
        console.log(floatingPoint);
    }
    return "0";
}
