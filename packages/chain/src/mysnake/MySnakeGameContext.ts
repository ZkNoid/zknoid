import { UInt64, Struct, PublicKey } from 'o1js';
import { MySnakeField } from './MySnakeLogic';

export class MySnakeGameContext extends Struct({
  field: MySnakeField,
  score: UInt64,
  player: PublicKey,
}) {
  processUpdate(newField: MySnakeField) {
    // this.field.assertFieldUpdate(newField);
  }
}
