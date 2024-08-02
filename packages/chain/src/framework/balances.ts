import {
  UInt64,
  Balances as BaseBalances,
  TokenId,
  Balance,
} from '@proto-kit/library';
import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { PublicKey } from 'o1js';

interface BalancesConfig {}

@runtimeModule()
export class Balances extends BaseBalances<BalancesConfig> {
  @runtimeMethod()
  public async addBalance(
    tokenId: TokenId,
    address: PublicKey,
    amount: Balance,
  ): Promise<void> {
    await this.mint(tokenId, address, amount);
  }
  @runtimeMethod()
  public async burnBalance(
    tokenId: TokenId,
    amount: Balance,
  ): Promise<void> {
    await this.burn(tokenId, this.transaction.sender.value, amount);
  }
}

/*
@runtimeModule()
export class OldBalances extends RuntimeModule<BalancesConfig> {
  @state() public balances = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64,
  );

  @state() public circulatingSupply = State.from<UInt64>(UInt64);

  // Security issues: unprotected mint. Use for testing purpose only
  @runtimeMethod()
  public addBalance(address: PublicKey, amount: UInt64): void {
    const circulatingSupply = UInt64.from(this.circulatingSupply.get().value);
    const newCirculatingSupply = circulatingSupply.add(amount);

    this.circulatingSupply.set(newCirculatingSupply);
    const currentBalance = UInt64.from(this.balances.get(address).value);
    const newBalance = currentBalance.add(amount);
    this.balances.set(address, newBalance);
  }

  // Security issues: this.transaction.sender is not updating when calling from another contract
  //      so it it this.transaction.sender == tx.origin
  @runtimeMethod()
  public transferTo(address: PublicKey, amount: UInt64): void {
    let currentBalance = UInt64.from(
      this.balances.get(this.transaction.sender.value).orElse(UInt64.from(0)),
    );

    assert(currentBalance.greaterThanOrEqual(amount));

    let addrCurrentBalance = UInt64.from(
      this.balances.get(address).orElse(UInt64.from(0)),
    );

    this.balances.set(
      this.transaction.sender.value,
      currentBalance.sub(amount),
    );
    this.balances.set(address, addrCurrentBalance.add(amount));
  }
}

*/
