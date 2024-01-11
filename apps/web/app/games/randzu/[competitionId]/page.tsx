'use client';

import RandzuPageDynamic from '@/components/randzu/RandzuPageDynamic';

export default function Home({ params }: { params: { competitionId: string } }) {
    return (
        <RandzuPageDynamic params={params} />
    )
}
