"use client";

import { useMemo } from "react";
import { arkanoidConfig } from "./config";
import { getZkNoidGameClient } from "@/lib/createConfig";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import ArkanoidCompetitionsListPage from "./components/ArkanoidCompetitionsListPage";

export default function Page() {
    const client = useMemo(() => getZkNoidGameClient(arkanoidConfig), []);
    return (
        <AppChainClientContext.Provider value={client}>
            <ArkanoidCompetitionsListPage />
        </AppChainClientContext.Provider>
    )
}