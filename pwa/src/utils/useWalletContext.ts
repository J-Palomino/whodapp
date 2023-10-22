import { useContext } from "react";
import { WalletContext } from "./services/context";

export function useWalletContext() {
    const {
      wallet,
      setWallet,
    } = useContext(WalletContext);
    return {
      wallet,
      setWallet,
    };
}