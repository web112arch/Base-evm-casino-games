import { useMemo, useState } from "react";

export default function CoinFlip() {
  // Estado do jogo (OFF-CHAIN)
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(1);
  const [pick, setPick] = useState("heads"); // "heads" | "tails"
  const [result, setResult] = useState(null); // "heads" | "tails" | null
  const [status, setStatus] = useState("idle"); // "idle" | "flipping"
  const [lastWin, setLastWin] = useState(null); // null | true | false
  const [history, setHistory] = useState([]);

  // Helpers
  const faceLabel = (v) => (v === "heads" ? "CARA" : "COROA");

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
    setLastWin(null);

    // tempo da animação (tem que bater com o CSS coinFlip 900ms)
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      const win = r === pick;

      setResult(r);
      setLastWin(win);
      setBalance((prev) => prev + (win ? bet : -bet));

      setHistory((prev) => [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          time: new Date().toLocaleTimeString(),
          pick,
          result: r,
          bet,
          win,
          balanceAfter: (balance + (win ? bet : -bet)).toFixed(2),
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
    setLastWin(null);
    setHistory([]);
  }

  const css = `
    .page{
      min-height: 100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding: 28px 16px;
      background:
        radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,.08), transparent 60%),
        radial-gradient(900px 500px at 80% 30%, rgba(255,255,255,.06), transparent 60%),
        linear-gradient(180deg, #07090f 0%, #0b1020 55%, #07090f 100%);
      color: rgba(255,255,255,.92);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    }

    .card{
      width: min(720px, 100%);
      border-radius: 18px;
      padding: 18px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.12);
      box-shadow: 0 24px 70px rgba(0,0,0,.45);
      backdrop-filter: blur(10px);
    }

    .top{
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap: 12px;
      margin-bottom: 8px;
    }
    .title{ margin:0; font-size: 22px; letter-spacing: .3px; }
    .sub{ margin: 4px 0 0; font-size: 12px; opacity:.72; }
    .balance{ opacity:.9; font-size: 14px; display:flex; gap: 10px; align-items:center; }
    .balance b{ font-size: 16px; }

    .btn{
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.10);
      color: rgba(255,255,255,.92);
      cursor:pointer;
      transition: transform .12s ease, filter .12s ease;
      user-select:none;
    }
    .btn:hover{ transform: translateY(-1px); filter: brightness(1.06); }
    .btn:disabled{ opacity:.5; cursor:not-allowed; transform:none; }

    .btnPrimary{
      border-color: rgba(255,255,255,.22);
      background: linear-gradient(135deg, rgba(255,215,0,.20), rgba(255,255,255,.08));
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      font-weight: 900;
      letter-spacing: .4px;
    }

    .controls{
      margin-top: 14px;
      display:grid;
      gap: 10px;
    }

    .row{
      display:flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .chip{
      flex: 1;
      min-width: 140px;
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(0,0,0,.20);
    }
    .label{ font-size: 12px; opacity:.75; }
    .value{ margin-top: 6px; }

    input{
      width: 100%;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.92);
      outline: none;
    }
    input:disabled{ opacity:.8; }

    .hint{
      margin-top: 8px;
      font-size: 12px;
      opacity: .8;
    }
    .err{
      margin-top: 8px;
      font-size: 12px;
      color: #ff8a8a;
    }

    /* === COIN === */
    .coinWrap{
      display:flex;
      align-items:center;
      justify-content:center;
      margin: 14px 0 8px;
      perspective: 900px;
    }
    .coin{
      width: 130px;
      height: 130px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 650ms cubic-bezier(.2,.8,.2,1);
    }
    .coinFace{
      position:absolute;
      inset:0;
      border-radius: 999px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight: 900;
      letter-spacing: 1px;
      border: 2px solid rgba(0,0,0,.15);
      box-shadow: 0 18px 44px rgba(0,0,0,.20);
      user-select:none;
      backface-visibility: hidden;
      text-shadow: 0 2px 18px rgba(0,0,0,.25);
    }
    .coinFront{
      background:
        radial-gradient(circle at 30% 25%, rgba(255,255,255,.95), rgba(255,255,255,.2)),
        linear-gradient(135deg, rgba(255,215,0,.92), rgba(218,165,32,.92));
    }
    .coinBack{
      transform: rotateY(180deg);
      background:
        radial-gradient(circle at 30% 25%, rgba(255,255,255,.9), rgba(255,255,255,.2)),
        linear-gradient(135deg, rgba(192,192,192,.92), rgba(169,169,169,.92));
    }
    .flipping .coin{
      animation: coinFlip 900ms ease-in-out;
    }
    @keyframes coinFlip{
      0%   { transform: rotateY(0deg) rotateX(0deg); }
      40%  { transform: rotateY(540deg) rotateX(14deg); }
      70%  { transform: rotateY(900deg) rotateX(-10deg); }
      100% { transform: rotateY(1080deg) rotateX(0deg); }
    }

    /* WIN/LOSS banner */
    .resultBanner{
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(0,0,0,.18);
      text-align:center;
      font-weight: 900;
      letter-spacing: .6px;
      transition: box-shadow .2s ease, transform .2s ease;
      min-height: 42px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .resultBanner.win{
      box-shadow: 0 0 0 1px rgba(0,255,140,.25), 0 0 40px rgba(0,255,140,.18);
      transform: translateY(-1px);
    }
    .resultBanner.loss{
      box-shadow: 0 0 0 1px rgba(255,70,70,.25), 0 0 40px rgba(255,70,70,.18);
      transform: translateY(-1px);
    }

    /* Toast / resultado */
    .toast{
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px dashed rgba(255,255,255,.18);
      background: rgba(0,0,0,.20);
      opacity: .9;
      min-height: 42px;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
    }

    /* History */
    .history{
      margin-top: 14px;
    }
    .historyTitle{
      margin: 0 0 10px;
      font-size: 14px;
      opacity: .9;
      letter-spacing: .3px;
    }
    .hItem{
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.16);
      display:flex;
      justify-content:space-between;
      gap: 12px;
    }
    .hLeft{ display:flex; flex-direction:column; gap: 4px; }
    .hRight{ text-align:right; opacity:.85; font-size: 12px; }
    .tag{ font-weight: 900; letter-spacing:.4px; }
    .tag.win{ color: rgba(120,255,200,.95); }
    .tag.loss{ color: rgba(255,140,140,.95); }
    .muted{ opacity:.75; font-size: 12px; }
    .list{ display:grid; gap: 8px; }
  `;

  return (
    <div className="page">
      <div className="card">
        <div className="top">
          <div>
            <h1 className="title">🎲 CoinFlip</h1>
            <p className="sub">Off-chain UI (sem wallet / sem rede)</p>
          </div>

          <div className="balance">
            <span>Saldo:</span>
            <b>{balance.toFixed(2)}</b>
            <button className="btn" type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        {/* MOEDA */}
        <div className={`coinWrap ${status === "flipping" ? "flipping" : ""}`}>
          <div
            className="coin"
            style={{
              transform:
                result == null
                  ? undefined
                  : result === "heads"
                  ? "rotateY(0deg)"
                  : "rotateY(180deg)",
            }}
          >
            <div className="coinFace coinFront">{faceLabel("heads")}</div>
            <div className="coinFace coinBack">{faceLabel("tails")}</div>
          </div>
        </div>

        {/* WIN/LOSS */}
        <div
          className={`resultBanner ${
            lastWin === true ? "win" : lastWin === false ? "loss" : ""
          }`}
        >
          {lastWin === null ? "—" : lastWin ? "✅ WIN" : "❌ LOSS"}
        </div>

        {/* CONTROLES */}
        <div className="controls">
          <div className="row">
            <button
              className="btn"
              type="button"
              onClick={() => setPick("heads")}
              disabled={status !== "idle"}
              style={{ fontWeight: pick === "heads" ? 900 : 600 }}
            >
              Cara
            </button>

            <button
              className="btn"
              type="button"
              onClick={() => setPick("tails")}
              disabled={status !== "idle"}
              style={{ fontWeight: pick === "tails" ? 900 : 600 }}
            >
              Coroa
            </button>
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
                <div className="hint">Escolha e clique em Flip.</div>
              )}
            </div>
          </div>

          <button
            className="btn btnPrimary"
            type="button"
            onClick={flip}
            disabled={!canFlip}
          >
            {status === "flipping" ? "Flipping..." : "Flip"}
          </button>
        </div>

        {/* RESULTADO */}
        <div className="toast">
          {result
            ? `Saiu: ${faceLabel(result)}`
            : status === "flipping"
            ? "🌀 Girando..."
            : "—"}
        </div>

        {/* HISTÓRICO */}
        <div className="history">
          <h2 className="historyTitle">Histórico (últimos 10)</h2>

          {history.length === 0 ? (
            <div className="muted">Nenhum flip ainda.</div>
          ) : (
            <div className="list">
              {history.slice(0, 10).map((h) => (
                <div className="hItem" key={h.id}>
                  <div className="hLeft">
                    <div className={`tag ${h.win ? "win" : "loss"}`}>
                      {h.win ? "✅ WIN" : "❌ LOSS"} — aposta {h.bet}
                    </div>
                    <div className="muted">
                      Você: {faceLabel(h.pick)} | Saiu: {faceLabel(h.result)}
                    </div>
                  </div>
                  <div className="hRight">
                    <div>{h.time}</div>
                    <div>Saldo: {h.balanceAfter}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{css}</style>
      </div>
    </div>
  );
}