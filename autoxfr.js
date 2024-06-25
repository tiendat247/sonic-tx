const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables from .env file
dotenv.config();

const connection = new web3.Connection('https://devnet.sonic.game', 'confirmed');

const privateKey = process.env.PRIVATE_KEY;
const recipientAddress = process.env.RECIPIENT_ADDRESS;

if (!privateKey || !recipientAddress) {
  console.error('Missing PRIVATE_KEY or RECIPIENT_ADDRESS in the .env file');
  process.exit(1);
}

const fromWallet = web3.Keypair.fromSecretKey(bs58.decode(privateKey));
const recipientPublicKey = new web3.PublicKey(recipientAddress);

const sol = 1000000000;
const lamportsToSend = Math.floor(0.0001 * sol); // Convert SOL to lamports

const getRandomDelay = () => {
  // Generate a random delay between 15 and 20 seconds
  return Math.floor(Math.random() * 6 + 15) * 1000;
};

let transferCount = 0;
const maxTransfers = 110;

const transferToRecipient = async () => {
  if (transferCount >= maxTransfers) {
    console.log('Completed 110 transfers. Waiting for the next schedule to start again...');
    transferCount = 0; // Reset the transfer count for the next run
    return;
  }

  try {
    const balanceMainWallet = await connection.getBalance(fromWallet.publicKey);
    const balanceLeft = balanceMainWallet - lamportsToSend;

    if (balanceLeft < 0) {
      console.log('Not enough balance to transfer');
    } else {
      console.log('Wallet A balance:', balanceMainWallet);

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: recipientPublicKey,
          lamports: lamportsToSend,
        })
      );

      const signature = await web3.sendAndConfirmTransaction(connection, transaction, [fromWallet]);
      console.log('Transfer signature:', signature);

      const balanceOfWalletB = await connection.getBalance(recipientPublicKey);
      console.log('Wallet B balance:', balanceOfWalletB);
    }

    transferCount++;
    console.log(`Transfers completed: ${transferCount}/${maxTransfers}`);

    if (transferCount < maxTransfers) {
      const delay = getRandomDelay();
      console.log(`Next transfer in ${delay / 1000} seconds`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      transferToRecipient(); // Recursive call for continuous transfers
    }
  } catch (error) {
    console.error('Error during transfer:', error.message);
  }
};

// Schedule the task to run every 24 hours
cron.schedule('0 0 * * *', () => {
  console.log('Starting scheduled transfer process...');
  transferToRecipient();
}, {
  timezone: "Etc/UTC"
});

// Start the initial transfer process immediately
transferToRecipient();
