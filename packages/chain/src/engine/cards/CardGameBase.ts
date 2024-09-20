import { RuntimeModule, runtimeModule, state } from '@proto-kit/module';
import { assert, StateMap } from '@proto-kit/protocol';
import { Group, Proof, PublicKey, Struct, UInt64 } from 'o1js';
import { IEncrypedCard } from './interfaces/IEncryptedCard';
import { ICard } from './interfaces/ICard';

@runtimeModule()
export class CardGameBase<
  C extends ICard<EC>,
  EC extends IEncrypedCard<C>,
> extends RuntimeModule {
  // @state() public games = StateMap.from<UInt64, any>(UInt64, BasicGame);

  // protected _shuffle(shuffleProof: Proof<any, { newDeck: ED }>): ED {
  protected _shuffle(
    shuffleProof: Proof<any, any>,
    currentDeck: any,
    currentAgrigatedPubKey: PublicKey,
  ) {
    shuffleProof.verify();

    // assert(shuffleProof.publicInput.initialDeck.equals(currentDeck));
    // assert(
    //   shuffleProof.publicInput.agrigatedPubKey.equals(currentAgrigatedPubKey),
    // );

    return shuffleProof.publicOutput.newDeck;
  }

  protected _decrypt(
    encryptedCard: IEncrypedCard<any>,
    decryptProof: Proof<any, { decryptedPart: Group }>,
  ) {
    // #TODO add checks
    decryptProof.verify();

    // assert(decryptProof.publicInput.m0.equals(encryptedCard.value[0]));

    encryptedCard.addDecryption(decryptProof.publicOutput.decryptedPart);
  }

  protected _open(
    encryptedCard: IEncrypedCard<any>,
    decryptProof: Proof<any, { decryptedPart: Group }>,
  ): C {
    this._decrypt(encryptedCard, decryptProof);

    return encryptedCard.toCard();
  }
}
