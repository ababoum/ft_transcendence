"use strict";
const person = {
    name: 'lola',
    surname: 'lili',
    age: 30,
    favoriteThings: ['lala', 2]
};
var Role;
(function (Role) {
    Role["ADMIN"] = "adm";
    Role[Role["READ_ONLY"] = 1] = "READ_ONLY";
    Role[Role["AUTHOR"] = 2] = "AUTHOR";
})(Role || (Role = {}));
;
function combine(number1, number2) {
    let result;
    if (typeof number1 === 'number' && typeof number2 === 'number') {
        result = number1 + number2;
    }
    else {
        result = +number1 + +number2;
    }
    return result;
}
console.log(combine(2, 3));
console.log(combine('2', '3'));
console.log(combine(2, '3'));
// button 
const button = document.querySelector('button');
if (button) {
    button.addEventListener("click", clickHandler);
}
function clickHandler() {
    console.log("Prout !\n");
}
//# sourceMappingURL=app.js.map