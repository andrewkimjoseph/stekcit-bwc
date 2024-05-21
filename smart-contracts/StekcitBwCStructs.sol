// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

struct StekcitUser {
    uint256 id;
    address walletAddress;
    string username;
    string emailAddress;
    bool isCreatingUser;
    bool isBlank;
}

struct StekcitEvent {
    uint256 id;
    address creatingUserWalletAddress;
    string title;
    string description;
    string link;
    uint256 amount;
    uint256 createdAt;
    uint256 updatedAt;
    uint256 dateAndTime;
    bool isBlank;
    bool isPublished;
    bool isVerified;
    uint256 verificationAmount;
    bool isEnded;
    bool isPaidOut;
}

struct StekcitTicket {
    uint256 id;
    uint256 eventId;
    address attendingUserWalletAddress;
    uint256 amountPaid;
}

struct StekcitPayout {
    uint256 id;
    uint256 eventId;
    address creatingUserWalletAddress;
    uint256 amountPaidOut;
    uint256 dateTimeAndMade;
    bool isBlank;
}