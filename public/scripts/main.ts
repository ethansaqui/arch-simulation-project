

const baseSelect = document.getElementById('baseSelect') as HTMLInputElement;
const binaryInput = document.getElementById('binaryInput') as HTMLInputElement;
const exponentInput = document.getElementById('exponentInput') as HTMLInputElement;

baseSelect.addEventListener('change', handleBaseSelectChange);

function handleBaseSelectChange() {
    binaryInput.disabled = false;
    exponentInput.disabled = false;
    if(baseSelect.value == '2')
        binaryInput.placeholder="Enter a binary mantissa"
    else if(baseSelect.value == '10')
        binaryInput.placeholder="Enter a decimal mantissa"
    else {
        binaryInput.placeholder="NaN"
        binaryInput.disabled = true;
        exponentInput.disabled = true;
    }
        
}
