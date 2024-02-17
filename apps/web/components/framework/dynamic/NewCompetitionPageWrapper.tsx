'use client';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { useMemo } from 'react';


export default function Page({ gameId }: { gameId: string }) {
    const config = useMemo(() => zkNoidConfig.games.find(game => game.id == gameId)!, []);
    const client = useMemo(() => zkNoidConfig.getClient(), []);

    const NewCompetitionPage = config.pageNewCompetition!;

    return (
        <AppChainClientContext.Provider value={client}>
            <NewCompetitionPage />
        </AppChainClientContext.Provider>
    )
}
