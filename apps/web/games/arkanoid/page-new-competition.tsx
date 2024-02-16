"use client";

import { useMemo } from "react";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import NewArkanoidCompetitionPage from "./components/NewArkanoidCompetitionPage";
import { zkNoidConfig } from "../config";

export default function Page() {
    const client = useMemo(() => zkNoidConfig.getClient(), []);
    return (
        <AppChainClientContext.Provider value={client}>
            <NewArkanoidCompetitionPage />
        </AppChainClientContext.Provider>
    )
}