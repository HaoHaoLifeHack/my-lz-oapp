# LayerZeroV2 Practical Implementation
Please refer the following the contents to check the pratical implementation of LayerZeroV2

## Setup
Install OApp package
```
npm install @layerzerolabs/oapp-evm
```

Set up deployer wallet and your OApp address

Rename `.env.example` -> `.env` 
Choose your preferred wallet:
```
PRIVATE_KEY="0xabc...def"
RPC_URL_OPTSEP = 'https://opt-sepolia.g.alchemy.com/v2/{YOUR_API_KEY}'
RPC_URL_SEPOLIA = 'https://eth-sepolia.g.alchemy.com/v2/{YOUR_API_KEY}'
```

## Deploy OApp
Deploy the OApp
```
npx hardhat lz:deploy
```

Choose the network to deploy
```
info:    Compiling your hardhat project
Nothing to compile
? Which networks would you like to deploy? ›  
Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
 
Filtered results for: Enter something to filter

◉  op-sep-testnet
◉  sepolia-testnet
```

Use MyOApp deploy script
```
? Which deploy script tags would you like to use? › MyOApp
```

Continue the deployment
```
info:    Will deploy 2 networks: op-sep-testnet, sepolia-testnet
info:    Will use deploy scripts tagged with MyOApp
? Do you want to continue? › (Y/n)
✔ Do you want to continue? … yes

Network: sepolia-testnet
Deployer: 0x075Ac148738e315E0F8DF30142A332730E4f39BB
Network: op-sep-testnet
Deployer: 0x075Ac148738e315E0F8DF30142A332730E4f39BB
Deployed contract: MyOApp, network: sepolia-testnet, address: 0x36C89EA9BdB76Dd24446f57Ce1b9B05C70010c96
Deployed contract: MyOApp, network: op-sep-testnet, address: 0xB2fddcD4114AA1022Ae47ffeF6Efd4f9C105Ab31
info:    ✓ Your contracts are now deployed
```

Replace the OApp address with your OApp address in `config\contract.json` 
```
{
  "sepolia": {
    "OApp": "0x36C89EA9BdB76Dd24446f57Ce1b9B05C70010c96",
    ...
  },
  "opSepolia": {
    "OApp": "0xB2fddcD4114AA1022Ae47ffeF6Efd4f9C105Ab31",
    ...
  }
}

```
## Initialize
Run following script to initialize the OApp

```
node scripts/initialize.js
```

## Send Messaging Practice
Run following script to send message
```
node scripts/sendMessage.js
```

Input a message you want to send, and choose default option
```
Enter the message to send: MyMessage
Use default options? (y/n): y
```
Check the estimated gas fee
```
Native Fee (wei): 59522528203431
Native Fee (ETH): 0.000059522528203431
```
Press y to continue the tx
```
Press y to continue...
y
```
Receive the tx receipt
```
Send message successfully: 0x222efe33bce2e9190d1a31b683a2bffe5dc8f4d196a98de8b2c40853a994c15b
```
## X of Y of N Practice
Run following script to configure custom security stack and send a message to check the verifying process

Set custom config
```
node scripts/setLibrary.js
node scripts/setSendConfig.js
node scripts/setReceiveConfig.js
```

Send a message (Same as last practice)

Check the security stack was followed the rule developer set on [LayerZeroScan](https://testnet.layerzeroscan.com/) by the tx hash

Reset the default config
```
node scripts/resetConfig.js
```
## Message Option Practice
Send a message with non-default message option to refine the lowest the gas which the parameters include: 
- gas: The gas limit for executor to execute the `lzReceive` on desitination chain

- value: The native token value you want to send to the destination chain when the executor call the `lzReceive` on desitination chain

Run following script to send message
```
node scripts/sendMessage.js
```

```
Enter the message to send: MyMessage
Use default options? (y/n): n
```
Case 1
```
Enter message options gas: 50000
Enter message options value: 0
```
Case 2
```
Enter message options gas: 10000
Enter message options value: 0
```
Case 3
```
Enter message options gas: 1
Enter message options value: 0
```

Observe the gas fee and optimize the minimal gas cost for execute the lzReceive on destination chain
```
Native Fee (wei): 65322063470683
Native Fee (ETH): 0.000065322063470683
```