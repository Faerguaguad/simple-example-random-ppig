module.exports = {
    RPC_URL: process.env.RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    PRIVATE_KEY: process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY',
    TO_ADDRESS: process.env.TO_ADDRESS || '0xRecipientAddress',
    AMOUNT: process.env.AMOUNT || '0.1' // ETH
};
