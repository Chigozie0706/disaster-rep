# DisasterGuard - Disaster Management DApp

A decentralized disaster reporting and management system built on the Celo mainnet blockchain. This application allows users to report disasters, upload evidence to IPFS, and track emergency situations in real-time.

## Features

- 🚨 **Real-time Disaster Reporting** - Report disasters with location data and photo evidence
- 🔐 **Blockchain Security** - All reports stored securely on Celo blockchain
- 🌍 **Global Coverage** - Track disasters from anywhere in the world
- 📸 **IPFS Image Storage** - Decentralized image storage for evidence
- 👥 **Community Driven** - Community-based disaster response system
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and TailwindCSS

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Blockchain**: Celo, Ethers.js
- **Storage**: IPFS (Pinata)
- **UI Components**: Radix UI, shadcn/ui
- **Routing**: React Router v6

## Smart Contract Functions

The DApp interacts with the following smart contract functions:

- `createDisasterReport()` - Create a new disaster report
- `getDisasterReport()` - Fetch report details
- `getDisasterReportLength()` - Get total number of reports
- `addDisasterImage()` - Add additional images to a report
- `getDisasterImages()` - Fetch all images for a report
- `deleteDisasterImage()` - Delete an image (owner only)
- `deleteDisasterReport()` - Delete entire report (owner only)

## Getting Started

### Prerequisites

- Node.js 16+
- MetaMask or compatible Web3 wallet
  -- Celo mainnet CELO tokens for transactions

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd disaster-management-dapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

   Update the following in `.env.local`:

   - `REACT_APP_PINATA_API_KEY`: Pinata API key (optional)
   - `REACT_APP_PINATA_SECRET_API_KEY`: Pinata secret key (optional)

4. The contract is already deployed on Celo mainnet at: `0x843E0Be78374B33a233d05b7624044EC28717135`

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### IPFS Setup (Optional)

For production, set up Pinata for IPFS storage:

1. Create account at [Pinata](https://pinata.cloud)
2. Generate API keys
3. Add keys to `.env.local`

If no API keys are provided, the app uses a mock IPFS service for development.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and connect your Celo-compatible wallet
2. **Create Report**: Fill out the disaster report form with location and evidence
3. **View Reports**: Browse all community disaster reports
4. **Manage Reports**: If you're the report owner, you can add more images or delete the report

## Smart Contract Deployment

To deploy your own contract:

1. Deploy the smart contract to Celo Alfajores testnet
2. Update `DISASTER_CONTRACT_ADDRESS` in the configuration files
3. Ensure your wallet has CELO testnet tokens for gas fees

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── ReportCard.tsx  # Report display card
│   ├── ReportForm.tsx  # Create report form
│   ├── ImageUploader.tsx # IPFS image uploader
│   └── WalletConnectButton.tsx # Wallet connection
├── pages/              # Page components
│   ├── LandingPage.tsx # Home page
│   ├── CreateReportPage.tsx # Create report page
│   ├── ReportsPage.tsx # All reports page
│   └── ReportDetailPage.tsx # Individual report page
├── lib/                # Utility libraries
│   ├── disasterContract.ts # Smart contract interactions
│   ├── ipfsService.ts  # IPFS upload service
│   ├── walletService.ts # Wallet connection service
│   └── config.ts       # Network configuration
├── hooks/              # Custom React hooks
│   └── useWallet.ts    # Wallet state management
└── App.tsx             # Main application component
```

## Building for Production

```bash
npm run build
```

The build files will be in the `dist/` directory.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any static hosting service:

- Netlify
- GitHub Pages
- Firebase Hosting
- IPFS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue on GitHub
- Check the documentation at [docs.plena.finance](https://docs.plena.finance)

---

Built with ❤️ for disaster response and community safety on Celo blockchain.
"# disaster-rep"
