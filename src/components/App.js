import React, { Component } from 'react';
import Navbar from './Navbar';
import './App.css';

import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Web3 from 'web3';

class App extends Component {
  
  //Special function that gets called before a component gets rendered.
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }
  
  //This function connects the app to the blockchain via MetaMask.
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3;
    
    //Request account from MetaMask.
    const accounts = await web3.eth.requestAccounts();
    this.setState({ account: accounts[0] });

    //Get account balance using web3.
    let ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance });

    //Load Token
    const networkID = await web3.eth.net.getId(); //Get the current network ID that metamask is connected to.
    const tokenData = Token.networks[networkID]; //The potential address of the Smart Contract on the Network. 5777 is the Ganache Network ID
    if ( tokenData ) {
      //If the tokenData exists on the given network, load it and save it into state.
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token: token });

      //Get the token balance of the account
      let tokenBalance = await token.methods.balanceOf(this.state.account).call(); //.call() is a web3 method used when getting information off the blockchain without creating a new transaction. Essentially read-only.
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert('Token contract not deployed to connected network.')
    }

    //Load EthSwap
    const ethSwapData = EthSwap.networks[networkID];
    if ( ethSwapData ) {
      //If the EthSwap Contract Data exists on the given network, load it and save it.
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap: ethSwap });
    } else {
      window.alert('EthSwap contract not deployed to connected network.')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: '0',
      token: {},
      tokenBalance: '0',
      ethSwap: {}
    };
  }
  
  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Hello World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
