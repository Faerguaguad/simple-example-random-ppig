async function getBalance(web3, address) {
    return await web3.eth.getBalance(address);
}

async function sendTransaction(web3, privateKey, toAddress, amount) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const tx = {
        from: account.address,
        to: toAddress,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: '21000', // Gas limit
        gasPrice: await web3.eth.getGasPrice(),
        nonce: await web3.eth.getTransactionCount(account.address)
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return txHash.transactionHash;
}

async function getTransactionStatus(web3, txHash) {
    const tx = await web3.eth.getTransaction(txHash);
    return tx ? 'Confirmed' : 'Pending';
}

async function getLatestBlock(web3) {
    return await web3.eth.getBlock('latest');
}

module.exports = { getBalance, sendTransaction, getTransactionStatus, getLatestBlock };
