pragma solidity ^0.8.4;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100; //Exchange rate.
    
    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) {
        token = _token;
    }

    function buyTokens() public payable {
        //Calculate amount of tokens to pay
        uint tokenAmount = msg.value * 100; //Set tokenAmount to the amount of Ether received times 100.

        //Require that EthSwap address has enough tokens.
        require(token.balanceOf(address(this)) >= tokenAmount); //The exchange must have more than or equal amount of the requested tokenAmount to proceed.

        //Transfer tokens to the user
        token.transfer(msg.sender, tokenAmount); //Transfer the tokens to the buyers address.

        //Emit the TokenPurchased Event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    
    function sellTokens(uint _amount) public payable{
        //Store sender address as a payable address.
        address payable sender = payable(msg.sender);
        
        //Calculate Ether amount to redeem
        uint etherAmount = _amount / rate;

        //User cant sell more tokens that they have
        require(token.balanceOf(msg.sender) >= _amount);

        //Require EthSwap to have enough ether to redeem the tokens.
        require(address(this).balance >= etherAmount);

        //Transfer tokens from user, to EthSwap of amount.
        token.transferFrom(msg.sender, address(this), _amount);

        //Send ether to the msg sender.
        sender.transfer(etherAmount);

        //Emit the TokensSold event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}