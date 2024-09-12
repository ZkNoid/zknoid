import { runtimeModule, RuntimeModule } from '@proto-kit/module';
import {
  Field,
  Poseidon,
  PublicKey,
} from 'o1js';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { state, runtimeMethod } from '@proto-kit/module';
import { UInt64 } from '@proto-kit/library';

interface GuessGameConfig {}

@runtimeModule()
export class GuessGame extends RuntimeModule<GuessGameConfig> {
  @state() hiddenNumber = State.from<Field>(Field);
  @state() score = StateMap.from<PublicKey, UInt64>(PublicKey, UInt64);

  @runtimeMethod()
  async hideNumber(number: Field) {
    let curHiddenNumber = await this.hiddenNumber.get();

    assert(curHiddenNumber.value.equals(Field(0)), 'Number is already hidden');
    assert(number.lessThan(Field(100)), 'Value should be less then 100');

    await this.hiddenNumber.set(Poseidon.hash([number]));
  }

  @runtimeMethod()
  async guessNumber(
    number: Field,
  ) {
    let curHiddenNumber = await this.hiddenNumber.get();

    assert(curHiddenNumber.value.equals(Poseidon.hash([number])), 'Other numbre was guessed');

    const userScore = await this.score.get(this.transaction.sender.value);

    const newUserScore = userScore.value.add(UInt64.from(1));

    await this.score.set(this.transaction.sender.value, newUserScore);
    await this.hiddenNumber.set(Field(0));
  }
}