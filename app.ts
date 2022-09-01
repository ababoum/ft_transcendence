const person: {
	favoriteThings: [string, number],
	name: string,
	surname: string,
	age: number,
} = {
	name: 'lola',
	surname: 'lili',
	age: 30,
	favoriteThings: ['lala', 2]
};

enum Role {
	ADMIN = 'adm', READ_ONLY = 1, AUTHOR
};



function combine (number1: number | string, number2: number | string)
{
	let result: number;

	if (typeof number1 === 'number' && typeof number2 === 'number')
	{
		result = number1 + number2;
	}
	else
	{
		result = +number1 + +number2;
	}

	return result;
}

console.log(combine(2, 3));
console.log(combine('2', '3'));
console.log(combine(2, '3'));


