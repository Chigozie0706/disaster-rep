import { ethers } from 'ethers';
import { getNetworkConfig } from './config';

// Smart Contract ABI for DisasterManagement
export const DISASTER_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "_imageUrl", "type": "string" },
      { "internalType": "string", "name": "_timestamp", "type": "string" }
    ],
    "name": "addDisasterImage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_reporterName", "type": "string" },
      { "internalType": "string", "name": "_email", "type": "string" },
      { "internalType": "string", "name": "_disasterType", "type": "string" },
      { "internalType": "string", "name": "_imgUrl", "type": "string" },
      { "internalType": "string", "name": "_latitude", "type": "string" },
      { "internalType": "string", "name": "_longitude", "type": "string" },
      { "internalType": "string", "name": "_city", "type": "string" },
      { "internalType": "string", "name": "_state", "type": "string" },
      { "internalType": "string", "name": "_date", "type": "string" },
      { "internalType": "string", "name": "_severity", "type": "string" },
      { "internalType": "string", "name": "_impact", "type": "string" }
    ],
    "name": "createDisasterReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "uint256", "name": "imageIndex", "type": "uint256" }
    ],
    "name": "deleteDisasterImage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "deleteDisasterReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "getDisasterImages",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "reporterId", "type": "address" },
          { "internalType": "string", "name": "timestamp", "type": "string" },
          { "internalType": "string", "name": "disasterImageUrl", "type": "string" }
        ],
        "internalType": "struct DisasterManagement.DisasterImage[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }],
    "name": "getDisasterReport",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDisasterReportLength",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

import { DisasterManagementAddress } from '@/contracts/contractAddress';
import DisasterManagementABI from '@/abis/DisasterManagementABIFile.json';

export interface DisasterReport {
  reporterId: string;
  reporterName: string;
  email: string;
  disasterType: string;
  imgUrl: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  date: string;
  severity: string;
  impact: string;
}

export interface DisasterImage {
  reporterId: string;
  timestamp: string;
  disasterImageUrl: string;
}

export class DisasterContractService {
  private contract: ethers.Contract | null = null;
  private readOnlyProvider: ethers.providers.JsonRpcProvider;

  constructor() {
    // Use Celo mainnet JsonRpcProvider for read-only operations
    this.readOnlyProvider = new ethers.providers.JsonRpcProvider(getNetworkConfig().rpcUrl);
  }

  private getReadContract() {
    return new ethers.Contract(
      DisasterManagementAddress,
      DisasterManagementABI,
      this.readOnlyProvider
    );
  }

  private async getWriteContract() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet provider available');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.validateNetwork(provider);
    
    const signer = provider.getSigner();
    return new ethers.Contract(
      DisasterManagementAddress,
      DisasterManagementABI,
      signer
    );
  }

  private async validateNetwork(provider: ethers.providers.Web3Provider): Promise<void> {
    const network = await provider.getNetwork();
    const targetChainId = getNetworkConfig().chainId;
    
    if (network.chainId !== targetChainId) {
      await this.switchToCeloMainnet(provider);
    }
  }

  private async switchToCeloMainnet(provider: ethers.providers.Web3Provider): Promise<void> {
    const config = getNetworkConfig();
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${config.chainId.toString(16)}` }
      ]);
    } catch (error: any) {
      if (error.code === 4902) {
        await provider.send('wallet_addEthereumChain', [{
          chainId: `0x${config.chainId.toString(16)}`,
          chainName: config.name,
          nativeCurrency: {
            name: config.ticker,
            symbol: config.ticker,
            decimals: config.decimals
          },
          rpcUrls: [config.rpcUrl],
          blockExplorerUrls: [config.explorerUrl]
        }]);
      } else {
        throw error;
      }
    }
  }

  async getReportCount(): Promise<number> {
    try {
      const contract = this.getReadContract();
      const count = await contract.getDisasterReportLength();
      return count.toNumber();
    } catch (error) {
      console.error('Error fetching report count:', error);
      return 0;
    }
  }

  async getReport(index: number): Promise<DisasterReport | null> {
    try {
      const contract = this.getReadContract();
      const result = await contract.getDisasterReport(index);
      
      return {
        reporterId: result[0],
        reporterName: result[1],
        email: result[2],
        disasterType: result[3],
        imgUrl: result[4],
        latitude: result[5],
        longitude: result[6],
        city: result[7],
        state: result[8],
        date: result[9],
        severity: result[10],
        impact: result[11]
      };
    } catch (error) {
      console.error('Error fetching report:', error);
      return null;
    }
  }

  async getAllReports(): Promise<DisasterReport[]> {
    try {
      const count = await this.getReportCount();
      const reports: DisasterReport[] = [];

      for (let i = 0; i < count; i++) {
        const report = await this.getReport(i);
        if (report) {
          reports.push(report);
        }
      }

      return reports;
    } catch (error) {
      console.error('Error fetching all reports:', error);
      return [];
    }
  }

  async createReport(reportData: Omit<DisasterReport, 'reporterId'>): Promise<ethers.ContractTransaction> {
    const contract = await this.getWriteContract();
    
    return await contract.createDisasterReport(
      reportData.reporterName,
      reportData.email,
      reportData.disasterType,
      reportData.imgUrl,
      reportData.latitude,
      reportData.longitude,
      reportData.city,
      reportData.state,
      reportData.date,
      reportData.severity,
      reportData.impact
    );
  }

  async deleteReport(index: number): Promise<ethers.ContractTransaction> {
    const contract = await this.getWriteContract();
    return await contract.deleteDisasterReport(index);
  }

  async getReportImages(index: number): Promise<DisasterImage[]> {
    try {
      const contract = this.getReadContract();
      const images = await contract.getDisasterImages(index);
      
      return images.map((img: any) => ({
        reporterId: img.reporterId,
        timestamp: img.timestamp,
        disasterImageUrl: img.disasterImageUrl
      }));
    } catch (error) {
      console.error('Error fetching report images:', error);
      return [];
    }
  }

  async addReportImage(reportIndex: number, imageUrl: string, timestamp: string): Promise<ethers.ContractTransaction> {
    const contract = await this.getWriteContract();
    return await contract.addDisasterImage(reportIndex, imageUrl, timestamp);
  }

  async deleteReportImage(reportIndex: number, imageIndex: number): Promise<ethers.ContractTransaction> {
    const contract = await this.getWriteContract();
    return await contract.deleteDisasterImage(reportIndex, imageIndex);
  }
}

export const disasterContractService = new DisasterContractService();