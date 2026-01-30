import { useEffect, useMemo, useState } from "react";
import "../styles/coinflip.css"; // reutiliza o mesmo css base

const STORAGE_KEY = "dice:v1";

export default function Dice() {
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(1);

  const [pick, setPick] = useState(3); // 1..6
  const [result, setResult] = useState(null); // 1..6 | null
  const [status, setStatus] = useState("idle"); // idle | rolling
  const [lastWin, setLastWin] = useState(null);
  const [history, setHistory] = useState([]);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const payout = 5; // acertou: + bet * payout (lucro = bet*(payout-1))

  const canRoll = useMemo(() => {
    if (status !== "idle") return false;
    if (!Number.isFinite(bet) || bet <= 0) return false;
    if (bet > balance) return false;
    if (pick < 1 || pick > 6) return false;
    return true;
  }, [status, bet, balance, pick]);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);

      if (typeof d.balance === "number") setBalance(d.balance);
      if (typeof d.bet === "number") setBet(d.bet);
      if (typeof d.pick === "number") setPick(d.pick);

      if (Array.isArray(d.history)) setHistory(d.history);
      if (typeof d.streak === "number") setStreak(d.streak);
      if (typeof d.bestStreak === "number") setBestStreak(d.bestStreak);
    } catch {}
  }, []);

  // Save
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ balance, bet, pick, history, streak, bestStreak })
      );
    } catch {}
  }, [balance, bet, pick, history, streak, bestStreak]);

  function roll() {
    if (!canRoll) return;

    setStatus("rolling");
    setResult(null);
    setLastWin(null);

    setTimeout(() => {
      const r = Math.floor(Math.random() * 6) + 1;
      const win = r === pick;

      // delta = quanto muda o saldo
      // se ganhar: +bet*(payout-1) (lucro)
      // se perder: -bet
      const delta = win ? bet * (payout - 1) : -bet;

      setResult(r);
      setLastWin(win);

      setStreak((prev) => {
        const next = win ? prev + 1 : 0;
        setBestStreak((b) => (next > b ? next : b));
        return next;
      });

      setBalance((prev) => prev + delta);

      setHistory((prev) => [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          time: new Date().toLocaleTimeString(),
          pick,
          result: r,
          bet,
          win,
          delta,
        },
        ...prev,
      ]);

      setStatus("idle");
    }, 750);
  }

  function reset() {
    setBalance(100);
    setBet(1);
    setPick(3);
    setResult(null);
    setStatus("idle");
    setLastWin(null);
    setHistory([]);
    setStreak(0);
    setBestStreak(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const stats = useMemo(() => {
    const total = history.length;
    const wins = history.filter((h) => h.win).length;
    const losses = total - wins;
    const profit = history.reduce((acc, h) => acc + (h.delta ?? 0), 0);
    const winRate = total === 0 ? 0 : (wins / total) * 100;
    return { total, wins, losses, profit, winRate };
  }, [history]);

  return (
    <div className="page">
      <div className="card">
        <div className="top">
          <div>
            <h1 className="title">🎲 Dice Roll</h1>
            <p className="sub">Escolha um número (1–6). Se acertar, payout {payout}x.</p>
          </div>

          <div className="balance">
            <span>Saldo:</span>
            <b>{balance.toFixed(2)}</b>

            <button className="btn" type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        {/* DADO (simples, com “rolagem” fake) */}
        <div style={{ display: "flex", justifyContent: "center", margin: "14px 0 8px" }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(0,0,0,.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: 1,
              boxShadow: "0 18px 44px rgba(0,0,0,.20)",
              transform: status === "rolling" ? "rotate(8deg)" : "none",
              transition: "transform .2s ease",
              userSelect: "none",
            }}
          >
            {result ?? "?"}
          </div>
        </div>

        <div className={`resultBanner ${lastWin === true ? "win" : lastWin === false ? "loss" : ""}`}>
          {lastWin === null ? "—" : lastWin ? "✅ WIN" : "❌ LOSS"}
        </div>

        {/* Stats (usa seu css .statsGrid etc.) */}
        <div className="statsGrid">
          <div className="statCard">
            <div className="label">Total</div>
            <div className="statValue">{stats.total}</div>
          </div>
          <div className="statCard">
            <div className="label">Win rate</div>
            <div className="statValue">{stats.winRate.toFixed(1)}%</div>
          </div>
          <div className="statCard">
            <div className="label">W / L</div>
            <div className="statValue">
              {stats.wins} / {stats.losses}
            </div>
          </div>
          <div className="statCard">
            <div className="label">Profit</div>
            <div className="statValue">
              {stats.profit >= 0 ? `+${stats.profit.toFixed(2)}` : stats.profit.toFixed(2)}
            </div>
          </div>
          <div className="statCard">
            <div className="label">Streak</div>
            <div className="statValue">{streak}</div>
          </div>
          <div className="statCard">
            <div className="label">Best</div>
            <div className="statValue">{bestStreak}</div>
          </div>
        </div>

        {/* Controles */}
        <div className="controls">
          <div className="row">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                className="btn"
                type="button"
                onClick={() => setPick(n)}
                disabled={status !== "idle"}
                style={{ fontWeight: pick === n ? 900 : 600 }}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="chip">
            <div className="label">Aposta</div>
            <div className="value">
              <input
                type="number"
                min="0"
                step="0.01"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={status !== "idle"}
              />
              {bet > balance ? (
                <div className="err">Aposta maior que o saldo.</div>
              ) : (
                <div className="hint">Escolha o número e clique em Roll.</div>
              )}
            </div>
          </div>

          <button className="btn btnPrimary" type="button" onClick={roll} disabled={!canRoll}>
            {status === "rolling" ? "Rolling..." : "Roll"}
          </button>
        </div>

        <div className="toast">
          {result ? `Saiu: ${result}` : status === "rolling" ? "🌀 Rolando..." : "—"}
        </div>

        {/* Histórico */}
        <div className="history">
          <h2 className="historyTitle">Histórico (últimos 10)</h2>
          {history.length === 0 ? (
            <div className="muted">Nenhuma rodada ainda.</div>
          ) : (
            <div className="list">
              {history.slice(0, 10).map((h) => (
                <div className="hItem" key={h.id}>
                  <div className="hLeft">
                    <div className={`tag ${h.win ? "win" : "loss"}`}>
                      {h.win ? "✅ WIN" : "❌ LOSS"} — aposta {h.bet}
                    </div>
                    <div className="muted">
                      Você: {h.pick} | Saiu: {h.result}
                    </div>
                  </div>
                  <div className="hRight">
                    <div>{h.time}</div>
                    <div>{h.delta >= 0 ? `+${Number(h.delta).toFixed(2)}` : Number(h.delta).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}