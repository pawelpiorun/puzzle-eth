// SPDX-License-Identificator: MIT

pragma solidity ^0.8.9;

contract Puzzle {
    uint public prize;
    address private manager;
    bytes32 private answer;
    
    uint64 public puzzleID;
    
    //in case the puzzle provider changes
    //string private _puzzleUri;
    
    event NewAnswer();
    event AnswerGuessed(address indexed winner, uint prize);
    
    constructor() {
        manager = msg.sender;
    }
    
    modifier onlyManager() {
        require(msg.sender == manager, "You're not a manager.");
        _;
    }
    
    function setNewAnswer(string memory word, uint64 id) public payable onlyManager {
        require(msg.value > 0);
        answer = keccak256(abi.encodePacked(word));
        prize = msg.value;
        puzzleID = id;
        emit NewAnswer();
    }
    
    function guessAnswer(string memory word) public {
        require(answer != 0, "Puzzle solve is paused.");
        require(keccak256(abi.encodePacked(word)) == answer, "Wrong answer!");
        
        (bool success, ) = msg.sender.call{value: prize}("");
        require(success);
        
        emit AnswerGuessed(msg.sender, prize);
        prize = 0;
        answer = 0;
    }

    function isPaused() public view returns (bool) {
        return answer == 0;
    }
}