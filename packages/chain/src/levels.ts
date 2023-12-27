import { Int64, UInt64 } from 'o1js';
import { Brick, Bricks, IntPoint } from './types.js';

export const defaultLevel = (): Bricks => {
    const MAX_BRICKS = 10;

    const bricks: Bricks = new Bricks({
        bricks: [...new Array(MAX_BRICKS)].map(
            (elem) =>
                new Brick({
                    pos: new IntPoint({
                        x: Int64.from(0),
                        y: Int64.from(0),
                    }),
                    value: UInt64.from(1),
                })
        ),
    });
    bricks.bricks[0] = new Brick({
        pos: new IntPoint({
            x: Int64.from(125),
            y: Int64.from(130),
        }),
        value: UInt64.from(2),
    });

    bricks.bricks[1] = new Brick({
        pos: new IntPoint({
            x: Int64.from(136),
            y: Int64.from(70),
        }),
        value: UInt64.from(2),
    });

    bricks.bricks[2] = new Brick({
        pos: new IntPoint({
            x: Int64.from(150),
            y: Int64.from(156),
        }),
        value: UInt64.from(2),
    });
    return bricks;
};
