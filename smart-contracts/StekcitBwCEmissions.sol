// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract StekcitBwCEmissions {
     event EvStekcitUser(
        uint256 id,
        address walletAddress,
        string username,
        string emailAddress,
        bool isCreatingUser,
        bool isBlank
    );

    event EvStekcitEvent(
        uint256 id,
        address creatingUserWalletAddress,
        string description,
        string link,
        uint256 amountInEthers,
        uint256 createdAt,
        uint256 updatedAt,
        uint256 dateAndTime,
        bool isBlank,
        bool isPublished,
        bool isVerified,
        uint256 verificationAmountInEthers,
        bool isEnded,
        bool isPaidOut
    );

    event EvStekcitTicket(
        uint256 id,
        uint256 eventId,
        address attendingUserWalletAddress,
        uint256 amountPaidInEthers,
        bool isBlank
    );

    event EvStekcitPayout(
        uint256 id,
        uint256 eventId,
        address creatingUserWalletAddress,
        uint256 amountPaidOutInEthers,
        uint256 dateTimeAndMade,
        bool isBlank
    );
}
