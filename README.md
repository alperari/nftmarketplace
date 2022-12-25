# NFT Marketplace Web3 Application

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- Truffle & Genache (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install Genache
- Install Truffle

## Versions

Type to versions you use:

```
truffle version
```

Versions used in this project:

- Truffle v5.7.1 (core: 5.7.1)
- Ganache v7.6.0
- Solidity - 0.8.4 (solc-js)
- Node v16.13.2
- Web3.js v1.8.1

## Compile

```
truffle compile
```

## Migrate

Deploy contract on a specific network:

```
truffle migrate --network <NETWORK_NAME>
```

Or deploy on all networks determined on `truffle-config.js`:

```
truffle migrate --reset
```
