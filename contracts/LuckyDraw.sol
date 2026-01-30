// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LuckyDraw {
    address public owner;

    uint256 public constant MIN_BET = 0.0001 ether;
    uint256 public constant MAX_BET = 0.1 ether;

    // 1 em 10
    uint256 public constant ODDS = 10;

    event Played(address indexed player, uint256 roll, bool win, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}
    function depositBankroll() external payable onlyOwner {}

    function withdraw(uint256 amount) external onlyOwner {
        (bool ok, ) = owner.call{value: amount}("");
        require(ok, "withdraw failed");
    }

    function play() external payable {
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "bet range");

        uint256 r = _rand() % ODDS; // 0..9
        bool win = (r == 0);

        if (win) {
            uint256 payout = msg.value * ODDS;
            require(address(this).balance >= payout, "bankroll low");
            (bool ok, ) = msg.sender.call{value: payout}("");
            require(ok, "payout failed");
        }

        emit Played(msg.sender, r, win, msg.value);
    }

    function _rand() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender)));
    }
}