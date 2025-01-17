const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");
const { defaultAbiCoder } = require("@ethersproject/abi");
const contractAddress = require('../config/contract.json');

dotenvConfig({ path: "./.env" });

async function setReceiveConfig() {
  // Addresses
  const oappAddress = contractAddress.opSepolia.OApp;
  const receiveLibAddress = contractAddress.opSepolia.ReceiveLib;

  // Configuration
  const remoteEid = contractAddress.sepolia.Eid; //** This eid is source chain eid
  const ulnConfig = {
    confirmations: 15,
    requiredDVNCount: 1,
    optionalDVNCount: 2,
    optionalDVNThreshold: 1,
    requiredDVNs: ["0xd680ec569f269aa7015f7979b4f1239b5aa4582c"], // LZ
    optionalDVNs: ["0x2d15d4e61558480a9300632772e68d8b5e7cc7e5", "0x3e9d8fa8067938f2a62baa7114eed183040824ab"], // Nethermind, BWare
  };

  // Provider and Signer
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_OPSEP);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ABI and Contract
  const endpointAddress = contractAddress.opSepolia.Endpoint;
  const endpointAbi = ["function setConfig(address oappAddress, address receiveLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external"];
  const endpointContract = new ethers.Contract(endpointAddress, endpointAbi, signer);

  // Encode UlnConfig using defaultAbiCoder
  const configTypeUlnStruct = "tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)";
  const encodedUlnConfig = defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig]);

  // Define the SetConfigParam struct
  const setConfigParam = {
    eid: remoteEid,
    configType: 2, // RECEIVE_CONFIG_TYPE
    config: encodedUlnConfig,
  };


  try {
    const tx = await endpointContract.setConfig(
      oappAddress,
      receiveLibAddress,
      [setConfigParam] // This should be an array of SetConfigParam structs
    );

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}


// Send the transaction
setReceiveConfig();
