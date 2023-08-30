// Get funds from users
// Withdraw funds
// Set a minimum funding value in INR

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    // using a library
    using PriceConverter for uint256; // use uint256 as objects

    uint256 public constant MINIMUM_USD = 50 * 1e18; // 50 USD
    // Constant saves gas | They are stored directly in bytecode | No storage Slots given
    // Same with the immutable
    uint256 public price;
    AggregatorV3Interface public priceFeed;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    //  now requiring 776,834 gas
    // tricks to get the gas down
    // by adding constant and mutable keyword to variables
    // now rquire 757,550 and then 733989 gas after use of coonstant and immutable respectively
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        // set minimum fund amt
        // if not met with condition,
        // prior work is reverted (gas returns)

        // // Require
        // 1e18 = 1 * 10 ** 18 = 1000000000000000000 wei = 1 eth
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Send minimum 1 Eth"
        );

        // // Revert Error handling are more gas efficient
        // if(msg.value.getConversionRate() >= MINIMUM_USD){
        //     revert <Error Name>
        // }

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        // require(msg.sender == owner); // only owner can withdraw now
        //  for loop to reset funders fund amount
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        // reset arrray
        funders = new address[](0);

        // // Different Withdraw Methods

        // // Transfer(2300 gas | throws error)
        // // payable address ->
        // payable(msg.sender).transfer(address(this).balance);

        // // Send(2300 gas | return a bool for success or not)
        // bool sendSucess = payable(msg.sender).send(address(this).balance);
        // require(sendSucess, "Send failed");

        // Call(special function:- treated as a transasction, low level funtion)
        // (forward all gas pr set gas | retrun bool and some data)
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    //  What if someone send someone sends ETH wihtout fund function

    // for all transaction sent externally it will trigger
    // a. receive() if no msg.data is sent
    // b. fallback() if msg.data is sent

    // receive()
    receive() external payable {
        fund();
    }

    // fallback()
    fallback() external payable {
        fund();
    }
}
