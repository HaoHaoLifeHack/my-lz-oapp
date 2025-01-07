const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");
const { defaultAbiCoder } = require("@ethersproject/abi");

dotenvConfig({ path: "./.env" });

async function resetSendConfig(nonce) {
  // Addresses
  const oappAddress = "0x36C89EA9BdB76Dd24446f57Ce1b9B05C70010c96";
  const sendLibAddress = "0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE";

  // Configuration
  const remoteEid = 40232; // Destination chain eid

  // Reset configurations
  const resetUlnConfig = {
    confirmations: 0,
    requiredDVNCount: 0,
    optionalDVNCount: 0,
    optionalDVNThreshold: 0,
    requiredDVNs: [],
    optionalDVNs: [],
  };

  const resetExecutorConfig = {
    maxMessageSize: 0,
    executorAddress: ethers.constants.AddressZero, // Null equivalent for address
  };

  // Provider and Signer
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ABI and Contract
  const endpointAddress = "0x6EDCE65403992e310A62460808c4b910D972f10f";
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
      { nonce }
    );

    console.log("Reset transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Reset transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Reset transaction failed:", error);
  }
}

async function setSendConfig() {
  // Addresses
  const oappAddress = "0x6AcF77bCd5790AB6E4798855225A7Bb8044e888c";
  const sendLibAddress = "0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE";

  // Configuration
  const remoteEid = 40232; //** This eid is destination chain eid
  const ulnConfig = {
    confirmations: 15,
    requiredDVNCount: 1,
    optionalDVNCount: 2,
    optionalDVNThreshold: 1,
    requiredDVNs: ["0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193"],
    optionalDVNs: ["0x68802e01d6321d5159208478f297d7007a7516ed", "0xca7a736be0fe968a33af62033b8b36d491f7999b"],
  };

  const executorConfig = {
    maxMessageSize: 100,
    executorAddress: "0x718B92b5CB0a5552039B593faF724D182A881eDA",
  };

  // Provider and Signer
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ABI and Contract
  const endpointAddress = "0x6EDCE65403992e310A62460808c4b910D972f10f";
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

module.exports = { resetSendConfig, setSendConfig };