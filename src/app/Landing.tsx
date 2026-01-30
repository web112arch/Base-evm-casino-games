import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const CONTRACTS = [
  "CoinFlip.sol",
  "Dice.sol",
  "HighLow.sol",
  "LuckyDraw.sol",
  "EvenOdd.sol",
  "Wheel.sol",
  "DoubleOrNothing.sol",
];

export default function Landing() {
  return (
    <div style={styles.page}>
      <SiteHeader />

      <main style={styles.main}>
        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <h1 style={styles.h1}>
              Casino games simples para <span style={styles.grad}>EVM L2</span>
            </h1>
            <p style={styles.p}>
              Um kit open-source com UI (Next.js) + contratos Solidity.
              Feito para ser fácil de entender, evoluir e apresentar (Gitcoin / portfólio).
            </p>

            <div style={styles.ctaRow}>
              <a href="/coinflip" style={styles.ctaPrimary}>Jogar CoinFlip</a>
              <a
                href="https://github.com/web112arch/Base-evm-casino-games"
                target="_blank"
                rel="noreferrer"
                style={styles.ctaSecondary}
              >
                Ver repositório
              </a>
            </div>

            <div style={styles.note}>
              ⚠️ Randomness sem VRF/oráculo. Não é “provably fair”. Projeto experimental/educacional.
            </div>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.cardTitle}>O que tem aqui</div>
            <ul style={styles.ul}>
              <li>✅ UI por rota (ex.: /coinflip)</li>
              <li>✅ Pasta contracts/ com vários jogos</li>
              <li>✅ Docs (/docs) + roadmap</li>
              <li>✅ Estrutura pronta pra evoluir</li>
            </ul>

            <div style={styles.miniGrid}>
              <div style={styles.miniBox}>
                <div style={styles.miniLabel}>Stack</div>
                <div style={styles.miniValue}>Next.js App Router</div>
              </div>
              <div style={styles.miniBox}>
                <div style={styles.miniLabel}>Network</div>
                <div style={styles.miniValue}>Base L2 (alvo)</div>
              </div>
              <div style={styles.miniBox}>
                <div style={styles.miniLabel}>Status</div>
                <div style={styles.miniValue}>Publicável no GitHub</div>
              </div>
              <div style={styles.miniBox}>
                <div style={styles.miniLabel}>Objetivo</div>
                <div style={styles.miniValue}>Portfólio + Grants</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={styles.section}>
          <h2 style={styles.h2}>Features</h2>
          <div style={styles.grid3}>
            {[
              { t: "Clareza", d: "Código simples, rotas organizadas, sem dependências desnecessárias." },
              { t: "Evolução fácil", d: "Você consegue plugar contratos no front sem reescrever a base." },
              { t: "Vitrine", d: "Ideal para Gitcoin: docs, contratos, UI e estrutura limpa." },
            ].map((x) => (
              <div key={x.t} style={styles.box}>
                <div style={styles.boxTitle}>{x.t}</div>
                <div style={styles.boxDesc}>{x.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contracts */}
        <section id="contracts" style={styles.section}>
          <div style={styles.rowBetween}>
            <h2 style={styles.h2}>Contratos</h2>
            <a
              href="https://github.com/web112arch/Base-evm-casino-games/tree/main/contracts"
              target="_blank"
              rel="noreferrer"
              style={styles.smallLink}
            >
              Abrir pasta contracts →
            </a>
          </div>

          <div style={styles.contractList}>
            {CONTRACTS.map((c) => (
              <div key={c} style={styles.contractItem}>
                <span style={{ opacity: 0.8 }}>📄</span>
                <span style={{ fontWeight: 700 }}>{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" style={styles.section}>
          <div style={styles.rowBetween}>
            <h2 style={styles.h2}>Roadmap</h2>
            <a
              href="https://github.com/web112arch/Base-evm-casino-games/tree/main/docs"
              target="_blank"
              rel="noreferrer"
              style={styles.smallLink}
            >
              Abrir docs →
            </a>
          </div>

          <div style={styles.grid2}>
            <div style={styles.box}>
              <div style={styles.boxTitle}>v0.1 — Core</div>
              <div style={styles.boxDesc}>Contratos básicos + UI + docs.</div>
            </div>
            <div style={styles.box}>
              <div style={styles.boxTitle}>v0.2 — Qualidade</div>
              <div style={styles.boxDesc}>Testes (Foundry), lint, CI e releases.</div>
            </div>
            <div style={styles.box}>
              <div style={styles.boxTitle}>v0.3 — Fairness</div>
              <div style={styles.boxDesc}>Versões commit-reveal / melhorias de RNG.</div>
            </div>
            <div style={styles.box}>
              <div style={styles.boxTitle}>v0.4 — Integração</div>
              <div style={styles.boxDesc}>Conectar UI ↔ contratos e mostrar txs/estados.</div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    color: "white",
    background:
      "radial-gradient(1200px 700px at 20% 10%, rgba(79,70,229,0.25), transparent 55%)," +
      "radial-gradient(900px 600px at 80% 20%, rgba(16,185,129,0.18), transparent 55%)," +
      "linear-gradient(180deg, #0b0b10 0%, #07070a 100%)",
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: "28px 20px 0" },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 18,
    alignItems: "stretch",
    padding: "24px 0 10px",
  },
  heroLeft: { paddingTop: 8 },
  heroCard: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 12px 34px rgba(0,0,0,0.35)",
  },
  h1: { fontSize: 44, lineHeight: 1.05, margin: "0 0 12px", fontWeight: 900, letterSpacing: -0.6 },
  grad: {
    background: "linear-gradient(90deg, rgba(99,102,241,1), rgba(16,185,129,1))",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  p: { fontSize: 16, opacity: 0.86, maxWidth: 620, margin: "0 0 16px" },
  ctaRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
  ctaPrimary: {
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.12)",
  },
  ctaSecondary: {
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    opacity: 0.9,
  },
  note: {
    marginTop: 14,
    fontSize: 13,
    opacity: 0.75,
    border: "1px solid rgba(255,255,255,0.10)",
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    maxWidth: 680,
  },
  cardTitle: { fontWeight: 900, marginBottom: 10, fontSize: 14, opacity: 0.95 },
  ul: { margin: 0, paddingLeft: 16, opacity: 0.85, lineHeight: 1.7, fontSize: 13 },
  miniGrid: { marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  miniBox: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 10,
  },
  miniLabel: { fontSize: 11, opacity: 0.7, marginBottom: 4 },
  miniValue: { fontSize: 13, fontWeight: 800, opacity: 0.95 },

  section: { padding: "26px 0" },
  h2: { margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: -0.2 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 12 },
  box: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
  },
  boxTitle: { fontWeight: 900, fontSize: 15, marginBottom: 6 },
  boxDesc: { fontSize: 13, opacity: 0.8, lineHeight: 1.55 },

  rowBetween: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  smallLink: { textDecoration: "none", fontSize: 13, opacity: 0.85 },

  contractList: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  contractItem: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: "12px 12px",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
};