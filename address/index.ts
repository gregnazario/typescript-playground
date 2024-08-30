import {
    Account,
    AccountAddress,
    type AccountAddressInput,
    createObjectAddress,
    createResourceAddress, type HexInput
} from "@aptos-labs/ts-sdk";

function lookup_resource_account_address(
    publisherAddress: AccountAddressInput,
    resourceAccountSeed: HexInput,
): AccountAddress {
    // Note that resource account seed has had different encodings over time, the default from the cli is `bcs`, which
    // is BCS encoded.  However, if you apply `--seed-encoding utf8` to the cli, then the seed will be utf8 encoded.
    // This matches the `b"my_string"` declarations in Move. Which is the default behavior here.
    return createResourceAddress(AccountAddress.from(publisherAddress), resourceAccountSeed);
}

function lookup_account_object_address(
    creatorAddress: AccountAddressInput,
    objectAccountSeed: HexInput
) {
    return createObjectAddress(AccountAddress.from(creatorAddress), objectAccountSeed);

}

function lookup_resource_account_object_address(
    publisherAddressStr: AccountAddressInput,
    resourceAccountSeed: HexInput,
    objectAccountSeed: HexInput
): AccountAddress {
    const resourceAddress = lookup_resource_account_address(publisherAddressStr, resourceAccountSeed);
    return lookup_account_object_address(resourceAddress, objectAccountSeed);
}

const deployAddress = "0xb11affd5c514bb969e988710ef57813d9556cc1e3fe6dc9aa6a82b56aee53d98"
const FUND_SEED = "fund-seed";
const resourceAddress = lookup_resource_account_address(deployAddress, FUND_SEED)

console.log(`Deployed address: ${deployAddress}`)
console.log(`${FUND_SEED}: Resource account address: ${resourceAddress}`)
console.log(`${FUND_SEED}: Object Address: ${lookup_resource_account_object_address(deployAddress, FUND_SEED, "my-seed").toStringLong()}`)
