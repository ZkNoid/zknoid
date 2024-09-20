import { UInt64 } from '@proto-kit/library';
import { Bool, CircuitString, Field, Provable, PublicKey, Struct } from 'o1js';

export const DEFAULT_PARTICIPATION_FEE = UInt64.from(10 ** 9);

export function getLobbyV2(PLAYER_AMOUNT: number) {
  class LobbyV2 extends Struct({
    id: UInt64,
    name: CircuitString,
    players: Provable.Array(PublicKey, PLAYER_AMOUNT),
    ready: Provable.Array(Bool, PLAYER_AMOUNT),
    readyAmount: UInt64,
    curAmount: UInt64,
    participationFee: UInt64,
    accessKey: Field,
    privateLobby: Bool,
    active: Bool,
    started: Bool,
  }) {
    static from(
      name: CircuitString,
      participationFee: UInt64,
      privateLobby: Bool,
      accessKey: Field,
    ): LobbyV2 {
      return new LobbyV2({
        id: UInt64.zero,
        name,
        players: [...Array(PLAYER_AMOUNT)].map((n) => PublicKey.empty()),
        ready: [...Array(PLAYER_AMOUNT)].map((n) => Bool(false)),
        readyAmount: UInt64.zero,
        curAmount: UInt64.zero,
        participationFee,
        accessKey,
        privateLobby,
        active: Bool(true),
        started: Bool(false),
      });
    }

    static inactive(): LobbyV2 {
      let lobby = LobbyV2.from(
        CircuitString.fromString(''),
        UInt64.from(0),
        Bool(false),
        Field.from(0),
      );
      lobby.active = Bool(false);
      return lobby;
    }

    static default(id: UInt64, privateLobby: Bool): LobbyV2 {
      return new LobbyV2({
        id,
        name: CircuitString.fromString('Default'),
        players: [...Array(PLAYER_AMOUNT)].map((n) => PublicKey.empty()),
        ready: [...Array(PLAYER_AMOUNT)].map((n) => Bool(false)),
        readyAmount: UInt64.zero,
        curAmount: UInt64.zero,
        participationFee: DEFAULT_PARTICIPATION_FEE,
        accessKey: Field.from(0),
        privateLobby,
        active: Bool(true),
        started: Bool(false),
      });
    }

    isFull(): Bool {
      return this.curAmount.equals(UInt64.from(PLAYER_AMOUNT));
    }

    addPlayer(player: PublicKey): void {
      // #TODO Not fully constrain. Fix
      for (let i = 0; i < PLAYER_AMOUNT; i++) {
        let curI = UInt64.from(i);
        this.players[i] = Provable.if(
          curI.equals(this.curAmount),
          player,
          this.players[i],
        );
      }
      this.curAmount = this.curAmount.add(1);
    }

    removePlayer(player: PublicKey): void {
      let removed = Bool(false);

      for (let i = 0; i < PLAYER_AMOUNT - 1; i++) {
        let curI = UInt64.from(i);

        let found = this.players[i].equals(player);
        removed = removed.or(found);

        this.players[i] = Provable.if(
          removed,
          this.players[i + 1],
          this.players[i],
        );

        this.ready[i] = Provable.if(removed, this.ready[i + 1], this.ready[i]);
      }

      let found = this.players[PLAYER_AMOUNT - 1].equals(player);
      removed = removed.or(found);

      // Last item
      this.players[PLAYER_AMOUNT - 1] = Provable.if(
        removed,
        PublicKey.empty(),
        this.players[PLAYER_AMOUNT - 1],
      );

      this.ready[PLAYER_AMOUNT - 1] = Provable.if(
        removed,
        Bool(false),
        this.ready[PLAYER_AMOUNT - 1],
      );

      let subAmount = Provable.if<UInt64>(
        removed,
        UInt64,
        UInt64.from(1),
        UInt64.zero,
      );
      this.curAmount = this.curAmount.sub(subAmount);
      this.readyAmount = this.ready
        .map((elem) =>
          Provable.if<UInt64>(elem, UInt64, UInt64.from(1), UInt64.zero),
        )
        .reduce((acc, val) => acc.add(val));
    }

    getIndex(player: PublicKey): UInt64 {
      let result = UInt64.from(PLAYER_AMOUNT);
      for (let i = 0; i < PLAYER_AMOUNT; i++) {
        let curI = UInt64.from(i);
        result = Provable.if<UInt64>(
          this.players[i].equals(player),
          UInt64,
          curI,
          result,
        );
      }

      return result;
    }

    setReady(index: UInt64): void {
      for (let i = 0; i < PLAYER_AMOUNT; i++) {
        let curI = UInt64.from(i);
        let found = curI.equals(index);
        this.ready[i] = Provable.if(found, this.ready[i].not(), this.ready[i]);

        let addAmount = Provable.if<UInt64>(
          found.and(this.ready[i]),
          UInt64,
          UInt64.from(1),
          UInt64.zero,
        );
        let subAmount = Provable.if<UInt64>(
          found.and(this.ready[i].not()),
          UInt64,
          UInt64.from(1),
          UInt64.zero,
        );

        this.readyAmount = this.readyAmount.add(addAmount).sub(subAmount);
      }
    }
  }

  return LobbyV2;
}
