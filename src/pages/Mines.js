import { useEffect, useMemo, useState } from "react";
import "../styles/coinflip.css";

const STORAGE_KEY = "mines:v1";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function pickUnique(total, count) {
  const set = new Set();
  while (set.size < count) set.add(Math.floor(Math.random() * total));
  return set;
}

export default function Mines() {
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(1);

  const [bombs, setBombs] = useState(3); // 1..24
  const [size] = useState(25); // 5x5 fixo

  // rodada atual
  const [inRound, setInRound] = useState(false);
  const [mineSet, setMineSet] = useState(() => new Set());
  const [revealed, setRevealed] = useState(() => new Set());
  const [status, setStatus] = useState("idle"); // idle | playing | lost | cashed
  const [message, setMessage] = useState("—");

  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);

      if (typeof d.balance === "number") setBalance(d.balance);
      if (typeof d.bet === "number") setBet(d.bet);
      if (typeof d.bombs === "number") setBombs(d.bombs);

      if (Array.isArray(d.history)) setHistory(d.history);
      if (typeof d.streak === "number") setStreak(d.streak);
      if (typeof d.bestStreak === "number") setBestStreak(d.bestStreak);
    } catch {}
  }, []);

  // Save (não salvamos o round atual pra evitar “bug” ao recarregar)
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ balance, bet, bombs, history, streak, bestStreak })
      );
    } catch {}
  }, [balance, bet, bombs, history, streak, bestStreak]);

  const maxBombs = size - 1;

  const canStart = useMemo(() => {
    if (inRound) return false;
    if (!Number.isFinite(bet) || bet <= 0) return false;
    if (bet > balance) return false;
    if (!Number.isFinite(bombs) || bombs < 1 || bombs > maxBombs) return false;
    return true;
  }, [inRound, bet, balance, bombs, maxBombs]);

  const safeTotal = size - bombs;
  const revealedSafe = useMemo(() => {
    let c = 0;
    revealed.forEach((i) => {
      if (!mineSet.has(i)) c++;
    });
    return c;
  }, [revealed, mineSet]);

  // Multiplicador simples (off-chain):
  // cada acerto aumenta um pouco, e bombas aumentam risco => aumenta mais
  const multiplier = useMemo(() => {
    if (!inRound) return 1;
    const risk = bombs / size; // 0..1
    const step = 0.08 + risk * 0.22; // 0.08..0.30
    return Number((1 + revealedSafe * step).toFixed(2));
  }, [inRound, bombs, size, revealedSafe]);

  const cashoutValue = useMemo(() => {
    if (!inRound) return 0;
    return Number((bet * multiplier).toFixed(2));
  }, [inRound, bet, multiplier]);

  const stats = useMemo(() => {
    const total = history.length;
    const wins = history.filter((h) => h.win).length;
    const losses = total - wins;
    const profit = history.reduce((acc, h) => acc + (h.delta ?? 0), 0);
    const winRate = total === 0 ? 0 : (wins / total) * 100;
    return { total, wins, losses, profit, winRate };
  }, [history]);

  function start() {
    if (!canStart) return;

    setInRound(true);
    setStatus("playing");
    setMessage("Boa! Clique nos quadrados 💎 (Cashout quando quiser)");
    setRevealed(new Set());

    const mines = pickUnique(size, bombs);
    setMineSet(mines);

    // tira a aposta do saldo já no começo (padrão casino)
    setBalance((prev) => prev - bet);
  }

  function reveal(idx) {
    if (!inRound || status !== "playing") return;
    if (revealed.has(idx)) return;

    const next = new Set(revealed);
    next.add(idx);
    setRevealed(next);

    if (mineSet.has(idx)) {
      // perdeu
      setStatus("lost");
      setMessage("💥 BOOM! Você perdeu.");

      setStreak(0);

      setHistory((prev) => [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          time: new Date().toLocaleTimeString(),
          bet,
          bombs,
          revealedSafe,
          multiplierAtCashout: 0,
          win: false,
          delta: -bet,
        },
        ...prev,
      ]);

      // revela tudo
      const all = new Set(next);
      mineSet.forEach((m) => all.add(m));
      setRevealed(all);

      setInRound(false);
      return;
    }

    // venceu automaticamente se achou todos os seguros
    const nextSafe = (() => {
      let c = 0;
      next.forEach((i) => {
        if (!mineSet.has(i)) c++;
      });
      return c;
    })();

    if (nextSafe >= safeTotal) {
      // cashout automático
      doCashout(nextSafe, true);
    }
  }

  function doCashout(safeCount = revealedSafe, auto = false) {
    if (!inRound || status !== "playing") return;

    const risk = bombs / size;
    const step = 0.08 + risk * 0.22;
    const mult = Number((1 + safeCount * step).toFixed(2));
    const payout = Number((bet * mult).toFixed(2));
    const profit = Number((payout - bet).toFixed(2));

    setBalance((prev) => prev + payout);

    setStatus("cashed");
    setMessage(auto ? `✅ Auto-cashout em ${mult}x` : `✅ Cashout em ${mult}x`);

    setStreak((prev) => {
      const next = prev + 1;
      setBestStreak((b) => (next > b ? next : b));
      return next;
    });

    setHistory((prev) => [
      {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        time: new Date().toLocaleTimeString(),
        bet,
        bombs,
        revealedSafe: safeCount,
        multiplierAtCashout: mult,
        win: true,
        delta: profit,
      },
      ...prev,
    ]);

    // revela as minas (fim de round)
    const all = new Set(revealed);
    mineSet.forEach((m) => all.add(m));
    setRevealed(all);

    setInRound(false);
  }

  function reset() {
    setBalance(100);
    setBet(1);
    setBombs(3);

    setInRound(false);
    setMineSet(new Set());
    setRevealed(new Set());
    setStatus("idle");
    setMessage("—");

    setHistory([]);
    setStreak(0);
    setBestStreak(0);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const grid = useMemo(() => Array.from({ length: size }, (_, i) => i), [size]);

  return (
    <div className="page">
      <div className="card">
        <div className="top">
          <div>
            <h1 className="title">💣 Mines</h1>
            <p className="sub">Clique em 💎, evite 💥. Cashout quando quiser.</p>
          </div>

          <div className="balance">
            <span>Saldo:</span>
            <b>{balance.toFixed(2)}</b>
            <button className="btn" type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        {/* Painel / resultado */}
        <div className={`resultBanner ${status === "cashed" ? "win" : status === "lost" ? "loss" : ""}`}>
          {message}
        </div>

        {/* Stats */}
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
          <div className="statCard">
            <div className="label">Multiplicador</div>
            <div className="statValue">{inRound ? `${multiplier}x` : "—"}</div>
          </div>
        </div>

        {/* Controles */}
        <div className="controls">
          <div className="row">
            <div className="chip" style={{ flex: 1 }}>
              <div className="label">Aposta</div>
              <div className="value">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  disabled={inRound}
                />
                {bet > balance && !inRound ? <div className="err">Aposta maior que o saldo.</div> : null}
              </div>
            </div>

            <div className="chip" style={{ flex: 1 }}>
              <div className="label">Bombas</div>
              <div className="value">
                <input
                  type="number"
                  min="1"
                  max={maxBombs}
                  step="1"
                  value={bombs}
                  onChange={(e) => setBombs(clamp(Number(e.target.value), 1, maxBombs))}
                  disabled={inRound}
                />
                <div className="hint">Grid 5×5 (25). Seguros: {safeTotal}</div>
              </div>
            </div>
          </div>

          <div className="row">
            <button className="btn btnPrimary" type="button" onClick={start} disabled={!canStart}>
              {inRound ? "Em jogo..." : "Start"}
            </button>

            <button
              className="btn"
              type="button"
              onClick={() => doCashout()}
              disabled={!inRound || status !== "playing" || revealedSafe === 0}
              style={{ fontWeight: 900 }}
            >
              Cashout {inRound ? `(${cashoutValue.toFixed(2)})` : ""}
            </button>
          </div>
        </div>

        {/* GRID */}
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {grid.map((i) => {
              const isOpen = revealed.has(i);
              const isMine = mineSet.has(i);
              const face = !isOpen ? "⬛" : isMine ? "💥" : "💎";

              return (
                <button
                  key={i}
                  className="btn"
                  type="button"
                  onClick={() => reveal(i)}
                  disabled={!inRound || status !== "playing" || isOpen}
                  style={{
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 900,
                    background: isOpen ? "rgba(0,0,0,.28)" : undefined,
                    borderColor: isOpen ? "rgba(255,255,255,.10)" : undefined,
                  }}
                >
                  {face}
                </button>
              );
            })}
          </div>

          <div className="hint" style={{ marginTop: 10 }}>
            Achados: <b>{revealedSafe}</b> / {safeTotal}
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="history">
          <h2 className="historyTitle">Histórico (últimos 10)</h2>

          {history.length === 0 ? (
            <div className="muted">Nenhuma partida ainda.</div>
          ) : (
            <div className="list">
              {history.slice(0, 10).map((h) => (
                <div className="hItem" key={h.id}>
                  <div className="hLeft">
                    <div className={`tag ${h.win ? "win" : "loss"}`}>
                      {h.win ? "✅ WIN" : "❌ LOSS"} — aposta {h.bet} | bombas {h.bombs}
                    </div>
                    <div className="muted">
                      Seguros: {h.revealedSafe} {h.win ? `| Cashout: ${h.multiplierAtCashout}x` : ""}
                    </div>
                  </div>
                  <div className="hRight">
                    <div>{h.time}</div>
                    <div>
                      {h.delta >= 0 ? `+${Number(h.delta).toFixed(2)}` : Number(h.delta).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="toast">
          {status === "playing"
            ? `Multiplicador: ${multiplier}x • Cashout: ${cashoutValue.toFixed(2)}`
            : "—"}
        </div>
      </div>
    </div>
  );
}
