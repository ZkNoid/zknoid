"use client";

import { useMemo } from "react";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import ArkanoidPage from "./components/ArkanoidPage";
import Head from "next/head";
import { zkNoidConfig } from "../config";

export default function Page({
    params,
}: {
    params: { competitionId: string };
}) {
    const client = useMemo(() => zkNoidConfig.getClient(), []);
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