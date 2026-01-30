"use client";

export default function SiteHeader() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logo}>🎲</div>
          <div>
            <div style={styles.title}>Base EVM Casino Games</div>
            <div style={styles.subtitle}>UI + contratos Solidity (experimental)</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <a style={styles.link} href="#features">Features</a>
          <a style={styles.link} href="#contracts">Contratos</a>
          <a style={styles.link} href="#roadmap">Roadmap</a>
          <a style={styles.primaryLink} href="/coinflip">Abrir CoinFlip</a>
        </nav>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(10px)",
    background: "rgba(10,10,12,0.65)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  title: { fontWeight: 800, fontSize: 16, lineHeight: 1.1 },
  subtitle: { fontSize: 12, opacity: 0.75, marginTop: 2 },
  nav: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  link: { fontSize: 13, opacity: 0.85, textDecoration: "none" },
  primaryLink: {
    fontSize: 13,
    textDecoration: "none",
    padding: "9px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    fontWeight: 700,
  },
};