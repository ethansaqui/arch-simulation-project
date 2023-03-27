

const baseSelect = document.getElementById('baseSelect') as HTMLInputElement;
const binaryInput = document.getElementById('binaryInput') as HTMLInputElement;

baseSelect.addEventListener('change', handleBaseSelectChange);

function handleBaseSelectChange() {
    if(baseSelect.value == '2')
        binaryInput.placeholder="Enter a binary mantissa"
    else
        binaryInput.placeholder="Enter a decimal mantissa"
}
