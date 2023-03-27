

function normalizeMantissa (mantissa : string) : string {
    if (mantissa.length > 0) {
        if (mantissa.length > 53) {
            mantissa = mantissa.slice(0, 53);
        }
    }
    console.log(mantissa.length)
    return ""
}


export default function convertToFloat64(mantissa : string, exponent : number, base : number) : string {
    console.log(
        "Mantissa: " + mantissa + "\n" +
        "Exponent: " + exponent + "\n" +
        "Base: " + base + "\n"
    )
    if (base == 2) {
        mantissa = normalizeMantissa(mantissa);
    }
    return "0";
}


