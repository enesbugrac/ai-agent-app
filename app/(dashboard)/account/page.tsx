"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import {
  FaTwitter,
  FaDiscord,
  FaGoogle,
  FaGithub,
  FaWallet,
  FaCheck,
  FaPlus,
  FaSpinner,
  FaCopy,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

interface ConnectorProps {
  name: string;
  icon: React.ElementType;
  isConnected: boolean;
  isLoading?: boolean;
  onClick: () => void;
  description: string;
}

const ConnectorButton = ({
  name,
  icon: Icon,
  isConnected,
  isLoading,
  onClick,
  description,
}: ConnectorProps) => (
  <div className="group bg-background/50 hover:bg-background-overlay rounded-lg border border-border/50 hover:border-primary/20 p-4 transition-all backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-background-overlay flex items-center justify-center group-hover:scale-105 transition-transform">
        <Icon className="text-xl text-primary/80 group-hover:text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-sm font-medium">{name}</h3>
          <button
            onClick={onClick}
            disabled={isLoading}
            className={`ml-4 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              isConnected
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-primary text-background hover:bg-primary/90"
            }`}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin text-[10px]" />
            ) : isConnected ? (
              <>
                <FaCheck className="text-[10px]" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <FaPlus className="text-[10px]" />
                <span>Connect</span>
              </>
            )}
          </button>
        </div>
        <p className="text-secondary text-xs mt-1 truncate">{description}</p>
      </div>
    </div>
  </div>
);

export default function AccountPage() {
  const {
    user,
    linkEmail,
    linkWallet,
    linkTwitter,
    linkDiscord,
    linkGoogle,
    linkGithub,
  } = usePrivy();

  console.log("linkGithub", linkGithub);
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConnect = async (type: string, connectFn: (() => void) | undefined) => {
    if (!connectFn) return;
    setLoading(type);
    try {
      await connectFn();
    } catch (error) {
      console.error("Connection error:", error);
    }
    setLoading(null);
  };

  const handleCopyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const connectors = [
    {
      name: "Wallet",
      icon: FaWallet,
      isConnected: !!user?.wallet,
      onClick: () => handleConnect("wallet", linkWallet),
      description: "Connect your crypto wallet to interact with the blockchain",
    },
    {
      name: "Email",
      icon: MdEmail,
      isConnected: !!user?.email,
      onClick: () => handleConnect("email", linkEmail),
      description: "Add email authentication for easier access",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      isConnected: !!user?.twitter,
      onClick: () => handleConnect("twitter", linkTwitter),
      description: "Share your activities directly to Twitter",
    },
    {
      name: "Discord",
      icon: FaDiscord,
      isConnected: !!user?.discord,
      onClick: () => handleConnect("discord", linkDiscord),
      description: "Join our community and get instant updates",
    },
    {
      name: "Google",
      icon: FaGoogle,
      isConnected: !!user?.google,
      onClick: () => handleConnect("google", linkGoogle),
      description: "Quick sign-in with your Google account",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      isConnected: !!user?.github,
      onClick: () => handleConnect("github", linkGithub),
      description: "Connect with GitHub for developer features",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="h-16 bg-background-overlay/50 border-b border-border/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <h1 className="text-primary font-medium text-sm">Account Settings</h1>
        {/* {user?.wallet && (
          <a
            href={`https://solscan.io/account/${user.wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary text-xs flex items-center gap-1.5 transition-colors"
          >
            View on Explorer
            <FaExternalLinkAlt className="text-[10px]" />
          </a>
        )} */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Wallet Section */}
          {user?.wallet && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-white">Your Wallet</h2>
                <p className="text-secondary text-xs mt-1">
                  Manage your connected wallet and view transactions
                </p>
              </div>
              <div className="bg-background/50 hover:bg-background-overlay rounded-lg border border-border/50 p-4 transition-all backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background-overlay flex items-center justify-center">
                    <FaWallet className="text-xl text-primary/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">Connected Wallet</div>
                    <div className="text-secondary mt-1 flex items-center gap-2">
                      <code className="bg-background/80 px-2 py-1 rounded text-xs font-mono truncate">
                        {user.wallet.address}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className="p-1.5 rounded hover:bg-background-overlay text-secondary hover:text-primary transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <FaCheck className="text-[10px]" />
                        ) : (
                          <FaCopy className="text-[10px]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connected Accounts */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-white">Connected Accounts</h2>
              <p className="text-secondary text-xs mt-1">
                Link your accounts to enable additional features and seamless
                authentication
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {connectors.map((connector) => (
                <ConnectorButton
                  key={connector.name}
                  {...connector}
                  isLoading={loading === connector.name.toLowerCase()}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
