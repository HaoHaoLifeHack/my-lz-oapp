# LayerZeroV2 Practical Implementation
Please refer the following the contents to check the pratical implementation of LayerZeroV2

## Setup
Install OApp package
```
npm install @layerzerolabs/oapp-evm
```

Set up deployer wallet and your OApp address

- Rename `.env.example` -> `.env` 
- Choose your preferred wallet:
```
PRIVATE_KEY="0xabc...def"
RPC_URL_OPSEP = 'https://opt-sepolia.g.alchemy.com/v2/{YOUR_API_KEY}'
RPC_URL_SEPOLIA = 'https://eth-sepolia.g.alchemy.com/v2/{YOUR_API_KEY}'
```

## Deploy OApp
Deploy your OApp on the chains you want to execute the cross-chain message.
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
In the practice, I will show you how to use the OApp to send a cross-chain message.

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
Press y to send the message and pay the fee
```
Press y to continue...
y
```
Receive the tx receipt
```
Send message successfully: 0x222efe33bce2e9190d1a31b683a2bffe5dc8f4d196a98de8b2c40853a994c15b
```
## X of Y of N Practice
In this practice, I will use the same OApp and configure the Security Stack with 1 of 1 of 3 and Configure 100 as maxMessageSize to send a cross-chain message which list below:

### SendConfig
| Key                   | Value                                                                 |
|-----------------------|----------------------------------------------------------------------|
| `requiredDVNs`        | `0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193`                         |
| `optionalDVNThreshold`| `1`                                                                  |
| `requiredDVNCount`    | `1`                                                                  |
| `optionalDVNCount`    | `2`                                                                  |
| `optionalDVNs`        | `0x68802e01d6321d5159208478f297d7007a7516ed, 0xca7a736be0fe968a33af62033b8b36d491f7999b` |
| `confirmations`       | `15`                                                                 |
| `executor`            | `0x718b92b5cb0a5552039b593faf724d182a881eda`                         |
| `maxMessageSize`      | `100`                                                                |

### ReceiveConfig
| Key                   | Value                                                                 |
|-----------------------|----------------------------------------------------------------------|
| `requiredDVNs`        | `0xd680ec569f269aa7015f7979b4f1239b5aa4582c`                         |
| `optionalDVNThreshold`| `1`                                                                  |
| `requiredDVNCount`    | `1`                                                                  |
| `optionalDVNCount`    | `2`                                                                  |
| `optionalDVNs`        | `0x2d15d4e61558480a9300632772e68d8b5e7cc7e5, 0x3e9d8fa8067938f2a62baa7114eed183040824ab` |
| `confirmations`       | `15`                                                                 |

---
Run following script to configure custom security stack and send a message to check the verifying process

Set custom config
```
node scripts/setLibrary.js
node scripts/setSendConfig.js
node scripts/setReceiveConfig.js
```

Follow the same steps as the last practice to send a message.

Check the security stack was followed the rule developer set on [LayerZeroScan](https://testnet.layerzeroscan.com/) by the tx hash

Run following script to reset the config to default
```
node scripts/resetConfig.js
```



## Message Option Practice
In this practice, I will try different message options to observe how message option affect the msg.value we paid in the send transaction on source chain.

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