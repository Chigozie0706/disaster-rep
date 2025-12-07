require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    celo: {
      url: "https://forno.celo.org",
      accounts: [
        // Add your private key here (use environment variable for security)
        process.env.PRIVATE_KEY || "your_private_key_here"
      ],
      chainId: 42220,
    }
  }
};
