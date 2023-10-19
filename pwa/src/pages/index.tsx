import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import Vision from "./vision";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import { PushAPI } from '@pushprotocol/restapi'
import { ethers } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit';



export default async function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  // Creating a random signer from a wallet, ideally this is the wallet you will connect
  // const signer = ethers.Wallet.createRandom()

  // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
  // const userAlice = await PushAPI.initialize(signer, { env: 'staging' })

  // List inbox notifications
  // const inboxNotifications = await userAlice.notification.list('INBOX')

  // console.log("inboxNotifications: ", inboxNotifications)

  return (
    <>
      <Head>
        <title>Who Dapp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <ConnectButton />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Who <span className="text-[hsl(280,100%,70%)]">Dapp</span>
          </h1>
          <Vision />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
