"use client";

import { useMemo } from "react";
import { arkanoidConfig } from "./config";
import { getZkNoidGameClient } from "@/lib/createConfig";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import ArkanoidPage from "./components/ArkanoidPage";

export default function Page({
    params,
}: {
    params: { competitionId: string };
}) {
    const client = useMemo(() => getZkNoidGameClient(arkanoidConfig), []);
    return (
        <AppChainClientContext.Provider value={client}>
            <ArkanoidPage params={{
                competitionId: params.competitionId
            }} />
        </AppChainClientContext.Provider>
    )
}