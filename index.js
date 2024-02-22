require('dotenv').config();
const Web3 = require('web3');
const axios = require('axios');
const { getBalance, sendTransaction, getTransactionStatus, getLatestBlock } = require('./utils');
const { RPC_URL, PRIVATE_KEY, TO_ADDRESS, AMOUNT } = require('./config');

async function main() {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
    
    // Get account balance
    const balance = await getBalance(web3, TO_ADDRESS);
    console.log(`Account balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);

    // Send transaction
    const txHash = await sendTransaction(web3, PRIVATE_KEY, TO_ADDRESS, AMOUNT);
    console.log(`Transaction sent with hash: ${txHash}`);

    // Get transaction status
    const txStatus = await getTransactionStatus(web3, txHash);
    console.log(`Transaction status: ${txStatus}`);

    // Get latest block
    const block = await getLatestBlock(web3);
    console.log(`Latest block: ${JSON.stringify(block, null, 2)}`);
}

main().catch(console.error);