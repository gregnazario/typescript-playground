/* eslint-disable no-console */

/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */

import {
    Account,
    AccountAddress,
    Aptos,
    APTOS_COIN,
    AptosConfig,
    EntryFunctionABI,
    Network,
    NetworkToNetworkName,
    parseTypeTag,
    SimpleTransaction,
    TypeTagAddress,
    TypeTagU64,
    U64,
} from "@aptos-labs/ts-sdk";

const APTOS_COIN_TYPE = parseTypeTag(APTOS_COIN);
const COIN_STORE = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
const ALICE_INITIAL_BALANCE = 100_000_000;
const BOB_INITIAL_BALANCE = 100;
const TRANSFER_AMOUNT = 100;

// Default to devnet, but allow for overriding
const APTOS_NETWORK: Network = NetworkToNetworkName[process.env.APTOS_NETWORK] || Network.MAINNET;

async function timeSubmission(
    aptos: Aptos,
    signer: Account,
    buildTxn: () => Promise<SimpleTransaction>,
): Promise<[number, number, number, number]> {
    const start = performance.now();
    const rawTxn = await buildTxn();
    const buildTime = performance.now();
    const senderAuthenticator = await aptos.sign({signer, transaction: rawTxn});
    const signTime = performance.now();
    const submittedTxn = await aptos.transaction.submit.simple({transaction: rawTxn, senderAuthenticator});
    const submitTime = performance.now();
    await aptos.waitForTransaction({transactionHash: submittedTxn.hash});
    const endTime = performance.now();
    const builtLatency = buildTime - start;
    const signLatency = signTime - buildTime;
    const submitLatency = submitTime - signTime;
    const e2eLatency = endTime - start;

    console.log(
        `Time for building: ${builtLatency}ms | signing ${signLatency}ms submission: ${submitLatency}ms | total E2E: ${e2eLatency}ms`,
    );
    return [builtLatency, signLatency, submitLatency, e2eLatency];
}

const example = async () => {
    console.log("This example will show you how to increase performance of known entry functions");
    const starting = performance.now();
    // Setup the client
    const config = new AptosConfig({network: APTOS_NETWORK});
    const aptos = new Aptos(config);

    // Create two accounts
    const alice = Account.generate();
    const bob = Account.generate();

    console.log("=== Addresses ===\n");
    console.log(`Alice's address is: ${alice.accountAddress}`);
    console.log(`Bob's address is: ${bob.accountAddress}`);

    // Fund the accounts
    console.log("\n=== Funding accounts ===\n");


    const setup = performance.now();
    console.log(`Time to setup ${setup}ms`);
    console.log("\n=== Local ABI, BCS inputs, sequence number already cached ===\n");
    const before = performance.now();
    let sequenceNumber = 0n;
    const after = performance.now();
    console.log(`Time to fetch sequence number ${after - before}ms`);
    console.log("\n=== Local ABI, BCS inputs, sequence number and gas already cached ===\n");

    let values = [];
    const transferAbi: EntryFunctionABI = {
        typeParameters: [],
        parameters: [new TypeTagAddress(), new TypeTagU64()],
    };


    const one = new U64(1);

    for (let i = 0; i < 100; i = i + 1) {
        const startTime = performance.now();
        const transaction = await aptos.transaction.build.simple({
            sender: alice.accountAddress,
            data: {
                function: "0x1::aptos_account::transfer",
                typeArguments: [],
                functionArguments: [bob.accountAddress, one],
                abi: transferAbi,
            },
            options: {
                accountSequenceNumber: 0,
                gasUnitPrice: 100,
                maxGasAmount: 1000,
            },
        });

        const buildTime = performance.now();
        let time = buildTime - startTime;
        values.push(time);
        sequenceNumber +=1n;
    }

    let total =0;
    let min = 100000000000000;
    let max = 0;
    values.forEach((num) => {
        if (num > max) {
            max = num;
        }
        if (num < min) {
            min = num;
        }
        total += num;
    });
    const average = total / values.length;

    console.log(`MIN: ${min}ms MAX: ${max}ms AVERAGE: ${average}ms`)
    console.log(`VALUES: ${values}`)
};

example();
