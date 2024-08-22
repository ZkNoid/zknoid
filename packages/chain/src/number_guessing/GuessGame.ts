import { RuntimeModule, runtimeModule } from '@proto-kit/module';
import {
  Field,
  Poseidon,
  PublicKey,
  UInt64,
} from 'o1js';

import { state, runtimeMethod } from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';

interface NumberGuessingConfig {}

@runtimeModule()
export class GuessGame extends RuntimeModule<NumberGuessingConfig> {
  @state() hiddenNumber = State.from<Field>(Field);
  @state() scores = StateMap.from<PublicKey, UInt64>(PublicKey, UInt64);

  @runtimeMethod()
  public async hideNumber(number: UInt64) {
    let curHiddenNumber = await this.hiddenNumber.get();

    assert(curHiddenNumber.value.equals(Field(0)), 'Number is already hidden');
    assert(
      curHiddenNumber.value.lessThan(Field(100)),
      'Value should be less then 100',
    );

    await this.hiddenNumber.set(Poseidon.hash(number.toFields()));
  }

  @runtimeMethod()
  async guessNumber(
    number: UInt64,
  ) {
    let curHiddenNumber = await this.hiddenNumber.get();

    assert(
      curHiddenNumber.value.equals(Poseidon.hash(number.toFields())),
      'Other number was guessed',
    );

    const sender = this.transaction.sender.value;

    let prevScores = await this.scores.get(sender);

    await this.scores.set(sender, prevScores.value.add(1));
    await this.hiddenNumber.set(Field(0));
  }
}
