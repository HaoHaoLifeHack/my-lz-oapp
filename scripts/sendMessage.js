import { ethers } from "ethers";
import { Options } from '@layerzerolabs/lz-v2-utilities'
import readline from "readline";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: "./.env" });

// Create a readline interface to take user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function askQuestion(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
async function sendMessage(message, options) {
    // 設置提供者和簽名者
    const oappAddress = "0x765c923A4e5C90f92b2728a29354B1087c1698f3";
    const remoteEid = 40232;
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 定義 Endpoint 合約的 ABI
    const oappAbi = [
        "function quote(uint32 dstEid, string _message, bytes _options, bool _payInLzToken) external",
        "function send(uint32 dstEid, string _message, bytes _options) external",
        "function peers(uint32 eid) external view returns (bytes32)",
    ];
    // Define OApp contract
    const oappContract = new ethers.Contract(oappAddress, oappAbi, signer);

    try {
        // Check Peer
        //console.log(`Checking remote peer existence for OApp: ${oappAddress}...`);
        //const currentPeer = await oappContract.peers(remoteEid)
        //console.log(`Remote peer exists: ${currentPeer}`)
        const params = [
            remoteEid,
            message,
            options,
            false
        ];
        let result = await oappContract.quote(remoteEid, message, options, false, { gasLimit: ethers.BigNumber.from("200000") });
        console.log(`result: ${result}`);
        console.log(`nativeFee: ${result[0] / 1e18}`);

        let nativeFee = result[0] / 1e18;

        const isProceed = await askQuestion("Press y to continue... ");
        if (isProceed !== "y") {
            return;
        }
        const sendTx = await oappContract.send(remoteEid, message, options,
            {
                value: nativeFee.toString(),
                gasLimit: ethers.BigNumber.from("200000")
            });
        await sendTx.wait();
        console.log("\nSend message successfully!");
        // if (currentPeer !== toHex(0)) {
        //     console.log(`Send Message From OApp: ${oappAddress}...`);
        //     const sendTx = await oappContract.send(remoteEid, message, options);
        //     await sendTx.wait();
        //     console.log("\nSend message successfully!");
        // } else {
        //     console.log("\nRemote peer does not exist. Skipping transaction.");
        // }

    } catch (error) {
        console.error("\nAn error occurred while sending a message: ", error);
    }
}

async function main() {
    const message = await askQuestion("Enter the message to send: ");
    const isDefaultOptions = await askQuestion("Use default options? (y/n): ");
    if (isDefaultOptions === "y") {
        const options = Options.newOptions().addExecutorLzReceiveOption(50000, 0).toHex().toString();
        console
        await sendMessage(message, options);
        return;
    }
    const gas = await askQuestion("Enter message options gas: ");
    const value = await askQuestion("Enter message options value: ");
    const options = Options.newOptions().addExecutorLzReceiveOption(gas, value).toHex().toString();

    console.log("Sending...");
    await sendMessage(message, options);
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exit(1);
});
