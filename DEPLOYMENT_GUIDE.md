# 🚀 Celo Mainnet Deployment Guide

## 📋 Prerequisites

Before deploying to Celo mainnet, ensure you have:

- [ ] CELO tokens for gas fees (~5-10 CELO recommended)
- [ ] MetaMask or compatible wallet with your deployment account
- [ ] Private key for deployment (keep secure!)

## ⚡ Quick Deployment Steps

### 1. Install Dependencies

```bash
npm install hardhat @nomiclabs/hardhat-ethers
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Add your private key to `.env.local`:
```
PRIVATE_KEY=your_wallet_private_key_here
```

### 3. Deploy Contract

```bash
# Deploy to Celo mainnet
npx hardhat run scripts/deploy.js --network celo
```

### 4. Update Contract Address

After deployment, copy the contract address and update:

**In `.env.local`:**
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourNewContractAddress
```

**In `src/contracts/address.ts`:**
```typescript
export const DISASTER_CONTRACT_ADDRESS = "0xYourNewContractAddress";
```

### 5. Test the Deployment

```bash
# Start the development server
npm run dev

# Visit http://localhost:3000
# Connect wallet and test creating a report
```

## 🔍 Verify Deployment

1. Visit [Celo Explorer](https://explorer.celo.org)
2. Search for your contract address
3. Verify the contract is deployed correctly
4. Check the contract functions are available

## 💰 Gas Cost Estimates

- **Deploy Contract**: ~0.5-1 CELO
- **Create Report**: ~0.01-0.02 CELO
- **Add Image**: ~0.005-0.01 CELO
- **Delete Report**: ~0.01-0.02 CELO

## 🛡️ Security Checklist

- [ ] Contract address updated in all files
- [ ] Private key stored securely (never commit to git)
- [ ] Test with small amounts first
- [ ] Verify all contract functions work correctly
- [ ] Check gas estimates are reasonable

## 🚨 Troubleshooting

**Deployment Failed:**
- Check you have enough CELO for gas
- Verify private key is correct
- Ensure network connection is stable

**Contract Calls Failing:**
- Verify contract address is correct
- Check wallet is connected to Celo mainnet
- Ensure sufficient CELO for gas fees

**Wrong Network:**
- DApp will auto-switch to Celo mainnet
- Make sure MetaMask has Celo mainnet added

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify transaction on Celo Explorer
3. Ensure all environment variables are set
4. Test with a small transaction first

---

🎉 **Ready to Deploy!** Follow these steps and your DisasterGuard dApp will be live on Celo mainnet!
