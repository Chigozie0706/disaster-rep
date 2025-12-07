// IPFS Service for uploading images client-side
// Using Pinata API for simplicity - you can also use Web3.Storage

export interface IPFSUploadResponse {
  success: boolean;
  ipfsHash?: string;
  ipfsUrl?: string;
  error?: string;
}

export class IPFSService {
  private readonly pinataApiKey = process.env.REACT_APP_PINATA_API_KEY || '';
  private readonly pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY || '';

  async uploadFile(file: File): Promise<IPFSUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const metadata = JSON.stringify({
        name: `disaster-image-${Date.now()}`,
        keyvalues: {
          type: 'disaster-report-image',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0
      });
      formData.append('pinataOptions', options);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretApiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Fallback method using a mock service (for development)
  async uploadFileMock(file: File): Promise<IPFSUploadResponse> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock IPFS hash
    const mockHash = `QmNMELyizsfFdNZW3yKTi1SE2pEDjd1XLHf6MmuiXp6FVd`;
    
    return {
      success: true,
      ipfsHash: mockHash,
      ipfsUrl: `https://ipfs.io/ipfs/${mockHash}`
    };
  }

  async uploadFileData(file: File): Promise<IPFSUploadResponse> {
    // If API keys are not configured, use mock service for development
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      console.warn('IPFS API keys not configured, using mock service');
      return this.uploadFileMock(file);
    }

    return this.uploadFile(file);
  }
}

export const ipfsService = new IPFSService();
