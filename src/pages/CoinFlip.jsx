import { useMemo, useState } from "react";

export default function CoinFlip() {
  const [balance, setBalance] = useState(100); // saldo fake p/ testar UX
  const [bet, setBet] = useState(1);
  const [pick, setPick] = useState("heads"); // heads | tails
  const [result, setResult] = useState(null); // "heads" | "tails"
  const [status, setStatus] = useState("idle"); // idle | flipping
  const [history, setHistory] = useState([]); // logs

  const canFlip = useMemo(() => {
    if (status !== "idle") return false;
    if (!Number.isFinite(bet) || bet <= 0) return false;
    if (bet > balance) return false;
    return true;
  }, [status, bet, balance]);

  function flip() {
    if (!canFlip) return;

    setStatus("flipping");
    setResult(null);

    // simula tempo de "flip"
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      const win = r === pick;

      setResult(r);
      setBalance((prev) => prev + (win ? bet : -bet));

      setHistory((prev) => [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          time: new Date().toLocaleTimeString(),
          pick,
          result: r,
          bet,
          win,
        },
        ...prev,
      ]);

      setStatus("idle");
    }, 900);
  }

  function reset() {
    setBalance(100);
    setBet(1);
    setPick("heads");
    setResult(null);
    setStatus("idle");
    setHistory([]);
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1>🎲 CoinFlip</h1>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Saldo</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{balance.toFixed(2)}</div>
          </div>

          <button onClick={reset} type="button">
            Reset
          </button>
        </div>

        <hr style={{ margin: "12px 0" }} />

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Escolha</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                type="button"
                onClick={() => setPick("heads")}
                disabled={status !== "idle"}
                style={{ fontWeight: pick === "heads" ? 700 : 400 }}
              >
                Cara
              </button>
              <button
                type="button"
                onClick={() => setPick("tails")}
                disabled={status !== "idle"}
                style={{ fontWeight: pick === "tails" ? 700 : 400 }}
              >
                Coroa
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Aposta</div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={status !== "idle"}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
            {bet > balance && (
              <div style={{ color: "crimson", marginTop: 6 }}>
                Aposta maior que o saldo.
              </div>
            )}
          </div>

          <button
            onClick={flip}
            disabled={!canFlip}
            type="button"
            style={{ padding: 10 }}
          >
            {status === "flipping" ? "Flipping..." : "Flip"}
          </button>

          <div style={{ padding: 10, border: "1px dashed #ccc", borderRadius: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Resultado</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>
              {result
                ? result === "heads"
                  ? "Cara"
                  : "Coroa"
                : status === "flipping"
                ? "🌀..."
                : "—"}
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 22 }}>Histórico</h2>
      {history.length === 0 ? (
        <div style={{ opacity: 0.7 }}>Nenhum flip ainda.</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {history.slice(0, 10).map((h) => (
            <div
              key={h.id}
              style={{ padding: 10, border: "1px solid #eee", borderRadius: 12 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  {h.win ? "✅ WIN" : "❌ LOSS"} — aposta: {h.bet}
                </div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>{h.time}</div>
              </div>
              <div style={{ marginTop: 6, opacity: 0.9 }}>
                Você: {h.pick === "heads" ? "Cara" : "Coroa"} | Saiu:{" "}
                {h.result === "heads" ? "Cara" : "Coroa"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}