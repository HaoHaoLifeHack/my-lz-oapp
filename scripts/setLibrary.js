const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");

dotenvConfig({ path: "./.env" });

async function setLibraries(oappAddress, sendLibAddress, receiveLibAddress, endpointContractAddress, rpcUrl, privateKey, remoteEid) {
  // 設置提供者和簽名者
  const provider = new ethers.JsonRpcProvider(rpcUrl);
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
    oappAddress: "0x6AcF77bCd5790AB6E4798855225A7Bb8044e888c",
    sendLibAddress: "0xcc1ae8cf5d3904cef3360a9532b477529b177cce",
    receiveLibAddress: "0xdAf00F5eE2158dD58E0d3857851c432E34A3A851",
    endpointContractAddress: "0x6EDCE65403992e310A62460808c4b910D972f10f",
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    privateKey: process.env.PRIVATE_KEY,
    remoteEid: 40232,
  };

  // 第二個 OApp 的參數
  const oapp2 = {
    oappAddress: "0x0E2385a2308f072b1Eb0437C6D9db80572ABcD1C",
    sendLibAddress: "0xB31D2cb502E25B30C651842C7C3293c51Fe6d16f",
    receiveLibAddress: "0x9284fd59B95b9143AF0b9795CAC16eb3C723C9Ca",
    endpointContractAddress: "0x6EDCE65403992e310A62460808c4b910D972f10f",
    rpcUrl: process.env.OP_SEPOLIA_RPC_URL,
    privateKey: process.env.PRIVATE_KEY,
    remoteEid: 40161,
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
