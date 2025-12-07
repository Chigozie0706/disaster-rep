const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying DisasterManagement contract to Celo Mainnet...');

  // Get the contract factory
  const DisasterManagement = await ethers.getContractFactory('DisasterManagement');

  // Deploy the contract
  const disasterManagement = await DisasterManagement.deploy();

  // Wait for deployment
  await disasterManagement.deployed();

  console.log('✅ DisasterManagement deployed to:', disasterManagement.address);
  console.log('📝 Transaction hash:', disasterManagement.deployTransaction.hash);
  
  // Verify on Celo Explorer
  console.log('🔍 Verify contract at:', `https://explorer.celo.org/address/${disasterManagement.address}`);
  
  // Save deployment info
  const deploymentInfo = {
    address: disasterManagement.address,
    transactionHash: disasterManagement.deployTransaction.hash,
    blockNumber: disasterManagement.deployTransaction.blockNumber,
    network: 'celo-mainnet',
    timestamp: new Date().toISOString()
  };

  console.log('💾 Deployment Info:', JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
