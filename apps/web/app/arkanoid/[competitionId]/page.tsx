'use client';

// import { PrivateKey, Provable, UInt64, Field, PublicKey } from 'o1js';


import AsyncPageDynamic from '@/containers/async-page-dynamic';

export default function Home({ params }: { params: { competitionId: string } }) {
    return (
        <AsyncPageDynamic params={params}/>
    )
}
