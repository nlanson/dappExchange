const EthSwap = artifacts.require("Ethswap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  //Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed(); //Token now refers to the Smart Contract 'Token' which in itself is stored within a wallet.

  //Deploy EthSwap
  await deployer.deploy(EthSwap, token.address);
  const ethswap = await EthSwap.deployed();

  //Transfer all tokens to EthSwap.
  token.transfer(ethswap.address, '1000000000000000000000000');
};
