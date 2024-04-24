/* eslint-disable no-console */

import {
    AccountAddress,
    AccountAddressInput,
    AnyNumber,
    Hex,
    HexInput, MoveOption,
    Serializable,
    Serializer, U32
} from "@aptos-labs/ts-sdk";

/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 * Similar to ./simple_transfer.ts, but uses transferCoinTransaction to generate the transaction.
 */

class Struct extends Serializable {
    constructor(readonly str: string, readonly num: number, readonly option: number | null) {
        super();
    }

    serialize(serializer: Serializer): void {
        serializer.serializeStr(this.str);
        serializer.serializeU32(this.num);
        const option = MoveOption.U32(this.option);
        serializer.serialize(option);
    }
}

enum EnumType {
    U32 = 0,
    String = 1,
}
class Enum extends Serializable {

    constructor(readonly type: number, readonly data: number | string) {
        super();
        switch (this.type) {
            case EnumType.U32:
                if (typeof data !== "number") {
                    throw Error("Not properly typed, should be number")
                }
                break;
            case EnumType.String:
                if (typeof data !== "string") {
                    throw Error("Not properly typed, should be string")
                }
                break;
            default:
                throw new Error("Unsupported type");
        }
    }

    serialize(serializer: Serializer): void {
        // Serialize the enum number
        serializer.serializeU32(this.type);

        // Then serialize the type associated
        switch (this.type) {
            case EnumType.U32:
                serializer.serializeU32(this.data as number);
                break;
            case EnumType.String:
                serializer.serializeStr(this.data as string);
                break;
            default:
                throw new Error("Unsupported type");
        }
    }
}

function serializeU8(num: number): Hex {
    const serializer = new Serializer();
    serializer.serializeU8(num);
    return new Hex(serializer.toUint8Array());
}

function serializeU16(num: number): Hex {
    const serializer = new Serializer();
    serializer.serializeU16(num);
    return new Hex(serializer.toUint8Array());
}

function serializeU32(num: number): Hex {
    const serializer = new Serializer();
    serializer.serializeU32(num);
    return new Hex(serializer.toUint8Array());
}

function serializeU32asUleb(num: number): Hex {
    const serializer = new Serializer();
    serializer.serializeU32AsUleb128(num);
    return new Hex(serializer.toUint8Array());
}

function serializeU64(num: AnyNumber): Hex {
    const serializer = new Serializer();
    serializer.serializeU64(num);
    return new Hex(serializer.toUint8Array());
}

function serializeU128(num: AnyNumber): Hex {
    const serializer = new Serializer();
    serializer.serializeU128(num);
    return new Hex(serializer.toUint8Array());
}

function serializeU256(num: AnyNumber): Hex {
    const serializer = new Serializer();
    serializer.serializeU256(num);
    return new Hex(serializer.toUint8Array());
}

function serializeBool(bool: boolean): Hex {
    const serializer = new Serializer();
    serializer.serializeBool(bool);
    return new Hex(serializer.toUint8Array());
}

function serializeAddress(address: AccountAddressInput): Hex {
    const serializer = new Serializer();
    serializer.serialize(AccountAddress.from(address));
    return new Hex(serializer.toUint8Array());
}

function serializeBytes(hex: HexInput): Hex {
    const serializer = new Serializer();
    serializer.serializeBytes(Hex.fromHexInput(hex).toUint8Array());
    return new Hex(serializer.toUint8Array());
}

function serializeFixedBytes(hex: HexInput): Hex {
    const serializer = new Serializer();
    serializer.serializeFixedBytes(Hex.fromHexInput(hex).toUint8Array());
    return new Hex(serializer.toUint8Array());
}

function serializeString(str: string): Hex {
    const serializer = new Serializer();
    serializer.serializeStr(str);
    return new Hex(serializer.toUint8Array());
}

function serialize<T extends Serializable>(struct: T): Hex {
    const serializer = new Serializer();
    struct.serialize(serializer);
    return new Hex(serializer.toUint8Array());
}

const example = async () => {
    console.log("-----------------");
    console.log("Serialize u8");
    [0, 1, 2 ** 8 - 1].forEach((num) => {
        console.log(`${num}:\t${serializeU8(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize u16");
    [0, 1, 255, 2 ** 16 - 1].forEach((num) => {
        console.log(`${num}:\t${serializeU16(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize u32");
    [0, 1, 255, 2 ** 32 - 1].forEach((num) => {
        console.log(`${num}:\t${serializeU32(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize u64");
    [0, 1, 255, 65535, 2n ** 64n - 1n].forEach((num) => {
        console.log(`${num}:\t${serializeU64(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize u128");
    [0, 1, 255, 65535, 2n ** 128n - 1n].forEach((num) => {
        console.log(`${num}:\t${serializeU128(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize u256");
    [0, 1, 255, 65535, 2n ** 256n - 1n].forEach((num) => {
        console.log(`${num}:\t${serializeU256(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize bool");
    [false, true].forEach((num) => {
        console.log(`${num}:\t${serializeBool(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize address");
    [
        "0x1",
        "0x2",
        "0xDEADFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    ].forEach((num) => {
        console.log(`${num}:\t${serializeAddress(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize string");
    [
        "abcd",
        "hello"
    ].forEach((num) => {
        console.log(`${num}:\t${serializeString(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize bytes");
    [
        "0x123456",
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    ].forEach((num) => {
        console.log(`${num}:\t${serializeBytes(num).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize fixed bytes");
    [
        "0x123456",
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    ].forEach((input) => {
        console.log(`${input}:\t${serializeFixedBytes(input).toStringWithoutPrefix()}`);
    })
    console.log("-----------------");
    console.log("Serialize uleb32");
    [
        0,
        1,
        2,
        3,
        7,
        15,
        31,
        63,
        127,
        255,
        511,
        1023,
        2047,
        4095,
        8191,
        16383,
        32767,
        65535,
    ].forEach((num) => {
        console.log(`${num}:\t${serializeU32asUleb(num).toStringWithoutPrefix()}`);
    });

    console.log("-----------------");
    console.log("Serialize struct");
    [
        new Struct("With option", 1, 1),
        new Struct("Without option", 2, null),
    ].forEach((input) => {
        console.log(`${JSON.stringify(input)}:\t${serialize(input)}`)
    });

    console.log("-----------------");
    console.log("Serialize enum");
    [
        new Enum(EnumType.U32, 22),
        new Enum(EnumType.String, "Hello from space"),
    ].forEach((input) => {
        console.log(`${JSON.stringify(input)}:\t${serialize(input)}`)
    });
};

example();
