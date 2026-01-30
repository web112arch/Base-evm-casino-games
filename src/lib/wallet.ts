import { BrowserProvider } from "ethers";
import { BASE_NETWORK } from "../config/base";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(window.ethereum);

  // request account access
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const network = await provider.getNetwork();

  if (Number(network.chainId) !== BASE_NETWORK.chainId) {
    throw new Error("Wrong network. Please switch to Base.");
  }

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return {
    address,
    provider,
    signer,
  };
}