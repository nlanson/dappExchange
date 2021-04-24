const { assert } = require('chai');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

chai
    .use(chaiAsPromised)
    .should();

contract('EthSwap', function([deployer, investor]) {
    let token;
    let ethSwap;
    
    before(async() => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        //Transfer all tokens into the Exchange address.
        await token.transfer(ethSwap.address, tokens('1000000'));
    });

    describe('Token Deployment', async () => {
        it ('Token has a name', async () => {
            let name = await token.name();
            assert.equal(name, 'DApp Token')
        });
    });
    
    describe('EthSwap Deployment', async () => {
        it ('Contract has a name', async () => {
            let name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange')
        });

        it ('Contract has Tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('1000000'));
        });
    });

    describe('Buy Tokens', async () => {
        let result;
        let supply = 1000000;
        //The amount of Ether that the investor has put into the EthSwap exchange.
        let sendAmount = 1;

        before(async() => {
            //Purchase Tokens before tests.
            result = await ethSwap.buyTokens({from: investor, value: tokens(sendAmount.toString())});
        });

        it('Investor receives tokens', async () => {
            let balance = await token.balanceOf(investor); //Investor token balance.
            //The exchange rate is r*100;            
            let expectedBal = sendAmount*100; //Expected token balance of the investor.
            assert.equal(balance.toString(), tokens(expectedBal.toString())); //Balance should equal to the expectedBalance as calculated above.
        });

        it('Tokens subtracted from EthSwap', async () => {
            let balance = await token.balanceOf(ethSwap.address); //Exchange balance in Wei.      
            let expectedBal = tokens((supply - (sendAmount*100)).toString()); //Expected balance of the exchange should be supply minus sendAmount time 100. Converted to Wei.
            assert.equal(balance.toString(), expectedBal.toString()); //Balance should equal to the expectedBalance as calculated above.
        });

        it('Ether added to EthSwap', async() => {
            let balance = await web3.eth.getBalance(ethSwap.address); //Exchange ETHER balance.
            assert.equal(balance.toString(), tokens(sendAmount.toString())); //Balance should equal to the sendAmount.
        });

        it('Event is correct', async() => {
            const eventName = result.logs[0].event;
            const event = result.logs[0].args;
            
            assert.equal(eventName, `TokenPurchased`); //Event name should equal 'TokenPurchased'.
            assert.equal(event.account, investor); //Event account should be the investor account.
            assert.equal(event.token, token.address); //Event token should reside in the same address as our Token contract's address.
            assert.equal(event.amount.toString(), tokens((sendAmount*100).toString()).toString()); // Event amount should be the amount the investor receives.
            assert.equal(event.rate.toString(), '100') //Event rate should be the exchange rate (100).
        });
    });

});

function tokens(n) { //Returns the raw Wei value of entered tokens as an integer.
    return web3.utils.toWei(n, 'ether');
}