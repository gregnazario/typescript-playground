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

/* Output

-----------------
Serialize u8
0:      00
1:      01
255:    ff
-----------------
Serialize u16
0:      0000
1:      0100
255:    ff00
65535:  ffff
-----------------
Serialize u32
0:      00000000
1:      01000000
255:    ff000000
4294967295:     ffffffff
-----------------
Serialize u64
0:      0000000000000000
1:      0100000000000000
255:    ff00000000000000
65535:  ffff000000000000
18446744073709551615:   ffffffffffffffff
-----------------
Serialize u128
0:      00000000000000000000000000000000
1:      01000000000000000000000000000000
255:    ff000000000000000000000000000000
65535:  ffff0000000000000000000000000000
340282366920938463463374607431768211455:        ffffffffffffffffffffffffffffffff
-----------------
Serialize u256
0:      0000000000000000000000000000000000000000000000000000000000000000
1:      0100000000000000000000000000000000000000000000000000000000000000
255:    ff00000000000000000000000000000000000000000000000000000000000000
65535:  ffff000000000000000000000000000000000000000000000000000000000000
115792089237316195423570985008687907853269984665640564039457584007913129639935: ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
-----------------
Serialize bool
false:  00
true:   01
-----------------
Serialize address
0x1:    0000000000000000000000000000000000000000000000000000000000000001
0x2:    0000000000000000000000000000000000000000000000000000000000000002
0xDEADFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:     deadffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:     ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
-----------------
Serialize string
abcd:   0461626364
hello:  0568656c6c6f
-----------------
Serialize bytes
0x123456:       03123456
0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:     2cffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
-----------------
Serialize fixed bytes
0x123456:       123456
0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:     ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
-----------------
Serialize uleb32
0:      00
1:      01
2:      02
3:      03
7:      07
15:     0f
31:     1f
63:     3f
127:    7f
255:    ff01
511:    ff03
1023:   ff07
2047:   ff0f
4095:   ff1f
8191:   ff3f
16383:  ff7f
32767:  ffff01
65535:  ffff03
-----------------
Serialize struct
{"str":"With option","num":1,"option":1}:       0x0b57697468206f7074696f6e010000000101000000
{"str":"Without option","num":2,"option":null}: 0x0e576974686f7574206f7074696f6e0200000000
-----------------
Serialize enum
{"type":0,"data":22}:   0x0000000016000000
{"type":1,"data":"Hello from space"}:   0x010000001048656c6c6f2066726f6d207370616365

 */