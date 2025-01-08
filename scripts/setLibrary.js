const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");
const contractAddress = require('../config/contract.json');

dotenvConfig({ path: "./.env" });

async function setLibraries(oappAddress, sendLibAddress, receiveLibAddress, endpointContractAddress, rpcUrl, privateKey, remoteEid) {
  // 設置提供者和簽名者
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  // 定義 Endpoint 合約的 ABI
  const endpointAbi = [
    "function setSendLibrary(address oapp, uint32 eid, address sendLib) external",
    "function setReceiveLibrary(address oapp, uint32 eid, address receiveLib) external",
    "function getSendLibrary(address sender, uint32 dstEid) external view returns (address)",
    "function getReceiveLibrary(address receiver, uint32 srcEid) external view returns (address)",
  ];

  // 初始化合約實例
  const endpointContract = new ethers.Contract(endpointContractAddress, endpointAbi, signer);

  try {
    // 檢查並設置 Send Library
    console.log(`Checking current Send Library for OApp: ${oappAddress}...`);
    const currentSendLib = await endpointContract.getSendLibrary(oappAddress, remoteEid);
    if (currentSendLib.toLowerCase() !== sendLibAddress.toLowerCase()) {
      console.log(`Setting Send Library for OApp: ${oappAddress}...`);
      const sendTx = await endpointContract.setSendLibrary(oappAddress, remoteEid, sendLibAddress);
      console.log("Send Library transaction sent:", sendTx.hash);
      await sendTx.wait();
      console.log("Send Library set successfully.");
    } else {
      console.log("Send Library is already set to the correct address. Skipping transaction.");
    }

    // 檢查並設置 Receive Library
    console.log(`Checking current Receive Library for OApp: ${oappAddress}...`);
    const currentReceiveLib = await endpointContract.getReceiveLibrary(oappAddress, remoteEid);
    if (currentReceiveLib.toLowerCase() !== receiveLibAddress.toLowerCase()) {
      console.log(`Setting Receive Library for OApp: ${oappAddress}...`);
      const receiveTx = await endpointContract.setReceiveLibrary(oappAddress, remoteEid, receiveLibAddress);
      console.log("Receive Library transaction sent:", receiveTx.hash);
      await receiveTx.wait();
      console.log("Receive Library set successfully.");
    } else {
      console.log("Receive Library is already set to the correct address. Skipping transaction.");
    }
  } catch (error) {
    console.error("An error occurred while setting libraries:", error);
  }
}

async function main() {
  // 第一個 OApp 的參數
  const oapp1 = {
    oappAddress: contractAddress.sepolia.OApp,
    sendLibAddress: contractAddress.sepolia.SendLib,
    receiveLibAddress: contractAddress.sepolia.ReceiveLib,
    endpointContractAddress: contractAddress.sepolia.Endpoint,
    rpcUrl: process.env.RPC_URL_SEPOLIA,
    privateKey: process.env.PRIVATE_KEY,
    remoteEid: contractAddress.opSepolia.Eid,
  };

  // 第二個 OApp 的參數
  const oapp2 = {
    oappAddress: contractAddress.opSepolia.OApp,
    sendLibAddress: contractAddress.opSepolia.SendLib,
    receiveLibAddress: contractAddress.opSepolia.ReceiveLib,
    endpointContractAddress: contractAddress.opSepolia.Endpoint,
    rpcUrl: process.env.RPC_URL_OPTSEP,
    privateKey: process.env.PRIVATE_KEY,
    remoteEid: contractAddress.sepolia.Eid,
  };

  // 執行第一個 OApp 的設置
  console.log("Processing first OApp...");
  await setLibraries(
    oapp1.oappAddress,
    oapp1.sendLibAddress,
    oapp1.receiveLibAddress,
    oapp1.endpointContractAddress,
    oapp1.rpcUrl,
    oapp1.privateKey,
    oapp1.remoteEid
  );

  // 執行第二個 OApp 的設置
  console.log("\nProcessing second OApp...");
  await setLibraries(
    oapp2.oappAddress,
    oapp2.sendLibAddress,
    oapp2.receiveLibAddress,
    oapp2.endpointContractAddress,
    oapp2.rpcUrl,
    oapp2.privateKey,
    oapp2.remoteEid
  );

  console.log("\nAll libraries set successfully!");
}

main().catch((error) => {
  console.error("Error in script execution:", error);
  process.exit(1);
});
