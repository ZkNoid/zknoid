"use client";

import { useMemo } from "react";
import { arkanoidConfig } from "./config";
import { getZkNoidGameClient } from "@/lib/createConfig";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import ArkanoidPage from "./components/ArkanoidPage";
import Head from "next/head";

export default function Page({
    params,
}: {
    params: { competitionId: string };
}) {
    const client = useMemo(() => getZkNoidGameClient(arkanoidConfig), []);
    return (
        <AppChainClientContext.Provider value={client}>
            <Head>
                <title>ZkNoid – Arkanoid game</title>
            </Head>
            <ArkanoidPage params={{
                competitionId: params.competitionId
            }} />
        </AppChainClientContext.Provider>
    )
}