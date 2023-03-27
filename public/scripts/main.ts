import convertToFloat64 from "./floatConverter";
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
    convertToFloat64(binaryInput.value, parseInt(exponentInput.value), parseInt(baseSelect.value));
    if(baseSelect.value == '2')
        console.log("Convert binary to float64");
    else if(baseSelect.value == '10')
        console.log("Convert decimal to float64");
    else
        console.log("NaN");
}