export default function SiteFooter() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={{ opacity: 0.75, fontSize: 13 }}>
          © {new Date().getFullYear()} Base EVM Casino Games — experimental / educational
        </div>

        <div style={styles.links}>
          <a style={styles.link} href="https://github.com/web112arch/Base-evm-casino-games" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a style={styles.link} href="#contracts">Contratos</a>
          <a style={styles.link} href="#roadmap">Roadmap</a>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: 40,
    padding: "22px 0",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  links: { display: "flex", gap: 14, flexWrap: "wrap" },
  link: { fontSize: 13, opacity: 0.8, textDecoration: "none" },
};