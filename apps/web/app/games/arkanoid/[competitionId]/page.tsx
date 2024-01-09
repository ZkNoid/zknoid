'use client';

import ArkanoidPageDynamic from '@/components/arkanoid/ArkanoidPageDynamic';

export default function Home({ params }: { params: { competitionId: string } }) {
    return (
        <ArkanoidPageDynamic params={params} />
    )
}
