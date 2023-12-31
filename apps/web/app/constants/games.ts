export enum GameType {
    Arkanoid = 'arkanoid'
}

export interface IGame {
    type: GameType;
    logo: string;
    name: string;
    description: string;
}

export const games: IGame[] = [
    {
        type: GameType.Arkanoid,
        logo: '/Arkanoid.png',
        name: 'Arcanoid game',
        description: 'Old but gold game. Beat all the bricks and protect the ball from falling'
    }
]