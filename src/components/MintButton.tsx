import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi"; // Changed useSigner to useWalletClient
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x2Df2E3F2429D52244c3E861EEBAaF7586db5b139";
const MINT_PRICE = "0.000001"; // ETH as string

// Minimal ABI — claim method from DropERC1155
const ABI = [
  {
    inputs: [
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "quantity", type: "uint256" },
      { internalType: "address", name: "currency", type: "address" },
      { internalType: "uint256", name: "pricePerToken", type: "uint256" },
      {
        components: [
          { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" },
          { internalType: "uint256", name: "quantityLimitPerWallet", type: "uint256" },
          { internalType: "uint256", name: "pricePerToken", type: "uint256" },
          { internalType: "address", name: "currency", type: "address" },
        ],
        internalType: "struct AllowlistProof",
        name: "allowlistProof",
        type: "tuple",
      },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

function randomTokenId() {
  return Math.floor(Math.random() * (999 - 3 + 1)) + 3;
}

export default function MintButton() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient(); // Get walletClient
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const priceWei = ethers.parseUnits(MINT_PRICE, "ether");

  async function handleMint() {
    if (!isConnected || !walletClient || !address) { // Check for walletClient
      setStatus("Connect your wallet first");
      return;
    }

    const tokenId = randomTokenId();
    setLoading(true);
    setStatus(`Minting token #${tokenId}...`);

    try {
      // Create an ethers provider from the walletClient
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner(); // Get the signer

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // allowlist tuple: merkleProof[], quantityLimitPerWallet, pricePerToken, currency
      const allowlistProof = [[], 1, priceWei.toString(), ethers.ZeroAddress];

      const tx = await contract.claim(
        address,
        tokenId,
        1,
        ethers.ZeroAddress,
        priceWei,
        allowlistProof,
        "0x",
        { value: priceWei }
      );

      setStatus("Transaction sent — waiting for confirmation...");
      await tx.wait();
      setLastTx(tx.hash || tx.transactionHash);
      setStatus(`Mint confirmed: token #${tokenId}`);
    } catch (err: any) {
      console.error("Mint error", err);
      let message = err?.data?.message || err?.message || String(err);
      setStatus("Mint failed: " + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        onClick={handleMint}
        disabled={!isConnected || loading}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg,#6a9cff,#8a7bff)",
          color: "#04102a",
          fontWeight: 800,
          cursor: isConnected ? "pointer" : "not-allowed",
          boxShadow: "0 8px 20px rgba(106,156,255,0.12)",
        }}
      >
        {loading ? "Minting..." : "Mint Random NFT (3–999) — 0.000001 ETH"}
      </button>

      <div style={{ color: "#9aa6c0", fontSize: 13 }}>{status}</div>

      {lastTx && (
        <a
          href={`https://basescan.org/tx/${lastTx}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#9aa6c0", fontSize: 13 }}
        >
          View on BaseScan
        </a>
      )}
    </div>
  );
}