const { ethers } = require("ethers");
const { config: dotenvConfig } = require("dotenv");
const { defaultAbiCoder } = require("@ethersproject/abi");
const contractAddress = require('../config/contract.json');

dotenvConfig({ path: "./.env" });

async function setPeer(srcOAppAddr, dstOAppAddr, eid, signer, nonce) {
    const oAppAbi = ["function setPeer(uint32 eid, bytes32 peer) external"];
    const srcOApp = new ethers.Contract(srcOAppAddr, oAppAbi, signer);

    return await srcOApp.setPeer(eid, ethers.utils.zeroPad(dstOAppAddr, 32));
}


async function main() {
    const providerSepolia = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
    const providerOptSep = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_OPTSEP);
    const signerSepolia = new ethers.Wallet(process.env.PRIVATE_KEY, providerSepolia);
    const signerOptSep = new ethers.Wallet(process.env.PRIVATE_KEY, providerOptSep);

    let nonceSepolia = await signerSepolia.getTransactionCount("pending");
    let nonceOptSep = await signerOptSep.getTransactionCount("pending");

    const sepOApp = contractAddress.sepolia.OApp;
    const opSepOApp = contractAddress.opSepolia.OApp;

    const tx1 = await setPeer(sepOApp, opSepOApp, 40232, signerSepolia, nonceSepolia++);
    const tx2 = await setPeer(opSepOApp, sepOApp, 40161, signerOptSep, nonceOptSep++);

    await tx1.wait();
    await tx2.wait();
    console.log(`Peer set successfully for OApp: ${sepOApp} and ${opSepOApp}`);
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exit(1);
});