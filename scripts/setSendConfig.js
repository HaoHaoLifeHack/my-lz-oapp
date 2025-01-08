const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");
const { defaultAbiCoder } = require("@ethersproject/abi");
const contractAddress = require('../config/contract.json');

dotenvConfig({ path: "./.env" });

async function setSendConfig() {
  // Addresses
  const oappAddress = contractAddress.sepolia.OApp;
  const sendLibAddress = contractAddress.sepolia.SendLib;

  // Configuration
  const remoteEid = contractAddress.opSepolia.Eid; //** This eid is destination chain eid

  const executorConfig = {
    maxMessageSize: 100,
    executorAddress: "0x718B92b5CB0a5552039B593faF724D182A881eDA",
  };

  const ulnConfig = {
    confirmations: 15,
    requiredDVNCount: 1,
    optionalDVNCount: 2,
    optionalDVNThreshold: 1,
    requiredDVNs: ["0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193"],
    optionalDVNs: ["0x68802e01d6321d5159208478f297d7007a7516ed", "0xca7a736be0fe968a33af62033b8b36d491f7999b"],
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
  const encodedUlnConfig = defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig]);

  // Encode ExecutorConfig using defaultAbiCoder
  const configTypeExecutorStruct = "tuple(uint32 maxMessageSize, address executorAddress)";
  const encodedExecutorConfig = defaultAbiCoder.encode([configTypeExecutorStruct], [executorConfig]);

  // Define the SetConfigParam structs
  const setConfigParamExecutor = {
    eid: remoteEid,
    configType: 1, // EXECUTOR_CONFIG_TYPE
    config: encodedExecutorConfig,
  };

  const setConfigParamUln = {
    eid: remoteEid,
    configType: 2, // ULN_CONFIG_TYPE
    config: encodedUlnConfig,
  };

  // Send the transaction
  try {
    const tx = await endpointContract.setConfig(
      oappAddress,
      sendLibAddress,
      [setConfigParamUln, setConfigParamExecutor] // Array of SetConfigParam structs
    );

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

// Execute the function
setSendConfig();