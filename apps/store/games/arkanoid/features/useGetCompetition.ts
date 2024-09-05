import { Field, PublicKey, UInt64 } from 'o1js';
import { fromContractCompetition } from '@/lib/typesConverter';
import { Bricks, createBricksBySeed } from 'zknoid-chain-dev';
import { ClientAppChain } from '@proto-kit/sdk';
import { useContext } from 'react';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { ICompetition } from '@/lib/types';
import { arkanoidConfig } from '../config';

export const useGetCompetition = (
  competitionId: number,
  setCompetition: (competition: ICompetition) => void,
  setLevel: (level: Bricks) => void
) => {
  const { client } = useContext(ZkNoidGameContext);
  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const client_ = client as ClientAppChain<
    typeof arkanoidConfig.runtimeModules,
    any,
    any,
    any
  >;

  return async () => {
    if (isNaN(competitionId)) {
      console.log(
        `Can't load level. competitionId is not a number. Loading default level`
      );
      return;
    }
    let contractCompetition =
      await client_.query.runtime.ArkanoidGameHub.competitions.get(
        UInt64.from(competitionId)
      );
    if (contractCompetition === undefined) {
      console.log(`Can't get competition with id <${competitionId}>`);
      return;
    }

    let creator =
      (await client_.query.runtime.ArkanoidGameHub.competitionCreator.get(
        UInt64.from(competitionId)
      )) as PublicKey;

    let competition = fromContractCompetition(
      competitionId,
      contractCompetition as any
    );
    // @ts-ignore
    competition.creator = creator;

    let bricks = createBricksBySeed(Field.from(competition!.seed));

    setCompetition(competition);
    setLevel(bricks);
  };
};
