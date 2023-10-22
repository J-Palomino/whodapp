"use client";

import {  ComethWallet } from "@cometh/connect-sdk";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const WalletContext = createContext<{
    wallet: ComethWallet | null;
    setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
}>({
    wallet: null,
    setWallet: () => {},
});
export function WalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element {
    const [wallet, setWallet] = useState<ComethWallet | null>(null);

    return (
        <WalletContext.Provider
          value={{
            wallet,
            setWallet,
        }}
        >
          {children}
        </WalletContext.Provider>
      );
    }
