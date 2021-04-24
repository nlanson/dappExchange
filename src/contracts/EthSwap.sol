pragma solidity ^0.8.4;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100; //Exchange rate.
    
    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) {
        token = _token;
    }

    function buyTokens() public payable {
        uint tokenAmount = msg.value * 100; //Set tokenAmount to the amount of Ether received times 100.

        require(token.balanceOf(address(this)) >= tokenAmount); //The exchange must have more than or equal amount of the requested tokenAmount to proceed.

        token.transfer(msg.sender, tokenAmount); //Transfer the tokens to the buyers address.

        //Emit the TokenPurchased Event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}