export enum GameType {
    Arkanoid = 'arkanoid',
    Checkers = 'checkers'
}

export interface IGame {
    type: GameType;
    logo: string;
    name: string;
    description: string;
    tags: string[];
    active: boolean
}

export const games: IGame[] = [
    {
        type: GameType.Arkanoid,
        logo: '/Arkanoid.png',
        name: 'Arkanoid game',
        description: 'Old but gold game. Beat all the bricks and protect the ball from falling',
        tags: ['L2 game', 'singleplayer', 'retro'],
        active: true
    },
    {
        type: GameType.Checkers,
        logo: '/checkers.webp',
        name: 'Checkers game',
        description: 'Compete other players in the classic board game',
        tags: ['L2 game', 'multiplayer', 'board games'],
        active: false
    }
]