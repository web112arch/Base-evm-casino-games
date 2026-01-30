"use client";

import { useMemo, useState } from "react";
import { BASE_NETWORK } from "../config/base";
import { COINFLIP_CONTRACT_ADDRESS } from "../config/contract";

export default function Page() {
  const [wagerEth, setWagerEth] = useState("0.001");

  const contractReady = useMemo(() => {
    return Boolean(COINFLIP_CONTRACT_ADDRESS) && COINFLIP_CONTRACT_ADDRESS.length === 42;
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 860 }}>
      <h1 style={{ marginBottom: 6 }}>Base Casino (Simplified)</h1>

      <p style={{ marginTop: 0 }}>
        Network: <strong>{BASE_NETWORK.name}</strong> (Chain ID {BASE_NETWORK.chainId})
      </p>

      <hr style={{ margin: "18px 0" }} />

      <h2 style={{ marginBottom: 8 }}>Coin Flip (On-chain)</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Contract address:</strong>
        <div style={{ wordBreak: "break-all" }}>
          {COINFLIP_CONTRACT_ADDRESS || "NOT SET (add NEXT_PUBLIC_COINFLIP_CONTRACT_ADDRESS)"}
        </div>
      </div>

      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        Wager (ETH)
      </label>
      <input
        value={wagerEth}
        onChange={(e) => setWagerEth(e.target.value)}
        style={{ padding: 10, width: 220 }}
        placeholder="0.001"
      />

      <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <button
          disabled={!contractReady}
          style={{ padding: "10px 14px", cursor: contractReady ? "pointer" : "not-allowed" }}
          onClick={() => alert("Next step: connect wallet + call play(Heads)")}
        >
          Play Heads
        </button>

        <button
          disabled={!contractReady}
          style={{ padding: "10px 14px", cursor: contractReady ? "pointer" : "not-allowed" }}
          onClick={() => alert("Next step: connect wallet + call play(Tails)")}
        >
          Play Tails
        </button>
      </div>

      {!contractReady && (
        <p style={{ marginTop: 14 }}>
          ⚠️ Contract not set yet. This UI is ready, but contract address is missing.
        </p>
      )}

      <p style={{ marginTop: 18, fontSize: 14, opacity: 0.9 }}>
        Next step will add MetaMask connection + call the contract function <code>play()</code>.
      </p>
    </main>
  );
}