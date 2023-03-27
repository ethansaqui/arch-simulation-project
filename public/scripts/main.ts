

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
