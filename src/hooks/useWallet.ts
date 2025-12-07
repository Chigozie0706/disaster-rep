import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { getNetworkConfig } from '@/lib/config';
import { getCeloBalance } from '@/lib/tokenService';
import { useToast } from '@/hooks/use-toast';

export interface WalletState {
  account: string;
  currentNetwork: string;
  isConnecting: boolean;
  balance: string;
  isLoadingBalance: boolean;
  isConnected: boolean;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: '',
    currentNetwork: '',
    isConnecting: false,
    balance: '',
    isLoadingBalance: false,
    isConnected: false
  });

  const { toast } = useToast();
  const walletServiceRef = useRef<any>(null);

  const updateState = (updates: Partial<WalletState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchBalance = async (address: string) => {
    if (!address) return;
    
    updateState({ isLoadingBalance: true });
    try {
      const currentConfig = getNetworkConfig();
      const balance = await getCeloBalance(address, currentConfig.chainId);
      updateState({ 
        balance: parseFloat(balance).toFixed(4),
        isLoadingBalance: false
      });
    } catch (error) {
      updateState({ balance: '0.0000', isLoadingBalance: false });
    }
  };

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentConfig = getNetworkConfig();
      const expectedChainId = `0x${currentConfig.chainId.toString(16)}`;
      
      if (parseInt(chainId, 16) === currentConfig.chainId) {
        updateState({ currentNetwork: currentConfig.name });
      } else {
        updateState({ currentNetwork: `Wrong Network (Expected: ${currentConfig.name})` });
      }
    } catch (error) {
      updateState({ currentNetwork: 'Unknown' });
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive"
      });
      return;
    }

    // Check if we're on the correct network before connecting
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentConfig = getNetworkConfig();
    const expectedChainId = `0x${currentConfig.chainId.toString(16)}`;
    
    if (parseInt(chainId, 16) !== currentConfig.chainId) {
      toast({
        title: "Wrong Network",
        description: `Please switch to ${currentConfig.name} to use this dApp`,
        variant: "destructive"
      });
    }

    updateState({ isConnecting: true });
    try {
      // Check if we're on the correct network before connecting
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentConfig = getNetworkConfig();
      const expectedChainId = `0x${currentConfig.chainId.toString(16)}`;
      await checkNetwork();
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await validateNetwork(provider);
      const address = await provider.getSigner().getAddress();
      
      updateState({ 
        account: address,
        isConnected: true
      });
      
      await fetchBalance(address);
      await checkNetwork();
      
      localStorage.removeItem('wallet_disconnect_requested');
      
      toast({
        title: "Wallet connected",
        description: "Successfully connected to Celo mainnet"
      });
      
    } catch (error: any) {
      console.error('Connection error:', error);
      const errorMessage = error?.message || 
                          error?.reason || 
                          (typeof error === 'string' ? error : 'Failed to connect wallet');
                          
      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      updateState({ isConnecting: false });
    }
  };

  const validateNetwork = async (provider: ethers.providers.Web3Provider): Promise<void> => {
    const network = await provider.getNetwork();
    const targetChainId = getNetworkConfig().chainId;
    
    if (network.chainId !== targetChainId) {
      await switchToCorrectNetwork(provider);
    }
  };

  const switchToCorrectNetwork = async (provider: ethers.providers.Web3Provider): Promise<void> => {
    const config = getNetworkConfig();
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${config.chainId.toString(16)}` }
      ]);
      
      toast({
        title: "Network switched",
        description: `Successfully switched to ${config.name}`
      });
      
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
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
          
          toast({
            title: "Network added",
            description: `Added and switched to ${config.name}`
          });
          
        } catch (addError: any) {
          const addErrorMessage = addError?.message || addError?.reason || 'Failed to add network';
          throw new Error(`Please manually add ${config.name} to your wallet: ${addErrorMessage}`);
        }
      } else {
        const switchErrorMessage = error?.message || error?.reason || 'Network switch failed';
        throw new Error(`Please switch to ${config.name} network: ${switchErrorMessage}`);
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      console.log('Failed to revoke permissions:', error);
    }
    
    localStorage.setItem('wallet_disconnect_requested', 'true');
    updateState({
      account: '',
      currentNetwork: '',
      balance: '',
      isConnected: false
    });
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected"
    });
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      const addr = accounts[0] || '';
      updateState({ 
        account: addr,
        isConnected: !!addr
      });
      
      if (addr) {
        fetchBalance(addr);
      } else {
        updateState({ currentNetwork: '', balance: '' });
      }
    };

    const checkExistingConnection = async () => {
      try {
        const wasDisconnected = localStorage.getItem('wallet_disconnect_requested');
        if (wasDisconnected === 'true') {
          return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          updateState({ 
            account: accounts[0],
            isConnected: true
          });
          await checkNetwork();
          setTimeout(() => fetchBalance(accounts[0]), 100);
        }
      } catch (error) {
        console.log('Failed to check existing connection:', error);
      }
    };

    checkExistingConnection();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', checkNetwork);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    formatAddress,
    fetchBalance,
    checkNetwork
  };
};
