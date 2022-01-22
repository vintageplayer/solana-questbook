// const {
// 	Connection,
// 	PublicKey,
// 	clusterApiUrl,
// 	Keypair,
// 	LAMPORTS_PER_SOL,
// 	Transaction,
// 	Account,
// } = require('@solana/web3.js');
const web3 = require("@solana/web3.js");

// const newPair = new Keypair();
// console.log(newPair);

// const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
// const secretKey = newPair._keypair.secretKey.toString();

// console.log(publicKey);
// console.log(secretKey);

const userPublicKey = '3DNE4KZzF4mfJNybihLDAZBKvon23V7Pic33g3Zrvkig';
const userSecretKey = Uint8Array.from([
   73, 130, 131, 241, 139, 101,  39, 155,  42,  97, 159,
   19, 111, 208, 106, 107, 154, 204, 170, 254,  51,  52,
   49, 213,  46,  52, 149, 184, 233, 190, 160, 233, 194,
  128, 140, 197, 246,  54, 142, 148, 244,  24, 113,  36,
  181, 159,  26,   9, 210, 179, 249, 254, 137, 169,  83,
  233,  18, 198,  33,  42,  57, 243, 130,  13
]);


const treasurySecretKey = Uint8Array.from([
      169, 250,  53, 145, 100, 156, 218, 126, 117, 111, 168,
       66,  60,  26, 228, 214, 253, 154,   6, 154,   6, 132,
       17,  86, 160,  90, 192, 190, 233, 147, 247, 112,  33,
      125,  59, 145, 114, 165,  30, 216, 212, 181, 181,  58,
       24, 177,  26, 171,  73, 119, 117,  71, 231, 224,  85,
      147,  61,  18,  97,  99,  45, 189,  52, 188
    ]);

const userWallet= web3.Keypair.fromSecretKey(userSecretKey);
// const publicKey = new PublicKey(userWallet).toString();

const getWalletBalance = async (pubk)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const balance=await connection.getBalance(new web3.PublicKey(pubk));
        console.log(`Wallet balance : ${balance/web3.LAMPORTS_PER_SOL} SOL`);
        return balance/web3.LAMPORTS_PER_SOL;
    }catch(err){
        console.log(err);
    }
}
const airDropSol = async() => {
	try {
		const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
		const walletKeyPair = await web3.Keypair.fromSecretKey(userSecretKey);
		console.log(`-- Airdropping 2 SOL --`);
		const fromAirDropSignature = await connection.requestAirdrop(
			new web3.PublicKey(walletKeyPair.userPublicKey),
			2 * web3.LAMPORTS_PER_SOL
		);
		await connection.confirmTransaction(fromAirDropSignature);
	} catch (err) {
		console.log(err);
	}
};

const driverFunction = async () => {
	await getWalletBalance(userPublicKey);
	await airDropSol();
	await getWalletBalance(userPublicKey);
}

const transferSOL=async (from,to,transferAmt)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
	    const transaction=new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey:new web3.PublicKey(from.publicKey.toString()),
                toPubkey:new web3.PublicKey(to.publicKey.toString()),
                lamports:transferAmt*web3.LAMPORTS_PER_SOL
            })
        )
        const signature=await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        console.log('Signature is ',signature);
        return signature;
    }catch(err){
        console.log(err);
    }
};


driverFunction();