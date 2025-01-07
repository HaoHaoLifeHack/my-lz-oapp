# LayerZeroV2 Practical Implementation
## Setup

Set up deployer wallet/account:

Rename `.env.example` -> `.env` 
Choose your preferred wallet:

```
PRIVATE_KEY="0xabc...def"
```
## Initialize
Run following cmd to initialize

```
node scripts/initilizeOApp.js
```

## Send Messaging Practice
Input a message you want to send, and choose default option.

```
node scripts/sendMessage.js
```

```
Enter the message to send: MyMessage
Use default options? (y/n): y
```

## X of Y of N Practice

Config custom security stack
```
node scripts/setLibrary.js
node scripts/setSendConfig.js
node scripts/setReceiveConfig.js
```

Send an message to check the verification process
```
node scripts/sendMessage.js
Use default options? (y/n): y
```

## Message Option Practice
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