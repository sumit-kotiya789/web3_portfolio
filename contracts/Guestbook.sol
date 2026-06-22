// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Guestbook {
    struct Entry {
        address author;
        string message;
        uint256 timestamp;
    }

    uint256 public constant MAX_LEN = 280;

    Entry[] private _entries;
    mapping(address => uint256) public lastSignedAt;

    event Signed(address indexed author, string message, uint256 timestamp);

    function sign(string calldata message) external {
        uint256 len = bytes(message).length;
        require(len > 0, "Guestbook: empty message");
        require(len <= MAX_LEN, "Guestbook: message too long");

        _entries.push(Entry({ author: msg.sender, message: message, timestamp: block.timestamp }));
        lastSignedAt[msg.sender] = block.timestamp;

        emit Signed(msg.sender, message, block.timestamp);
    }

    function total() external view returns (uint256) {
        return _entries.length;
    }

    function getEntries(uint256 offset, uint256 limit) external view returns (Entry[] memory) {
        uint256 len = _entries.length;
        if (offset >= len) return new Entry[](0);

        uint256 end = len - offset;      
        uint256 start = end > limit ? end - limit : 0;
        Entry[] memory out = new Entry[](end - start);

        for (uint256 i = 0; i < out.length; i++) {
            out[i] = _entries[end - 1 - i]; 
        }
        return out;
    }
}
