import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { PublicKey, UInt64 } from 'o1js';

interface BalancesConfig {}

@runtimeModule()
export class Balances extends RuntimeModule<BalancesConfig> {
    @state() public balances = StateMap.from<PublicKey, UInt64>(
        PublicKey,
        UInt64
    );

    @state() public circulatingSupply = State.from<UInt64>(UInt64);

    @runtimeMethod()
    public addBalance(address: PublicKey, amount: UInt64): void {
        const circulatingSupply = this.circulatingSupply.get();
        const newCirculatingSupply = circulatingSupply.value.add(amount);

        this.circulatingSupply.set(newCirculatingSupply);
        const currentBalance = this.balances.get(address);
        const newBalance = currentBalance.value.add(amount);
        this.balances.set(address, newBalance);
    }

    @runtimeMethod()
    public transferTo(address: PublicKey, amount: UInt64): void {
        let currentBalance = this.balances
            .get(this.transaction.sender)
            .orElse(UInt64.from(0));
        currentBalance.assertGreaterThan(amount);

        let addrCurrentBalance = this.balances
            .get(this.transaction.sender)
            .orElse(UInt64.from(0));

        this.balances.set(this.transaction.sender, currentBalance.sub(amount));
        this.balances.set(address, addrCurrentBalance.add(amount));
    }
}
