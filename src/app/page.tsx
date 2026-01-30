"use client";

import { useState } from "react";
import { connectWallet } from "../lib/wallet";
import { BASE_NETWORK } from "../config/base";

export default function Page() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    try {
      setError(null);
      const wallet = await connectWallet();
      setAddress(wallet.address);
    } catch (err: any) {
      setError(err.message ?? "Failed to connect wallet");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Base Casino (Simplified)</h1>

      <p>
        Network: <strong>{BASE_NETWORK.name}</strong> (Chain ID{" "}
        {BASE_NETWORK.chainId})
      </p>

      {!address && (
        <button
          onClick={handleConnect}
          style={{ padding: "10px 14px", cursor: "pointer" }}
        >
          Connect Wallet
        </button>
      )}

      {address && (
        <div style={{ marginTop: 16 }}>
          <p>
            Connected address:
            <br />
            <strong>{address}</strong>
          </p>
        </div>
      )}

      {error && (
        <p style={{ marginTop: 16, color: "red" }}>
          ❌ {error}
        </p>
      )}
    </main>
  );
}