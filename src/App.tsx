import { WagmiConfig, createConfig } from "wagmi";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider

import { base } from "wagmi/chains";
import { http } from "wagmi";

import WalletConnectButton from "./components/WalletConnectButton.tsx";
import MintButton from "./components/MintButton";
import "./styles/globals.css";

// WalletConnect project ID
const projectId = "9f8554a52f24e8b9c6926b8239314aa5";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Define chains for RainbowKit and Wagmi
const appChains = [base] as const;

// RainbowKit + WalletConnect connector setup
const { connectors } = getDefaultWallets({
  appName: "Hypur Mint",
  projectId,
});

// Wagmi config
const wagmiConfig = createConfig({
  chains: appChains, // Re-adding chains to createConfig
  connectors,
  transports: {
    [base.id]: http(),
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider>
          <div className="app-root">
            <header className="app-header">
              {/* Removed the absolute image path; src is empty for now */}
              <div className="app-title">
                <h1>Hypur Mint</h1>
                <div className="app-sub">Base • Gradient Modern • 3→999 • 0.000001 ETH</div>
              </div>
            </header>

            <main className="app-main">
              <div className="left">
                <WalletConnectButton />
                <div style={{ height: 12 }} />
                <MintButton />
              </div>

              <div className="right">
                {/* reserved for preview / tx info — MintButton will show toast/status */}
              </div>
            </main>

            <footer className="app-footer">
              <div>Built for Base • Farcaster-ready</div>
              <div>Project ID: {projectId}</div>
            </footer>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
