import React, { Component } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Web3 from 'web3';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: '0',
      token: {},
      tokenBalance: '0',
      ethSwap: {},
      loading: true
    };
  }
  
  //Special function that gets called before a component gets rendered. Basically ngOnInit
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }
  
  //This function connects the app to the blockchain via MetaMask. (IMPORTANT)
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

  //Loads the Ether data of the user and Smart contracts of Swap and Token (IMPORTANT)
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

    this.setState({ loading: false });
  
  } //End load block chain

  //This function takes in an Ether Amount and sends it to the Token Smart contract to buy. (IMPORTANT)
  buyTokens = (etherAmount) => {
    //Set loading to true
    this.setState({ loading: true });

    //Buy the tokens using EthSwap contract buyTokens() method. (No params because the method uses the "value" of .send() below.)
    this.state.ethSwap.methods.buyTokens()
    .send({ value: etherAmount, from: this.state.account }) //Uses .send() as it is creating a new transaction. Value is the ether amount to transfer,
    .on('transactionHash', (hash) => { // When the transaction is complete, set loading to false.
        this.setState({ loading: false })
    });

  } //End buyTokens



  //This function takes in the token amount to sell and swaps it for ether (IMPORTANT)
  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });

    //Approve funds from user and then sell.
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount)
    .send({ from: this.state.account })
    .on('transactionHash', (hash) => {
      // Sell tokens once funds approved
      this.state.ethSwap.methods.sellTokens(tokenAmount)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false });
      });
    });

  } //End sellTokens

  
  render() {
    let content;
    if (this.state.loading) {
      content = <p id='loader' className='text-center'>Loading...</p>
    } else {
      content = <Main 
                  ethBalance={this.state.ethBalance} 
                  tokenBalance={this.state.tokenBalance}
                  buyTokens={this.buyTokens}
                  sellTokens={this.sellTokens}
      />
    }
    
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: "600px" }}>
              <div className="content mr-auto ml-auto">

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
