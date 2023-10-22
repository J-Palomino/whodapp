// Next.js https://nextjs.org/docs/getting-started/installation
// in src/page.tsx 
"use client";

import { ComethWallet } from "@cometh/connect-sdk";
import { useWalletAuth } from "@/utils/wallet";
import { api } from "@/utils/api";



interface ConnectWalletProps {
  connectionError: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  wallet: ComethWallet;
}

export default function Login() {
  const { isConnecting, isConnected, connect, connectionError, wallet }:ConnectWalletProps =
  useWalletAuth();
  const getUser = api.user.getUserById.useQuery();
 
  const getTextButton = () => {
    if (isConnected) {
      return (
        <>
          ✅ <a
            href={`https://mumbai.polygonscan.com/address/${wallet?.getAddress()||getUser.data?.user?.wallet}`}
            target="_blank"
          >
            {"Wallet connected"}
          </a>
        </>
      );
    } else if (isConnecting) {
      return (
        <>
         🔄 {"Getting wallet..."}
        </>
      );
    } else {
      return "Get your Wallet";
    }
  };

  return(
  <>
  {!connectionError?(
          <button 
          disabled ={isConnecting || isConnected || !!connectionError}
          onClick={connect} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">  
          {getTextButton()}
          </button>
):(
  <p className="flex items-center justify-center text-gray-900 bg-red-50">
  Connection denied
</p>

)
}

  </>

  )

}