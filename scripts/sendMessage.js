const ethers = require("ethers");
const { Options } = require("@layerzerolabs/lz-v2-utilities");
const readline = require("readline");
const { config: dotenvConfig } = require("dotenv");

dotenvConfig({ path: "./.env" });

// Create a readline interface to take user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
async function sendMessage(message, options) {
    // 設置提供者和簽名者
    const oappAddress = "0x36C89EA9BdB76Dd24446f57Ce1b9B05C70010c96";
    const remoteEid = 40232;
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 定義 Endpoint 合約的 ABI
    const oappAbi = [
        "function quote(uint32 dstEid, string _message, bytes _options, bool _payInLzToken) view external returns (tuple(uint256 nativeFee, uint256 lzTokenFee))",
        "function send(uint32 dstEid, string _message, bytes _options) external payable",
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

        // Call the quote function
        const estimatedGas = await oappContract.quote(remoteEid, message, options, false);

        // Access the properties of the returned struct
        const nativeFee = estimatedGas.nativeFee; // Accessing the nativeFee property
        const lzTokenFee = estimatedGas.lzTokenFee; // Accessing the lzTokenFee property

        console.log(`Native Fee (wei): ${nativeFee.toString()}`);
        console.log(`Native Fee (ETH): ${ethers.utils.formatEther(nativeFee)}`);

        const isProceed = await askQuestion("Press y to continue...\n");
        if (isProceed !== "y") {
            console.log("Exiting script...");
            rl.close();
            process.exit(); // End the Node.js process
        }
        rl.close();
        const sendTx = await oappContract.send(remoteEid, message, options, { value: nativeFee });
        await sendTx.wait();
        console.log("\nSend message successfully: ", sendTx.hash);

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
        rl.close();
    }
}

async function main() {
    const message = await askQuestion("Enter the message to send: ");
    const isDefaultOptions = await askQuestion("Use default options? (y/n): ");
    if (isDefaultOptions === "y") {
        const options = Options.newOptions().addExecutorLzReceiveOption(50000, 0).toHex().toString();
        console
        await sendMessage(message, options);
        rl.close();
        process.exit();
    }
    else if (isDefaultOptions === "n") {
        const gas = await askQuestion("Enter message options gas: ");
        const value = await askQuestion("Enter message options value: ");
        const options = Options.newOptions().addExecutorLzReceiveOption(gas, value).toHex().toString();
        console.log("Sending...");
        await sendMessage(message, options);
        rl.close();
        process.exit();
    }
    else {
        console.log("Invalid input. Please enter 'y' or 'n'.");
        main();
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    rl.close();
    process.exit(1);
});
