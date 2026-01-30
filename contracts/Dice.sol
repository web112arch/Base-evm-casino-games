// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Dice {
    address public owner;

    uint256 public constant MIN_BET = 0.0001 ether;
    uint256 public constant MAX_BET = 0.1 ether;

    event Rolled(address indexed player, uint8 pick, uint8 result, bool win, uint256 amount);

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

    function roll(uint8 pick) external payable {
        require(pick >= 1 && pick <= 6, "pick 1..6");
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "bet range");

        uint8 result = _randD6();
        bool win = (pick == result);

        if (win) {
            uint256 payout = msg.value * 6;
            require(address(this).balance >= payout, "bankroll low");
            (bool ok, ) = msg.sender.call{value: payout}("");
            require(ok, "payout failed");
        }

        emit Rolled(msg.sender, pick, result, win, msg.value);
    }

    function _randD6() internal view returns (uint8) {
        uint256 r = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender)));
        return uint8((r % 6) + 1); // 1..6
    }
}