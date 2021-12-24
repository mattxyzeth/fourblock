// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FourBlock {
    uint256 totalCheckIns;

    event NewCheckIn(address indexed from, uint256 timestamp, string lat, string lon);

    struct CheckIn {
      string lat;
      string lon;
      uint256 timestamp;
    }

    mapping(address => CheckIn[]) public checkIns;

    constructor() {
        console.log("FourBlock - Check-In contract has been deployed.");
    }

    function checkIn(string memory lat, string memory lon) public {
        totalCheckIns += 1;

        checkIns[msg.sender].push(CheckIn(lat, lon, block.timestamp));

        emit NewCheckIn(msg.sender, block.timestamp, lat, lon);
    }

    function getCheckIns() public view returns (CheckIn[] memory) {
      return checkIns[msg.sender];
    }

    function getTotalCheckIns() public view returns (uint256) {
        console.log("We have %d total check-ins!", totalCheckIns);
        return totalCheckIns;
    }
}
