import { Wallet } from "ethers";

/**
 * Gera uma nova carteira (chave privada + endereço).
 * ATENÇÃO: para fins educacionais. Não use em produção sem criptografar e proteger storage.
 */
export function createWallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    // Se o projeto estiver com mnemonic habilitado, pode existir:
    mnemonic: wallet.mnemonic?.phrase ?? null,
  };
}
