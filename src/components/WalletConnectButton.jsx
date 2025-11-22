import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const shorten = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

  return (
    <div style={styles.container}>
      {/* RainbowKit built-in connect button */}
      {!isConnected ? (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button style={styles.connectBtn} onClick={openConnectModal}>
              ⚡ Connect Wallet
            </button>
          )}
        </ConnectButton.Custom>
      ) : (
        <div style={styles.connectedBox}>
          <span style={styles.address}>{shorten(address)}</span>

          <button style={styles.disconnectBtn} onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },

  connectBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    padding: "12px 22px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
    transition: "0.2s",
  },

  connectedBox: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  address: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },

  disconnectBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    padding: "8px 14px",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
};