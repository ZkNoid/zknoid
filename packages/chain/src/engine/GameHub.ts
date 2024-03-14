import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import type { Proof } from 'o1js';
import { UInt64, PublicKey, Provable, Bool } from 'o1js';
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';
import { inject } from 'tsyringe';
import {
  Competition,
  GameRecordKey,
  LeaderboardIndex,
  LeaderboardScore,
} from '../arkanoid/types';
import { Balances } from '../framework/balances';

export interface IScoreable {
  score: UInt64;
}

@runtimeModule()
export class Gamehub<
  PublicInput,
  PublicOutput extends IScoreable,
  GameProof extends Proof<PublicInput, PublicOutput>,
> extends RuntimeModule<unknown> {
  // CompetitionId -> competition
  @state() public competitions = StateMap.from<UInt64, Competition>(
    UInt64,
    Competition,
  );
  @state() public lastCompetitonId = State.from<UInt64>(UInt64);

  /// compettitionId + User => Record
  @state() public gameRecords = StateMap.from<GameRecordKey, UInt64>(
    GameRecordKey,
    UInt64,
  );

  /// competitionId + User => isRegistered
  @state() public registrations = StateMap.from<GameRecordKey, Bool>(
    GameRecordKey,
    Bool,
  );
  /// (competitionId, Unsorted index) => user result
  @state() public leaderboard = StateMap.from<
    LeaderboardIndex,
    LeaderboardScore
  >(LeaderboardIndex, LeaderboardScore);
  @state() public seeds = StateMap.from<UInt64, UInt64>(UInt64, UInt64);
  @state() public lastSeed = State.from<UInt64>(UInt64);
  @state() public lastUpdate = State.from<UInt64>(UInt64);

  @state() public gotReward = StateMap.from<GameRecordKey, Bool>(
    GameRecordKey,
    Bool,
  );

  public leaderboardSize = 10;

  public constructor(@inject('Balances') private balances: Balances) {
    super();
  }

  @runtimeMethod()
  public updateSeed(seed: UInt64): void {
    const lastSeedIndex = this.lastSeed.get().orElse(UInt64.from(0));
    this.seeds.set(lastSeedIndex, seed);
    this.lastSeed.set(lastSeedIndex.add(1));
  }

  /**
   * Creates new game competition
   *
   * @param competition - Competition to create
   */
  @runtimeMethod()
  public createCompetition(competition: Competition): void {
    this.competitions.set(
      this.lastCompetitonId.get().orElse(UInt64.from(0)),
      competition,
    );
    this.lastCompetitonId.set(
      this.lastCompetitonId.get().orElse(UInt64.from(0)).add(1),
    );

    this.balances.transferTo(
      PublicKey.empty(),
      ProtoUInt64.from(competition.funds),
    );
  }

  @runtimeMethod()
  public register(competitionId: UInt64): void {
    this.registrations.set(
      new GameRecordKey({
        competitionId,
        player: this.transaction.sender.value,
      }),
      Bool(true),
    );

    this.payCompetitionFee(competitionId, Bool(true));
  }

  /**
   * Adds game record to a competition
   *
   * @param competitionId - Competition id to add record to
   * @param newScore - Score to be added
   */
  @runtimeMethod()
  public addGameResult(
    competitionId: UInt64,
    gameRecordProof: GameProof,
  ): void {
    gameRecordProof.verify();

    const gameKey = new GameRecordKey({
      competitionId,
      player: this.transaction.sender.value,
    });

    // Check for registration
    const registrationNeeded =
      this.competitions.get(competitionId).value.prereg;
    const userRegistration = this.registrations.get(gameKey).value;

    assert(registrationNeeded.not().or(userRegistration));

    this.payCompetitionFee(competitionId, registrationNeeded.not());

    const currentScore = this.gameRecords.get(gameKey).value;
    const newScore = gameRecordProof.publicOutput.score;

    if (currentScore < newScore) {
      // Do we need provable here?
      this.gameRecords.set(gameKey, newScore);

      let looserIndex = UInt64.from(0);
      let looserScore = UInt64.from(0);

      for (let i = 0; i < this.leaderboardSize; i++) {
        const leaderboardKey = new LeaderboardIndex({
          competitionId,
          index: UInt64.from(i),
        });
        const gameRecord = this.leaderboard.get(leaderboardKey);

        const result = gameRecord.orElse(
          new LeaderboardScore({
            score: UInt64.from(0),
            player: PublicKey.empty(),
          }),
        );

        looserIndex = Provable.if(
          result.score.lessThan(looserScore),
          UInt64.from(i),
          looserIndex,
        );
        looserScore = Provable.if(
          result.score.lessThan(looserScore),
          UInt64.from(i),
          looserScore,
        );
      }

      const looserKey = new LeaderboardIndex({
        competitionId,
        index: looserIndex,
      });

      this.leaderboard.set(
        looserKey,
        new LeaderboardScore({
          score: newScore,
          player: this.transaction.sender.value,
        }),
      );
    }
  }

  /// #TODO change to multiple receivers
  /// #TODO add timestamp check, when timestamp will be on protokit
  @runtimeMethod()
  public getReward(competitionId: UInt64): void {
    let competition = this.competitions.get(competitionId).value;

    let key = new GameRecordKey({
      competitionId,
      player: this.transaction.sender.value,
    });

    assert(this.gotReward.get(key).value);
    this.gotReward.set(key, Bool(true));

    let winner = this.leaderboard.get(
      new LeaderboardIndex({
        competitionId,
        index: UInt64.zero,
      }),
    ).value;

    assert(winner.player.equals(this.transaction.sender.value));

    this.balances.addBalance(
      this.transaction.sender.value,
      ProtoUInt64.from(competition.funds),
    );
  }

  private payCompetitionFee(competitionId: UInt64, shouldPay: Bool): void {
    let competition = this.competitions.get(competitionId).value;
    let fee = Provable.if(shouldPay, competition.participationFee, UInt64.zero);

    this.balances.transferTo(PublicKey.empty(), ProtoUInt64.from(fee));
    competition.funds = competition.funds.add(fee);
    this.competitions.set(competitionId, competition);
  }
}
