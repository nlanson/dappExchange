import React, { Component } from 'react';
import './App.css';
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
    this.setState({account: accounts[0]});
    console.log(this.state.account);
  }

  constructor(props) {
    super(props);
    this.state = {
      account: ''
    };
  }
  
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
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
