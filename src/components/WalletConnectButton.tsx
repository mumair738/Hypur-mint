import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnectButton() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ConnectButton showBalance={true} />
    </div>
  );
}