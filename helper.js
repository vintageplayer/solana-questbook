const getReturnAmount = (inputs) => {
	const betAmount = inputs['betAmount'];
    const ratio = inputs['ratio'];
	return parseFloat(ratio.split(':')[1]) * betAmount;
};

const totalAmtToBePaid = (inputs) => {return inputs['betAmount'];};
const randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min;
};

module.exports = {getReturnAmount, totalAmtToBePaid, randomNumber}