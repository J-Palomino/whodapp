import { useEffect, useState } from 'react';
import { PushAPI } from "@pushprotocol/restapi";
import { ConnectButton } from "@rainbow-me/rainbowkit"
import PushSDK from "@pushprotocol/restapi";

import { ethers } from 'ethers';
import { useWalletClient, useAccount } from 'wagmi'

const Notifications = () => {
    const recepientAddress = 'eip155:42:0x71BF184230bF6D412854fffEF1fcf88E62395e8b';
    const [notification, setNotification] = useState(null);
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/");
    const { data: signer } = useWalletClient();
    const signerAddress = signer?.account?.address;

    const fetchNotifs = async () => {
        const userAlice = await PushAPI.initialize(signer, { env: 'staging' })
        const inboxNotifications = await userAlice.notification.list('INBOX')
        console.log('Inbox Notifications: \n', inboxNotifications);

        const notifications = await PushAPI.user.getFeeds({
            user: `eip155:42:${signerAddress}`, // user address in CAIP-10
            env: 'staging',
        });

        console.log('Notifications: \n', notifications);
        setNotification(notifications);
    }

    // useEffect(() => {
    //     fetchNotifs();
    // }, [signer]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <ConnectButton />
            {/* Render userAlice data here */}
            <button onClick={fetchNotifs}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Fetch Notifications</button>
        </div>
    );
};

export default Notifications;