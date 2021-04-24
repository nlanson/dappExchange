# Dapp Exchange
This is a dApp Exchange Application created following [this tutorial](https://www.youtube.com/watch?v=99pYGpTWcXM).

This project is a combination of 2 Smart Contracts that create a new ERC20 Token and create an exchange to distribute the newly created token.

Upto date with tutorial @timestamp 1:27:27.

## Start Developing
1. Install required dependencies as detailed below and run `npm i`.
2. Start a Ganache Blockchain (Quickstart).
3. Deploy smart contracts onto the blockchain with `truffle migrate`
4. Run commands with `truffle console` (exit console with `.exit`)
5. Run automated tests with `truffle test`
6. Edit code and repeat deployment with `--reset` flag

## Dependencies and Resources
- Node.js: https://nodejs.org/en/​
- Ganache: https://www.trufflesuite.com/ganache​
- Truffle: https://www.trufflesuite.com/​ (Installed globally using `npm i truffle -g`)
- Metamask Wallet

RESOURCES
- Starter Kit: https://github.com/dappuniversity/sta...​

## Smart Contracts
Smart contracts live in the `src/contracts` directory and are written in Solidity. They are "deployed" by using the command `truffle migrate` and redeployed using `truffle migrate --reset` when redeploying.\
Deployments can be configured in the file `migrations/2_deploy_contracts.js`, where a Smart Contract is imported and deployed.

The two main smart contracts in this project are the `Token.sol` and `EthSwap.sol`.\
- `Tokens.sol` creates the new ERC20 Token.
- `EthSwap.sol` creates the exchange platform to swap ETH for the new Token.

For testing purposes, the smart contracts are deployed onto an Etheruem testnet created using Ganache (as specified in `truffle-config.js` networks property).

Automated testing of Smart Contracts is dictated in `test/EthSwap.test.js`. This uses the Mocha and Chai testing framework.\
Use `truffle test` to run the tests.

## Frontend UI
Made using React. Not yet configured.