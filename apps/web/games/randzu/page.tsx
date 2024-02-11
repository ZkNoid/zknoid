"use client";

import { useMemo } from "react";
import { randzuConfig } from "./config";
import { getZkNoidGameClient } from "@/lib/createConfig";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import RandzuPage from "./components/RandzuPage";

export default function Page({
    params,
}: {
    params: { competitionId: string };
}) {
    const client = useMemo(() => getZkNoidGameClient(randzuConfig), []);
    return (
        <AppChainClientContext.Provider value={client}>

            <RandzuPage params={{
                competitionId: params.competitionId
            }} />
        </AppChainClientContext.Provider>
    )
}