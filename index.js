var inquirer = require('inquirer');
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require('./helper');
const {getWalletBalance,transferSOL,airDropSol}=require("./solana");

const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
For checking whether the connection is successfully made
console.log(connection);

// const userWallet=web3.Keypair.generate();
// console.log(userWallet);

const userSecretKey = [
   73, 130, 131, 241, 139, 101,  39, 155,  42,  97, 159,
   19, 111, 208, 106, 107, 154, 204, 170, 254,  51,  52,
   49, 213,  46,  52, 149, 184, 233, 190, 160, 233, 194,
  128, 140, 197, 246,  54, 142, 148, 244,  24, 113,  36,
  181, 159,  26,   9, 210, 179, 249, 254, 137, 169,  83,
  233,  18, 198,  33,  42,  57, 243, 130,  13
];

const userWallet=web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));


/** Input from user:
 * Public Key & Secret Key of Wallet
 * Amount of Sol to be Staked (at max 2.5)
 * Ratio of Stake
 * Guess Number (between 1 to 5)

 Result:
 	Return Amount*Ratio
**/

console.log('SOL STAKE');
console.log('The max bidding amount is 2.5 SOL here');

const inquire_stake_details = async() => {
	return await inquirer
	  .prompt([
	      {
	      	type: 'input',
	      	name: 'betAmount',
	      	message: 'What is the amount of SOL you want to stake (max 2.5)?',
	      	validate: (input, hash) => { if (input >0 && input <= 2.5) return true; else return false;},
	      },
	      {
	      	type: 'input',
	      	name: 'ratio',
	      	message: 'What is the ratio of your staking?',
	      }
	  ])
	  .then((answers) => {
	    // Use user feedback for... whatever!!
	    // console.log(answers);
	    return answers;
	  })
	  .catch((error) => {
	    if (error.isTtyError) {
	      // Prompt couldn't be rendered in the current environment
	    } else {
	      // Something else went wrong
	    }
	  });
}

const inquire_player_guess = async() => {
	return await inquirer
	.prompt([{
		type: 'input',
		name: 'guess',
		message: 'Guess a random number from 1 to 5 (both 1, 5 included):',
		validate: (input, hash) => { if (input >=1 && input <= 5) return true; else return false;},
	}])
	.then((answers) => { return answers;})
	.catch((error) => {
	    if (error.isTtyError) {
	      // Prompt couldn't be rendered in the current environment
	    } else {
	      // Something else went wrong
	    }
	  });
}

const driver = async() => {
	const stake_inputs = await inquire_stake_details();

	const betAmount = totalAmtToBePaid(stake_inputs);
    console.log(`You need to pay ${betAmount} to move forward`);

    const rewardAmount = getReturnAmount(betAmount, ratio);
    console.log(`You will get ${rewardAmount} if guessing the number correctly`);

    const player_guess = await inquire_player_guess();
    console.log(`Signature of payment for playing the game: ${player_guess['guess']}`);

    const game_outcome = randomNumber(1,5);
    if (game_outcome == player_guess) {
    	console.log(`Your guess is absolutely correct`);
    	console.log(`Here is the price signature: `);
    } else {
    	console.log('Better luck next time');
    }
}

driver();