var inquirer = require('inquirer');
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require('./helper');
const {getWalletBalance,transferSOL,airDropSol}=require("./solana");
const web3 = require("@solana/web3.js");

// const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
// For checking whether the connection is successfully made
// console.log(connection);

// const userWallet=web3.Keypair.generate();
// console.log(userWallet);

const treasurySecretKey = Uint8Array.from([
   73, 130, 131, 241, 139, 101,  39, 155,  42,  97, 159,
   19, 111, 208, 106, 107, 154, 204, 170, 254,  51,  52,
   49, 213,  46,  52, 149, 184, 233, 190, 160, 233, 194,
  128, 140, 197, 246,  54, 142, 148, 244,  24, 113,  36,
  181, 159,  26,   9, 210, 179, 249, 254, 137, 169,  83,
  233,  18, 198,  33,  42,  57, 243, 130,  13
]);


const userSecretKey = Uint8Array.from([
      169, 250,  53, 145, 100, 156, 218, 126, 117, 111, 168,
       66,  60,  26, 228, 214, 253, 154,   6, 154,   6, 132,
       17,  86, 160,  90, 192, 190, 233, 147, 247, 112,  33,
      125,  59, 145, 114, 165,  30, 216, 212, 181, 181,  58,
       24, 177,  26, 171,  73, 119, 117,  71, 231, 224,  85,
      147,  61,  18,  97,  99,  45, 189,  52, 188
    ]);

const userWallet=web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
const treasuryWallet=web3.Keypair.fromSecretKey(Uint8Array.from(treasurySecretKey));

const userPublicKey = userWallet.publicKey;
const treasuryPublicKey = treasuryWallet.publicKey;

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

    const rewardAmount = getReturnAmount(stake_inputs);
    console.log(`You will get ${rewardAmount} if guessing the number correctly`);

    const player_guess = await inquire_player_guess();
    const payment_signature = await transferSOL(userWallet, treasuryWallet, betAmount);
    console.log(`Signature of payment for playing the game: ${payment_signature}`);

    const game_outcome = randomNumber(1,5);
    if (game_outcome == player_guess) {
    	console.log(`Your guess is absolutely correct`);    	
    	const price_signature = await transferSOL(treasuryWallet, userWallet, rewardAmount);
    	console.log(`Here is the price signature: `);
    } else {
    	console.log('Better luck next time');
    }
}

driver();