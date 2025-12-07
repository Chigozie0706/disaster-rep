import React from 'react';
import { Wallet, CheckCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';

export const WalletConnectButton: React.FC = () => {
  const { account, isConnecting, connectWallet, disconnectWallet, formatAddress } = useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">
            {formatAddress(account)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
