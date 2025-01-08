const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");
const { defaultAbiCoder } = require("@ethersproject/abi");
const contractAddress = require('../config/contract.json');

dotenvConfig({ path: "./.env" });

async function resetSendConfig(nonce) {
    // Addresses
    const sepOApp = contractAddress.sepolia.OApp;
    const opSepOApp = contractAddress.opSepolia.OApp;

    const oappAddress = contractAddress.sepolia.OApp;
    const sendLibAddress = contractAddress.sepolia.SendLib;

    // Configuration
    const remoteEid = 40232; // Destination chain eid

    // Reset configurations
    const resetExecutorConfig = {
        maxMessageSize: 0,
        executorAddress: ethers.constants.AddressZero, // Null equivalent for address
    };

    const resetUlnConfig = {
        confirmations: 0,
        requiredDVNCount: 0,
        optionalDVNCount: 0,
        optionalDVNThreshold: 0,
        requiredDVNs: [],
        optionalDVNs: [],
    };

    // Provider and Signer
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // ABI and Contract
    const endpointAddress = contractAddress.sepolia.Endpoint;
    const endpointAbi = ["function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external"];
    const endpointContract = new ethers.Contract(endpointAddress, endpointAbi, signer);

    // Encode UlnConfig using defaultAbiCoder
    const configTypeUlnStruct = "tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)";
    const encodedResetUlnConfig = defaultAbiCoder.encode([configTypeUlnStruct], [resetUlnConfig]);

    // Encode ExecutorConfig using defaultAbiCoder
    const configTypeExecutorStruct = "tuple(uint32 maxMessageSize, address executorAddress)";
    const encodedResetExecutorConfig = defaultAbiCoder.encode([configTypeExecutorStruct], [resetExecutorConfig]);

    // Define the SetConfigParam structs
    const resetConfigParamExecutor = {
        eid: remoteEid,
        configType: 1, // EXECUTOR_CONFIG_TYPE
        config: encodedResetExecutorConfig,
    };

    const resetConfigParamUln = {
        eid: remoteEid,
        configType: 2, // ULN_CONFIG_TYPE
        config: encodedResetUlnConfig,
    };

    // Send the transaction
    try {
        const tx = await endpointContract.setConfig(
            oappAddress,
            sendLibAddress,
            [resetConfigParamUln, resetConfigParamExecutor], // Array of SetConfigParam structs for reset
        );

        console.log("Reset transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Reset transaction confirmed:", receipt.transactionHash);
    } catch (error) {
        console.error("Reset transaction failed:", error);
    }
}

async function resetReceiveConfig(nonce) {
    // Addresses
    const oappAddress = contractAddress.opSepolia.OApp;
    const receiveLibAddress = contractAddress.opSepolia.ReceiveLib;

    // Configuration
    const remoteEid = 40161; // Source chain eid

    // Reset ULN Configurations
    const resetUlnConfig = {
        confirmations: 0,
        requiredDVNCount: 0,
        optionalDVNCount: 0,
        optionalDVNThreshold: 0,
        requiredDVNs: [],
        optionalDVNs: [],
    };

    // Provider and Signer
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_OPTSEP);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // ABI and Contract
    const endpointAddress = contractAddress.opSepolia.Endpoint;;
    const endpointAbi = ["function setConfig(address oappAddress, address receiveLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external"];
    const endpointContract = new ethers.Contract(endpointAddress, endpointAbi, signer);

    // Encode Reset ULN Config using defaultAbiCoder
    const configTypeUlnStruct = "tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)";
    const encodedResetUlnConfig = defaultAbiCoder.encode([configTypeUlnStruct], [resetUlnConfig]);

    // Define the SetConfigParam struct
    const resetConfigParam = {
        eid: remoteEid,
        configType: 2, // RECEIVE_CONFIG_TYPE
        config: encodedResetUlnConfig,
    };

    try {
        const tx = await endpointContract.setConfig(
            oappAddress,
            receiveLibAddress,
            [resetConfigParam], // This should be an array of SetConfigParam structs for reset
        );

        console.log("Reset transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Reset transaction confirmed:", receipt.transactionHash);
    } catch (error) {
        console.error("Reset transaction failed:", error);
    }
}

async function main() {
    const providerSepolia = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
    const providerOptSep = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_OPTSEP);
    const signerSepolia = new ethers.Wallet(process.env.PRIVATE_KEY, providerSepolia);
    const signerOptSep = new ethers.Wallet(process.env.PRIVATE_KEY, providerOptSep);

    let nonceSepolia = await signerSepolia.getTransactionCount("pending");
    let nonceOptSep = await signerOptSep.getTransactionCount("pending");

    await resetSendConfig(nonceSepolia++);
    await resetReceiveConfig(nonceOptSep++);

    console.log("Successfully Reset the configs");
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exit(1);
});


