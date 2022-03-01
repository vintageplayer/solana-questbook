const {
  Connection,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  SystemProgram,
  Keypair,
} = require('@solana/web3.js');
const fs   = require('mz/fs');

async function getConnection() {
  // const rpcUrl = 'http://localhost:8899';
  const rpcUrl = 'http://127.0.0.1:8899';
  connection = new Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);
  return connection;
}

async function createKeypairFromFile() {
  // const secretKeyString = await fs.readFile("~/.config/solana/id.json", {encoding: 'utf8'});
  const secretKeyString = await fs.readFile("/Users/adityaagarwal/.config/solana//id.json", {encoding: 'utf8'});
  // console.log(secretKeyString);
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

async function createAccount() {
  connection = await getConnection();
  const signer = await createKeypairFromFile();
  const newAccountPubkey = await PublicKey.createWithSeed(
    signer.publicKey,
    "campaign1",
    new PublicKey("GzgnghHk4oXFrFLoomEEFri3NWmmtQPA3axBSvAo9cFV"),
  );
  const lamports = await connection.getMinimumBalanceForRentExemption(
    1024,
  );
  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: signer.publicKey,
    basePubkey: signer.publicKey,
    seed: "campaign1",
    newAccountPubkey,
    lamports,
    space: 1024,
    programId : new PublicKey("GzgnghHk4oXFrFLoomEEFri3NWmmtQPA3axBSvAo9cFV"),
  });
  const transaction = new Transaction().add(
    instruction
  );

  console.log(`The address of campaign1 account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction, [signer]);

}

createAccount();