import { assert } from '@proto-kit/protocol';
import { UInt64, Provable, Struct, Bool, PublicKey } from 'o1js';

export const MY_SNAKE_FIELD_SIZE = 10;

export const CELL_EMPTY = UInt64.from(0);
export const CELL_SNAKE_TAIL = UInt64.from(1);
export const CELL_SNAKE_BODY = UInt64.from(2);
export const CELL_SNAKE_HEAD = UInt64.from(3);
export const CELL_EGG = UInt64.from(4);

export const SNAKE_NOT_FOUND = UInt64.from(0);
export const SNAKE_PROCESSING = UInt64.from(1);
export const SNAKE_PROCESSED = UInt64.from(2);

export class MySnakeField extends Struct({
  value: Provable.Array(
    Provable.Array(UInt64, MY_SNAKE_FIELD_SIZE),
    MY_SNAKE_FIELD_SIZE,
  ),
}) {
  static from(value: number[][]) {
    return new MySnakeField({
      value: value.map((row) => row.map((x) => UInt64.from(x))),
    });
  }

  /**
   * Correct snake configuration - tail body body ... body head
   */
  assertInitialState() {
    let snakeFound = Bool(false);
    let eggFound = Bool(true);

    for (let i = 0; i < MY_SNAKE_FIELD_SIZE; i++) {
      let snakeSearchState = UInt64.from(0);

      for (let j = 0; j < MY_SNAKE_FIELD_SIZE; j++) {
        const currentCell = this.value[i][j];
        assert(
          // That's imposible to meet nothing else than empty cell or snake head if snake is not yet found
          Bool.and(
            snakeSearchState.equals(SNAKE_NOT_FOUND),
            currentCell
              .equals(CELL_EMPTY)
              .or(currentCell.equals(CELL_SNAKE_HEAD))
              .not(),
          ).not(),
          `Incorrect first snake cell`,
        );
        assert(
          // When processing a snake we can meet only body cells or tail cells
          Bool.and(
            snakeSearchState.equals(SNAKE_PROCESSING),
            currentCell
              .equals(CELL_SNAKE_BODY)
              .or(currentCell.equals(CELL_SNAKE_TAIL))
              .not(),
          ).not(),
          `Incorrect first snake cell`,
        );
        assert(
          Bool.and(
            snakeSearchState.equals(SNAKE_PROCESSED),
            currentCell.equals(CELL_EMPTY).not(),
          ).not(),
          `Not empty cell found after snake finished`,
        );
        // We can't find second egg if one is already found
        assert(
          Bool.and(eggFound, currentCell.equals(CELL_EGG).not()).not(),
          `Second egg found`,
        );

        // If snake is still not found and we met snake tail, setting snake processing state
        snakeSearchState = Provable.if(
          snakeSearchState
            .equals(SNAKE_NOT_FOUND)
            .and(currentCell.equals(CELL_SNAKE_TAIL)),
          SNAKE_PROCESSING,
          snakeSearchState,
        );

        // If we process snake and see head, setting processed state
        snakeSearchState = Provable.if(
          snakeSearchState
            .equals(SNAKE_PROCESSING)
            .and(currentCell.equals(CELL_SNAKE_HEAD)),
          SNAKE_PROCESSED,
          snakeSearchState,
        );
        eggFound = currentCell.equals(CELL_EGG);
      }
      assert(
        snakeSearchState.equals(SNAKE_PROCESSING).not(),
        'Snake is not finished',
      );
      assert(
        Bool.or(snakeSearchState.equals(SNAKE_NOT_FOUND), snakeFound.not()),
        'There are two snakes',
      );
      snakeFound = snakeSearchState.equals(SNAKE_PROCESSED);
    }
  }

  isNearCell(i: number, j: number, cell: UInt64): Bool {
    return (
      i < MY_SNAKE_FIELD_SIZE - 1
        ? this.value[i + 1][j].equals(cell)
        : Bool(false)
    )
      .or(i > 0 ? this.value[i - 1][j].equals(cell) : Bool(false))
      .or(
        j < MY_SNAKE_FIELD_SIZE - 1
          ? this.value[i][j + 1].equals(cell)
          : Bool(false),
      )
      .or(j > 0 ? this.value[i][j - 1].equals(cell) : Bool(false));
  }

  assertFieldUpdate(newField: MySnakeField, biteProposed: Bool) {
    let eggFound = Bool(false);

    for (let i = 0; i < MY_SNAKE_FIELD_SIZE; i++) {
      for (let j = 0; j < MY_SNAKE_FIELD_SIZE; j++) {
        const oldCell = this.value[i][j];
        const newCell = newField.value[i][j];

        // Either current old cell is not a tail or new corresponding cell is empty
        assert(
          Bool.or(
            oldCell.equals(CELL_SNAKE_TAIL).not(),
            newCell.equals(CELL_EMPTY),
          ),
          'Old tail was not removed',
        );

        // If current new cell is a tail, old cell must be a body and must be near the old tail
        assert(
          Bool.or(
            newCell.equals(CELL_SNAKE_TAIL).not(),
            oldCell
              .equals(CELL_SNAKE_BODY)
              .and(this.isNearCell(i, j, CELL_SNAKE_TAIL)),
          ),
          'Incorrect new tail location',
        );

        // Either current old cell is not a head or new corresponding cell is the snake body
        assert(
          Bool.or(
            oldCell.equals(CELL_SNAKE_HEAD).not(),
            newCell.equals(CELL_SNAKE_BODY),
          ),
          'Old head has not become a body',
        );

        // Either current new cell is not a head or new head is near the old head took an empty or egg field
        assert(
          Bool.or(
            newCell.equals(CELL_SNAKE_HEAD).not(),
            newField
              .isNearCell(i, j, CELL_SNAKE_HEAD)
              .and(
                this.value[i][j]
                  .equals(CELL_EMPTY)
                  .or(this.value[i][j].equals(CELL_EGG)),
              ),
          ),
          'Incorrect new tail location',
        );

        assert(
          Bool.or(newCell.equals(CELL_EGG).not(), oldCell.equals(CELL_EGG)),
          'Egg must not move',
        );
        // We can't find second egg if one is already found
        assert(
          Bool.and(eggFound, newCell.equals(CELL_EGG).not()).not(),
          `Second egg found`,
        );

        eggFound = newCell.equals(CELL_EGG);
      }
    }
    eggFound.assertTrue('Egg not found');
  }
}

export class GameContext extends Struct({
  field: MySnakeField,
  score: UInt64,
  player: PublicKey,
}) {}
