import { ethers } from 'ethers';
import { DisasterManagementAddress } from '@/contracts/contractAddress';
import DisasterManagementABI from '@/abis/DisasterManagementABIFile.json';
import { CELO_MAINNET_CONFIG } from './config';

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

class ContractTransactionService {
  private readOnlyProvider: ethers.providers.JsonRpcProvider;
  private readOnlyContract: ethers.Contract;

  constructor() {
    this.readOnlyProvider = new ethers.providers.JsonRpcProvider(CELO_MAINNET_CONFIG.rpcUrl);
    this.readOnlyContract = new ethers.Contract(
      DisasterManagementAddress,
      DisasterManagementABI,
      this.readOnlyProvider
    );
  }

  private async getWriteContract(): Promise<ethers.Contract> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet provider available');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.validateNetwork(provider);
    
    const signer = provider.getSigner();
    return new ethers.Contract(DisasterManagementAddress, DisasterManagementABI, signer);
  }

  private async validateNetwork(provider: ethers.providers.Web3Provider): Promise<void> {
    const network = await provider.getNetwork();
    const targetChainId = CELO_MAINNET_CONFIG.chainId;
    
    if (network.chainId !== targetChainId) {
      await this.switchToCeloMainnet(provider);
    }
  }

  private async switchToCeloMainnet(provider: ethers.providers.Web3Provider): Promise<void> {
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${CELO_MAINNET_CONFIG.chainId.toString(16)}` }
      ]);
    } catch (error: any) {
      if (error.code === 4902) {
        await provider.send('wallet_addEthereumChain', [{
          chainId: `0x${CELO_MAINNET_CONFIG.chainId.toString(16)}`,
          chainName: CELO_MAINNET_CONFIG.name,
          nativeCurrency: {
            name: CELO_MAINNET_CONFIG.ticker,
            symbol: CELO_MAINNET_CONFIG.ticker,
            decimals: CELO_MAINNET_CONFIG.decimals
          },
          rpcUrls: [CELO_MAINNET_CONFIG.rpcUrl],
          blockExplorerUrls: [CELO_MAINNET_CONFIG.explorerUrl]
        }]);
      } else {
        throw error;
      }
    }
  }

  async getReportCount(): Promise<number> {
    try {
      const count = await this.readOnlyContract.getDisasterReportLength();
      return count.toNumber();
    } catch (error) {
      console.error('Error fetching report count:', error);
      return 0;
    }
  }

  async getReport(index: number): Promise<DisasterReport | null> {
    try {
      const result = await this.readOnlyContract.getDisasterReport(index);
      
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

  async getAllReports(): Promise<(DisasterReport & { index: number })[]> {
    try {
      const count = await this.getReportCount();
      const reports: (DisasterReport & { index: number })[] = [];

      for (let i = 0; i < count; i++) {
        const report = await this.getReport(i);
        if (report) {
          reports.push({ ...report, index: i });
        }
      }

      return reports.reverse(); // Show newest first
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
      const images = await this.readOnlyContract.getDisasterImages(index);
      
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

  async getCurrentWalletAddress(): Promise<string | null> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        return null;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return await signer.getAddress();
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  }
}

export const contractService = new ContractTransactionService();
