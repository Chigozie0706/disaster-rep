// Update this address after deploying to Celo mainnet
export const DISASTER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x1234567890123456789012345678901234567890";

// Deployment info (update after deployment)
export const CONTRACT_DEPLOYMENT_INFO = {
  address: DISASTER_CONTRACT_ADDRESS,
  network: 'celo-mainnet',
  chainId: 42220,
  deployedAt: '', // Update with deployment timestamp
  transactionHash: '', // Update with deployment tx hash
  blockNumber: 0 // Update with deployment block number
};
