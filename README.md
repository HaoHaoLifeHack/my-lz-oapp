# LayerZeroV2 Practical Implementation
Please refer the following the contents to check the pratical implementation of LayerZeroV2

## Setup
Set up deployer wallet/account:

Rename `.env.example` -> `.env` 
Choose your preferred wallet:

```
PRIVATE_KEY="0xabc...def"
```
## Initialize
Run following script to initialize

```
node scripts/initilizeOApp.js
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
