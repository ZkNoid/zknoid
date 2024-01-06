export interface ArkanoidCompetition {
    id: string;
    name: string;
    enteringPrice: number;
    prizeFund: number;
}

export const arkanoidCompetitions: ArkanoidCompetition[] = [
    {
        id: 'global',
        name: 'Global competition',
        enteringPrice: 0,
        prizeFund: 0
    },
    {
        id: 'paid',
        name: 'Paid competition',
        enteringPrice: 5,
        prizeFund: 500
    }
]