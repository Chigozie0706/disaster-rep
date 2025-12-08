const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");

  // Self Protocol Hub V2 addresses
  // For Celo Mainnet (production)
  const hubV2 = "0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF";

  // Convert string scope to bytes32
  const scopeBytes32 = ethers.encodeBytes32String(scopeSeed);

  // Your application scope (unique identifier for your app)
  const scopeSeed = "Disaster-Management";

  console.log("\nDeploying DisasterManagement contract...");
  console.log("Hub Address:", hubV2);
  console.log("Scope:", scopeSeed);

  const DisasterManagement = await ethers.getContractFactory(
    "DisasterManagement"
  );

  const disasterManagement = await DisasterManagement.deploy(hubV2, scopeSeed);

  console.log("\nWaiting for deployment...");
  await disasterManagement.waitForDeployment();

  const deployedAddress = await disasterManagement.getAddress();

  console.log("\n✅ DisasterManagement deployed to:", deployedAddress);
  console.log("\nConfiguration:");
  console.log("- Network: Celo Mainnet");
  console.log("- Hub Address:", hubV2);
  console.log("- Scope:", scopeSeed);
  console.log("- Age Requirement: 18+");

  console.log("\n📝 Update your frontend:");
  console.log(`const DISASTER_CONTRACT_ADDRESS = "${deployedAddress}";`);
  console.log(`endpointType: "prod_celo"`);
  console.log(`devMode: false`);

  console.log("\n🔍 To verify on Celoscan:");
  console.log(
    `npx hardhat verify --network celo_mainnet ${deployedAddress} "${hubV2}" "${scopeSeed}"`
  );

  console.log(
    "\n⚠️ Important: Get your Config ID from https://tools.self.xyz/"
  );
  console.log("Then update the getConfigId() function in your contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
