"use client";

import { useMemo } from "react";
import { AppChainClientContext } from "@/lib/contexts/AppChainClientContext";
import RandzuPage from "./components/RandzuPage";
import { zkNoidConfig } from "../config";

export default function Page({
    params,
}: {
    params: { competitionId: string };
}) {
    const client = useMemo(() => zkNoidConfig.getClient(), []);
    return (
        <AppChainClientContext.Provider value={client}>

            <RandzuPage params={{
                competitionId: params.competitionId
            }} />
        </AppChainClientContext.Provider>
    )
}