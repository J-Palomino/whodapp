"use client";

import {
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
} from "@cometh/connect-sdk";
import { useState } from "react";
import { signIn } from 'next-auth/react'
import { useWalletContext } from "./useWalletContext";

import { api } from "@/utils/api";



export function useWalletAuth() {

  const {
    setWallet,
    wallet,
  } = useWalletContext();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);

  const apiKey ="0bb94c4c-3dc1-4adf-9d9a-fc84e397cec8";

  const createUser = api.user.createUser.useMutation()
  const getUser = api.user.getUserById.useQuery();
  


  function displayError(message: string) {
    setConnectionError(message);
  }


  async function connect() {
    if (!apiKey) throw new Error("no apiKey provided");
    setIsConnecting(true);
    try {
      const walletAdaptor = new ConnectAdaptor({
        chainId: SupportedNetworks.MUMBAI,
        apiKey,
      });

      const instance = new ComethWallet({
        authAdapter: walletAdaptor,
        apiKey,
      });

      const localStorageAddress = window.localStorage.getItem("walletAddress");
      if(!getUser.data?.wallet){
        createUser.mutate({wallet: localStorageAddress})

      }
      


      if (localStorageAddress) {
        await instance.connect(localStorageAddress);
      } else {
        await instance.connect();
        const walletAddress = await instance.getAddress();
        window.localStorage.setItem("walletAddress", walletAddress);
      }

      //const instanceProvider = new ComethProvider(instance);

      setIsConnected(true);
      setWallet(instance as any);
      try{
        const callbackUrl ='/protected'
        if(wallet?.getAddress && getUser.data?.wallet !== wallet?.getAddress()){
          signIn('credentials', {address: wallet?.getAddress() as string, callbackUrl: callbackUrl})
          return
        };
      }catch (e) {
        displayError((e as Error).message);
      }
  
      
      

    } catch (e) {
      displayError((e as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {

    if (wallet) {
      try {
        await wallet!.logout();

      } catch (e) {
        displayError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    connect,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
    
  };
}