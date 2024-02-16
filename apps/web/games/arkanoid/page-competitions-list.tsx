"use client";

import { useMemo } from "react";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import ArkanoidCompetitionsListPage from "./components/ArkanoidCompetitionsListPage";
import { zkNoidConfig } from "../config";

export default function Page() {
    const client = useMemo(() => zkNoidConfig.getClient(), []);
    return (
        <AppChainClientContext.Provider value={client}>
            <ArkanoidCompetitionsListPage />
        </AppChainClientContext.Provider>
    )
}