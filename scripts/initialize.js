const { ethers } = require("ethers");
const { resetSendConfig } = require("./setSendConfig");
const { resetReceiveConfig } = require("./setReceiveConfig");

const { config: dotenvConfig } = require("dotenv");
const { sep } = require("path");

dotenvConfig({ path: "./.env" });

async function setPeer(srcOAppAddr, dstOAppAddr, eid, signer, nonce) {
    const oAppAbi = ["function setPeer(uint32 eid, bytes32 peer) external"];
    const srcOApp = new ethers.Contract(srcOAppAddr, oAppAbi, signer);

    return await srcOApp.setPeer(eid, ethers.utils.zeroPad(dstOAppAddr, 32), { nonce });
}

async function main() {
    const providerSepolia = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
    const providerOptSep = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_OPTSEP);
    const signerSepolia = new ethers.Wallet(process.env.PRIVATE_KEY, providerSepolia);
    const signerOptSep = new ethers.Wallet(process.env.PRIVATE_KEY, providerOptSep);

    let nonceSepolia1 = await signerSepolia.getTransactionCount("pending");
    let nonceOptSep1 = await signerOptSep.getTransactionCount("pending");

    const sepOApp = "0x36C89EA9BdB76Dd24446f57Ce1b9B05C70010c96";
    const opSepOApp = "0xB2fddcD4114AA1022Ae47ffeF6Efd4f9C105Ab31";

    const tx1 = await setPeer(sepOApp, opSepOApp, 40232, signerSepolia, nonceSepolia1++);
    const tx2 = await setPeer(opSepOApp, sepOApp, 40161, signerOptSep, nonceOptSep1++);

    console.log(`nonceSepolia1: ${nonceSepolia1}, nonceOptSep1: ${nonceOptSep1}`);
    const receipt1 = await tx1.wait();
    const receipt2 = await tx2.wait();

    console.log("Peer set successfully");

    let nonceSepolia2 = await signerSepolia.getTransactionCount("pending");
    let nonceOptSep2 = await signerOptSep.getTransactionCount("pending");
    console.log(`nonceSepolia2: ${nonceSepolia2}, nonceOptSep2: ${nonceOptSep2}`);

    const tx3 = await resetSendConfig(nonceSepolia2++);
    const tx4 = await resetReceiveConfig(nonceOptSep2++);

    const receipt3 = await tx3.wait();
    const receipt4 = await tx4.wait();

    console.log("Successfully initialized");
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exit(1);
});
