// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HighLow {
    enum Pick { Low, High }

    address public owner;

    uint256 public constant MIN_BET = 0.0001 ether;
    uint256 public constant MAX_BET = 0.1 ether;

    event Played(address indexed player, Pick pick, uint8 result, bool win, uint256 amount);

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

    function play(Pick pick) external payable {
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "bet range");

        uint8 r = _rand1to100();

        bool win;
        if (pick == Pick.Low) {
            win = (r >= 1 && r <= 49);
        } else {
            win = (r >= 52 && r <= 100);
        }

        if (win) {
            uint256 payout = msg.value * 2;
            require(address(this).balance >= payout, "bankroll low");
            (bool ok, ) = msg.sender.call{value: payout}("");
            require(ok, "payout failed");
        }

        emit Played(msg.sender, pick, r, win, msg.value);
    }

    function _rand1to100() internal view returns (uint8) {
        uint256 x = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender)));
        return uint8((x % 100) + 1); // 1..100
    }
}