import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
  } from "@proto-kit/module";
  import { State, StateMap, assert } from "@proto-kit/protocol";
  import { PublicKey, Struct, UInt64, Provable, Bool } from "o1js";
  
  interface MatchMakerConfig {
  }
  
  const PENDING_BLOCKS_NUM = UInt64.from(5);

  export class RoundIdxKey extends Struct({
    roundId: UInt64,
    sessionKey: PublicKey
  }) { }

  export class RoundIdxIndex extends Struct({
    roundId: UInt64,
    index: UInt64
  }) { }

  @runtimeModule()
  export class MatchMaker extends RuntimeModule<MatchMakerConfig> {
    // Session => user
    @state() public sesions = StateMap.from<PublicKey, PublicKey>(
      PublicKey,
      PublicKey
    );
    // mapping(roundId => mapping(registered session key => bool))
    @state() public queueRegisteredRoundSessionKeys = StateMap.from<RoundIdxKey, Bool>(
      RoundIdxKey,
      Bool
    );
    // mapping(roundId => SessionKey[])
    @state() public queueRoundSessionKeysList = StateMap.from<RoundIdxIndex, PublicKey>(
      RoundIdxIndex,
      PublicKey
    );
    @state() public queueLength = StateMap.from<UInt64, UInt64>(
      UInt64,
      UInt64
    );
    @state() public confirmations = StateMap.from<PublicKey, PublicKey>(
      PublicKey,
      PublicKey
    );
  
    @runtimeMethod()
    public register(sessionKey: PublicKey): void {
      this.sesions.set(sessionKey, this.transaction.sender);
      const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);
      
      const queueLength = this.queueLength.get(roundId).orElse(UInt64.from(0));

      // If already registered place player on 99999999999 place in queue
      const nextIndex = Provable.if(this.queueRegisteredRoundSessionKeys.get(
        new RoundIdxKey({roundId, sessionKey})).isSome.not(),
        queueLength, UInt64.from(99999999999)
      );
      const queueLengthDiff = Provable.if(this.queueRegisteredRoundSessionKeys.get(
        new RoundIdxKey({roundId, sessionKey})).isSome.not(),
        UInt64.from(1), UInt64.from(0)
      );
      this.queueRoundSessionKeysList.set(new RoundIdxIndex({roundId, index: nextIndex}), sessionKey);
      this.queueRegisteredRoundSessionKeys.set(new RoundIdxKey({roundId, sessionKey}), Bool(true));
      this.queueLength.set(roundId, queueLength.add(queueLengthDiff));
    }

    @runtimeMethod()
    public keepSession(): void {
    }

    @runtimeMethod()
    public requestMatch(opponentKey: PublicKey): void {
      this.confirmations.set(this.transaction.sender, opponentKey);
    }

    @runtimeMethod()
    public confirmMatch(opponentKey: PublicKey): void {
      this.confirmations.set(this.transaction.sender, opponentKey);
    }

  }