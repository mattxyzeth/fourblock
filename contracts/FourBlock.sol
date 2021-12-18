// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FourBlock {
    uint256 totalCheckIns;
    mapping(address => uint256) public checkInCountByAddress;

    constructor() {
        console.log("FourBlock - Check-In contract has been deployed.");
    }

    function checkIn() public {
        totalCheckIns += 1;
        checkInCountByAddress[msg.sender] += 1;
        console.log("%s has checked in!", msg.sender);
    }

    function getTotalCheckIns() public view returns (uint256) {
        console.log("We have %d total check-ins!", totalCheckIns);
        return totalCheckIns;
    }
}
