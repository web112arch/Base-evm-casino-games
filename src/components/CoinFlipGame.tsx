"use client";

import React, { useMemo, useRef, useState } from "react";

type Side = "HEADS" | "TAILS";
type Round = {
  id: string;
  pick: Side;
  result: Side;
  won: boolean;
  bet: number;
  ts: number;
};

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CoinFlipGame() {
  const [balance, setBalance] = useState<number>(100); // banca fictícia
  const [bet, setBet] = useState<number>(5);
  const [pick, setPick] = useState<Side>("HEADS");
  const [isFlipping, setIsFlipping] = useState(false);
  const [message, setMessage] = useState<string>("Escolha e jogue.");
  const [history, setHistory] = useState<Round[]>([]);
  const [coinFace, setCoinFace] = useState<Side>("HEADS");

  // "RNG" local simples (não é onchain, só pra joguinho)
  // Usa crypto.getRandomValues quando disponível
  const randBit = () => {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      const arr = new Uint8Array(1);
      crypto.getRandomValues(arr);
      return arr[0] % 2; // 0/1
    }
    return Math.random() < 0.5 ? 0 : 1;
  };

  const canPlay = useMemo(() => {
    if (isFlipping) return false;
    if (!Number.isFinite(bet) || bet <= 0) return false;
    if (bet > balance) return false;
    return true;
  }, [isFlipping, bet, balance]);

  const animTimer = useRef<number | null>(null);

  function clearTimer() {
    if (animTimer.current) {
      window.clearInterval(animTimer.current);
      animTimer.current = null;
    }
  }

  async function flip() {
    if (!canPlay) return;

    setIsFlipping(true);
    setMessage("Girando a moeda...");

    // animação simples: alterna face várias vezes
    let ticks = 0;
    clearTimer();
    animTimer.current = window.setInterval(() => {
      ticks++;
      setCoinFace((prev) => (prev === "HEADS" ? "TAILS" : "HEADS"));
      if (ticks >= 14) clearTimer();
    }, 60);

    // espera curtinha pra “clima”
    await new Promise((r) => setTimeout(r, 900));

    // decide resultado
    const result: Side = randBit() === 0 ? "HEADS" : "TAILS";
    setCoinFace(result);

    const won = result === pick;

    // atualiza saldo (ganha 2x ou perde 1x)
    setBalance((prev) => {
      const next = won ? prev + bet : prev - bet;
      return Math.max(0, Number(next.toFixed(2)));
    });

    const round: Round = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      pick,
      result,
      won,
      bet,
      ts: Date.now(),
    };

    setHistory((prev) => [round, ...prev].slice(0, 12));

    setMessage(
      won
        ? `✅ Deu ${result === "HEADS" ? "CARA" : "COROA"} — você ganhou ${formatBRL(bet)}!`
        : `❌ Deu ${result === "HEADS" ? "CARA" : "COROA"} — você perdeu ${formatBRL(bet)}.`
    );

    setIsFlipping(false);
  }

  function reset() {
    clearTimer();
    setBalance(100);
    setBet(5);
    setPick("HEADS");
    setCoinFace("HEADS");
    setHistory([]);
    setMessage("Escolha e jogue.");
    setIsFlipping(false);
  }

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Coin */}
        <div
          style={{
            width: 220,
            minWidth: 220,
            borderRadius: 16,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 999,
              margin: "0 auto 12px",
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              fontWeight: 800,
              border: "2px solid rgba(255,255,255,0.25)",
              userSelect: "none",
              transform: isFlipping ? "rotate(25deg)" : "rotate(0deg)",
              transition: "transform 180ms ease",
            }}
            aria-label="coin"
          >
            {coinFace === "HEADS" ? "CARA" : "COROA"}
          </div>

          <div style={{ fontSize: 14, opacity: 0.85, textAlign: "center" }}>
            <div style={{ marginBottom: 6 }}>
              Saldo: <b>{formatBRL(balance)}</b>
            </div>
            <div style={{ opacity: 0.8 }}>{message}</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button
              onClick={() => setPick("HEADS")}
              disabled={isFlipping}
              style={btn(pick === "HEADS")}
            >
              CARA
            </button>
            <button
              onClick={() => setPick("TAILS")}
              disabled={isFlipping}
              style={btn(pick === "TAILS")}
            >
              COROA
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <label style={{ fontSize: 14, opacity: 0.85, minWidth: 70 }}>Aposta</label>
            <input
              type="number"
              min={1}
              step={1}
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={isFlipping}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "transparent",
                color: "inherit",
              }}
            />
            <button
              onClick={() => setBet((b) => Math.max(1, b - 1))}
              disabled={isFlipping}
              style={smallBtn}
            >
              -
            </button>
            <button
              onClick={() => setBet((b) => b + 1)}
              disabled={isFlipping}
              style={smallBtn}
            >
              +
            </button>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={flip} disabled={!canPlay} style={primaryBtn}>
              {isFlipping ? "Girando..." : "Jogar"}
            </button>
            <button onClick={reset} disabled={isFlipping} style={ghostBtn}>
              Reset
            </button>
          </div>

          <div style={{ marginTop: 16, fontSize: 13, opacity: 0.75 }}>
            <div>• Paga 2x quando acerta (modo arcade).</div>
            <div>• Depois a gente conecta onchain na Base L2.</div>
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ marginTop: 18 }}>
        <h3 style={{ fontSize: 16, margin: "0 0 10px" }}>Últimas jogadas</h3>

        {history.length === 0 ? (
          <div style={{ opacity: 0.7, fontSize: 14 }}>Ainda sem jogadas.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {history.map((h) => (
              <div
                key={h.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div style={{ fontSize: 14 }}>
                  Apostou <b>{h.pick === "HEADS" ? "CARA" : "COROA"}</b> •{" "}
                  {formatBRL(h.bet)}
                </div>
                <div style={{ fontSize: 14 }}>
                  Resultado: <b>{h.result === "HEADS" ? "CARA" : "COROA"}</b> •{" "}
                  <b style={{ opacity: 0.95 }}>{h.won ? "✅ WIN" : "❌ LOSE"}</b>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function btn(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: active ? "2px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.18)",
    background: active ? "rgba(255,255,255,0.08)" : "transparent",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 700,
  };
}

const smallBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 800,
};

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.12)",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 800,
};

const ghostBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 700,
};