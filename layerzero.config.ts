import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOApp',
}

const opSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.OPTSEP_V2_TESTNET,
    contractName: 'MyOApp',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: opSepoliaContract,
            /**
             * This config object is optional.
             * The callerBpsCap refers to the maximum fee (in basis points) that the contract can charge.
             */

            // config: {
            //     callerBpsCap: BigInt(300),
            // },
        },
        {
            contract: sepoliaContract,
        },
    ],
    connections: [
        {
            from: sepoliaContract,
            to: opSepoliaContract,
            config: {
                sendLibrary: '0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE',
                receiveLibraryConfig: {
                    // Required Receive Library Address on SrcChain
                    receiveLibrary: '0xdAf00F5eE2158dD58E0d3857851c432E34A3A851',
                    // Optional Grace Period time to wait for Switching New Receive Library Address on SrcChain.
                    gracePeriod: BigInt(0),
                },
                // Optional Receive Library Timeout for when the Old Receive Library Address will no longer be valid on SrcChain
                receiveLibraryTimeoutConfig: {
                    lib: '0xdAf00F5eE2158dD58E0d3857851c432E34A3A851',
                    expiry: BigInt(0),
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 100,
                        executor: '0x718B92b5CB0a5552039B593faF724D182A881eDA',
                    },
                    ulnConfig: {
                        confirmations: BigInt(15),
                        requiredDVNs: ['0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193'], // LZ
                        optionalDVNs: [
                            '0x68802e01d6321d5159208478f297d7007a7516ed',
                            '0xca7a736be0fe968a33af62033b8b36d491f7999b',
                        ],
                        optionalDVNThreshold: 2,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(15),
                        requiredDVNs: ['0xd680ec569f269aa7015f7979b4f1239b5aa4582c'], // LZ
                        optionalDVNs: [
                            '0x2d15d4e61558480a9300632772e68d8b5e7cc7e5',
                            '0x3e9d8fa8067938f2a62baa7114eed183040824ab',
                        ],
                        optionalDVNThreshold: 2,
                    },
                },
            },
        },
        {
            from: opSepoliaContract,
            to: sepoliaContract,
            config: {
                sendLibrary: '0xB31D2cb502E25B30C651842C7C3293c51Fe6d16f',
                receiveLibraryConfig: {
                    // Required Receive Library Address on SrcChain
                    receiveLibrary: '0x9284fd59B95b9143AF0b9795CAC16eb3C723C9Ca',
                    // Optional Grace Period for Switching Receive Library Address on SrcChain
                    gracePeriod: BigInt(0),
                },
                // Optional Receive Library Timeout for when the Old Receive Library Address will no longer be valid on SrcChain
                receiveLibraryTimeoutConfig: {
                    lib: '0x9284fd59B95b9143AF0b9795CAC16eb3C723C9Ca',
                    expiry: BigInt(0),
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 100,
                        executor: '0xDc0D68899405673b932F0DB7f8A49191491A5bcB',
                    },
                    ulnConfig: {
                        confirmations: BigInt(15),
                        requiredDVNs: ['0xd680ec569f269aa7015f7979b4f1239b5aa4582c'], // LZ
                        optionalDVNs: [
                            '0x2d15d4e61558480a9300632772e68d8b5e7cc7e5',
                            '0x3e9d8fa8067938f2a62baa7114eed183040824ab',
                        ],
                        optionalDVNThreshold: 2,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(15),
                        requiredDVNs: ['0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193'], // LZ
                        optionalDVNs: [
                            '0x68802e01d6321d5159208478f297d7007a7516ed',
                            '0xca7a736be0fe968a33af62033b8b36d491f7999b',
                        ],
                        optionalDVNThreshold: 2,
                    },
                },
            },
        },
    ],
}

export default config
