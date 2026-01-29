"use client";

import { useMemo, useState } from "react";
import {
  BASE,
  WalletView,
  createWallet,
  vaultDelete,
  vaultExists,
  vaultLoad,
  vaultSave,
} from "../lib/wallet";

export default function Page() {
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState<WalletView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const hasVault = useMemo(() => {
    try {
      return vaultExists();
    } catch {
      return false;
    }
  }, [wallet]); // recalcula quando muda estado

  function flashInfo(msg: string) {
    setInfo(msg);
    setError(null);
  }

  function flashError(msg: string) {
    setError(msg);
    setInfo(null);
  }

  function lock() {
    setWallet(null);
    flashInfo("Trancado. Wallet removida da tela.");
  }

  function generateAndSave() {
    try {
      setError(null);
      setInfo(null);

      const w = createWallet();
      vaultSave(w, password);
      setWallet(w);

      flashInfo("Wallet criada e salva criptografada no cofre local.");
    } catch (e: any) {
      flashError(e?.message ?? "Erro ao salvar no cofre.");
    }
  }

  function unlock() {
    try {
      setError(null);
      setInfo(null);

      const w = vaultLoad(password);
      setWallet(w);

      flashInfo("Cofre desbloqueado com sucesso.");
    } catch (e: any) {
      flashError(e?.message ?? "Erro ao desbloquear.");
    }
  }

  function removeVault() {
    try {
      vaultDelete();
      setWallet(null);
      flashInfo("Cofre apagado do navegador.");
    } catch (e: any) {
      flashError(e?.message ?? "Erro ao apagar cofre.");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 920 }}>
      <h1 style={{ marginBottom: 6 }}>PixWallet (Base-only)</h1>
      <p style={{ marginTop: 0 }}>
        Rede: <strong>{BASE.name}</strong> (chainId <strong>{BASE.chainId}</strong>)
      </p>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
          Senha do cofre (mín. 8 caracteres)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha..."
          style={{ padding: 10, width: "100%", maxWidth: 420 }}
        />
        <p style={{ fontSize: 13, marginTop: 8, opacity: 0.8 }}>
          A senha não é enviada para lugar nenhum. O cofre fica no seu navegador (localStorage).
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={generateAndSave} style={{ padding: "10px 14px", cursor: "pointer" }}>
          Gerar wallet + salvar criptografada
        </button>

        <button onClick={unlock} style={{ padding: "10px 14px", cursor: "pointer" }} disabled={!hasVault}>
          Desbloquear cofre
        </button>

        <button onClick={lock} style={{ padding: "10px 14px", cursor: "pointer" }} disabled={!wallet}>
          Trancar (limpar da tela)
        </button>

        <button onClick={removeVault} style={{ padding: "10px 14px", cursor: "pointer" }}>
          Apagar cofre
        </button>
      </div>

      {(error || info) && (
        <div style={{ marginTop: 14 }}>
          {error && <div style={{ padding: 10, border: "1px solid #ccc" }}>❌ {error}</div>}
          {info && <div style={{ padding: 10, border: "1px solid #ccc" }}>✅ {info}</div>}
        </div>
      )}

      {wallet && (
        <div style={{ marginTop: 18 }}>
          <h2 style={{ marginBottom: 8 }}>Wallet desbloqueada</h2>

          <div style={{ marginTop: 10 }}>
            <strong>Endereço:</strong>
            <div style={{ wordBreak: "break-all" }}>{wallet.address}</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Chave privada (NÃO compartilhe):</strong>
            <div style={{ wordBreak: "break-all" }}>{wallet.privateKey}</div>
          </div>

          {wallet.mnemonic && (
            <div style={{ marginTop: 10 }}>
              <strong>Seed phrase (NÃO compartilhe):</strong>
              <div style={{ wordBreak: "break-all" }}>{wallet.mnemonic}</div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <strong>Explorer:</strong>{" "}
            <a href={BASE.explorer} target="_blank" rel="noreferrer">
              {BASE.explorer}
            </a>
          </div>
        </div>
      )}

      <hr style={{ marginTop: 24, marginBottom: 12 }} />
      <p style={{ fontSize: 14 }}>
        ⚠️ Educacional: para produção, prefira WebCrypto + UX segura (não exibir chave privada por padrão).
      </p>
    </main>
  );
}
