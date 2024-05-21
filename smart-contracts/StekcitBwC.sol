// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import {StekcitUser, StekcitEvent, StekcitTicket, StekcitPayout} from "./StekcitBwCStructs.sol";

import {ERC20} from "./StekcitBwCInterfaces.sol";

contract StekcitBwC {
    StekcitUser[] private allStekcitUsers;
    StekcitEvent[] private allStekcitEvents;
    StekcitTicket[] private allStekcitTickets;
    StekcitPayout[] private allStekcitPayouts;

    address public stekcitBwCOwnerAddress;

    uint256 private currentUserId;
    uint256 private currentEventId;
    uint256 private currentTicketId;
    uint256 private currentPayoutId;

    ERC20 CUSD = ERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1);

    constructor(address _stekcitBwCOwnerAddress) {
        stekcitBwCOwnerAddress = _stekcitBwCOwnerAddress;
    }

    modifier onlyCreatingUser(uint256 _eventId) {
        require(
            checkIfUserisCreatingUserOfEvent(_eventId, msg.sender),
            "Only a Creating user can perform this action."
        );
        _;
    }

        modifier onlyExistingUser() {
        require(
            checkIfUserExists(msg.sender),
            "Only Existing users can perform this action."
        );
        _;
    }

    function checkIfUserExists(address _walletAddress)
        public
        view
        returns (bool)
    {
        for (uint256 userId = 0; userId < allStekcitUsers.length; userId++) {
            StekcitUser memory currentUser = allStekcitUsers[userId];
            if (
                currentUser.walletAddress == _walletAddress &&
                !currentUser.isBlank
            ) {
                return true;
            }
        }

        return false;
    }

    function checkIfUserisCreatingUserOfEvent(
        uint256 _eventId,
        address _walletAddress
    ) public view returns (bool) {
        StekcitEvent memory eventToCheck = allStekcitEvents[_eventId];

        if (eventToCheck.creatingUserWalletAddress == _walletAddress) {
            return true;
        }

        return false;
    }

    function createUser(
        address _walletAddress,
        string memory _username,
        string memory _emailAddress
    ) public returns (StekcitUser memory) {
        bool userExists = checkIfUserExists(_walletAddress);

        if (userExists) {
            return getUserByWalletAddress(_walletAddress);
        }

        uint256 newUserId = currentUserId;

        allStekcitUsers.push(
            StekcitUser(
                newUserId,
                _walletAddress,
                _username,
                _emailAddress,
                false,
                false
            )
        );

        currentUserId++;

        return getUserByUserId(newUserId);
    }

    function getUserByWalletAddress(address _walletAddress)
        public
        view
        returns (StekcitUser memory)
    {
        for (uint256 userId = 0; userId < allStekcitUsers.length; userId++) {
            StekcitUser memory currentUser = allStekcitUsers[userId];
            if (currentUser.walletAddress == _walletAddress) {
                return currentUser;
            }
        }
        StekcitUser memory blankUser;
        blankUser.isBlank = true;
        return blankUser;
    }

    function getUserByUserId(uint256 _userId)
        public
        view
        returns (StekcitUser memory)
    {
        for (uint256 userId = 0; userId < allStekcitUsers.length; userId++) {
            StekcitUser memory currentUser = allStekcitUsers[userId];
            if (currentUser.id == _userId) {
                return currentUser;
            }
        }
        StekcitUser memory blankUser;
        blankUser.isBlank = true;
        return blankUser;
    }

    function getTotalNumberOfAllEventsCreatedByUser(address _walletAddress)
        public
        view
        returns (uint256)
    {
        uint256 numberOfEventsCreatedByUser = 0;

        for (
            uint256 eventId = 0;
            eventId < allStekcitEvents.length;
            eventId++
        ) {
            StekcitEvent memory currentEvent = allStekcitEvents[eventId];
            if (currentEvent.creatingUserWalletAddress == _walletAddress) {
                numberOfEventsCreatedByUser++;
            }
        }

        return numberOfEventsCreatedByUser;
    }

    function getNumberOfTicketsOfUser(address _walletAddress)
        public
        view
        returns (uint256)
    {
        uint256 numberOfTicketsOfUser = 0;

        for (
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];
            if (currentTicket.attendingUserWalletAddress == _walletAddress) {
                numberOfTicketsOfUser++;
            }
        }

        return numberOfTicketsOfUser;
    }

    function getNumberOfTicketsOfEvent(uint256 _eventId)
        public
        view
        returns (uint256)
    {
        uint256 numberOfTicketsOfEvent = 0;

        for (
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];
            if (currentTicket.eventId == _eventId) {
                numberOfTicketsOfEvent++;
            }
        }

        return numberOfTicketsOfEvent;
    }

    function getAllEventsCreatedByUser(address _walletAddress)
        public
        view
        returns (StekcitEvent[] memory)
    {
        StekcitEvent[] memory eventsOfCreatingUser = new StekcitEvent[](
            getTotalNumberOfAllEventsCreatedByUser(_walletAddress)
        );

        for (
            uint256 eventId = 0;
            eventId < allStekcitEvents.length;
            eventId++
        ) {
            StekcitEvent memory currentEvent = allStekcitEvents[eventId];
            if (currentEvent.creatingUserWalletAddress == _walletAddress) {
                eventsOfCreatingUser[eventId] = currentEvent;
            }
        }

        return eventsOfCreatingUser;
    }

    function getTotalNumberOfTicketsOfEvent(uint256 _eventId)
        public
        view
        returns (uint256)
    {
        uint256 numberOfTicketsOfEvents = 0;

        for (
            uint256 eventId = 0;
            eventId < allStekcitEvents.length;
            eventId++
        ) {
            StekcitEvent memory currentEvent = allStekcitEvents[eventId];
            if (currentEvent.id == _eventId) {
                numberOfTicketsOfEvents++;
            }
        }

        return numberOfTicketsOfEvents;
    }

    function getAllTicketsOfEvent(uint256 _eventId)
        public
        view
        returns (StekcitTicket[] memory)
    {
        uint256 runningTicketId = 0;

        uint256 totalNumberOfTicketsOfEvent = getNumberOfTicketsOfEvent(
            _eventId
        );

        StekcitTicket[] memory allTicketsOfEvent = new StekcitTicket[](
            totalNumberOfTicketsOfEvent
        );

        for (
            uint256 ticketId = 0;
            ticketId < totalNumberOfTicketsOfEvent;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];

            if (currentTicket.eventId == _eventId) {
                allTicketsOfEvent[runningTicketId] = currentTicket;
                runningTicketId++;
            }
        }

        return allTicketsOfEvent;
    }

    function getNumberOfAllPublishedEvents() public view returns (uint256) {
        uint256 numberOfPublishedEvents = 0;

        for (
            uint256 eventId = 0;
            eventId < allStekcitEvents.length;
            eventId++
        ) {
            StekcitEvent memory currentEvent = allStekcitEvents[eventId];
            if (currentEvent.isPublished) {
                numberOfPublishedEvents++;
            }
        }

        return numberOfPublishedEvents;
    }

    function getAllPublishedEvents()
        public
        view
        returns (StekcitEvent[] memory)
    {
        uint256 runningEventId = 0;
        StekcitEvent[] memory publishedEvents = new StekcitEvent[](
            getNumberOfAllPublishedEvents()
        );

        for (
            uint256 eventId = 0;
            eventId < allStekcitEvents.length;
            eventId++
        ) {
            StekcitEvent memory currentEvent = allStekcitEvents[eventId];
            if (currentEvent.isPublished) {
                publishedEvents[runningEventId] = currentEvent;
                runningEventId++;
            }
        }

        return publishedEvents;
    }

    function getAllTicketsOfUser(address _walletAddress)
        public
        view
        returns (StekcitTicket[] memory)
    {
        uint256 runningTicketId = 0;
        StekcitTicket[] memory allTicketsOfUser = new StekcitTicket[](
            getNumberOfTicketsOfUser(_walletAddress)
        );

        for (
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];
            if (currentTicket.attendingUserWalletAddress == _walletAddress) {
                allTicketsOfUser[runningTicketId] = currentTicket;
                runningTicketId++;
            }
        }

        return allTicketsOfUser;
    }

    function makeCreatingUser(address _walletAddress) public onlyExistingUser returns (bool) {
        StekcitUser memory userToBeUpdated = getUserByWalletAddress(
            _walletAddress
        );

        if (!userToBeUpdated.isBlank) {
            uint256 userId = userToBeUpdated.id;
            userToBeUpdated.isCreatingUser = true;
            allStekcitUsers[userId] = userToBeUpdated;
            return true;
        }
        return false;
    }

    function getEventById(uint256 _eventId)
        public
        view
        returns (StekcitEvent memory)
    {
        for (
            uint256 eventId = 0;
            eventId < allStekcitEvents.length;
            eventId++
        ) {
            StekcitEvent memory currentEvent = allStekcitEvents[eventId];
            if (currentEvent.id == _eventId) {
                return currentEvent;
            }
        }

        StekcitEvent memory blankEvent;
        blankEvent.isBlank = true;
        return blankEvent;
    }

    function createEvent(
        address _creatingWalletAddress,
        string memory _title,
        string memory _description,
        string memory _link,
        uint256 _amount,
        uint256 dateAndTime,
        bool forImmediatePublishing
    ) public returns (StekcitEvent memory) {
        uint256 newEventId = currentEventId;
        uint256 createdAt = block.timestamp;
        uint256 updatedAt = block.timestamp;

        allStekcitEvents.push(
            StekcitEvent(
                newEventId,
                _creatingWalletAddress,
                _title,
                _description,
                _link,
                _amount,
                createdAt,
                updatedAt,
                dateAndTime,
                false,
                forImmediatePublishing,
                false,
                0,
                false,
                false
            )
        );

        currentEventId++;

        return getEventById(newEventId);
    }

    function getTicketById(uint256 _ticketId)
        public
        view
        returns (StekcitTicket memory)
    {
        return allStekcitTickets[_ticketId];
    }

    function getEventAttendees(uint256 _eventId)
        public
        view
        returns (StekcitUser[] memory)
    {
        uint256 runningUserId = 0;

        StekcitUser[] memory eventAttendees = new StekcitUser[](
            getTotalNumberOfTicketsOfEvent(_eventId)
        );

        for (
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];

            if (currentTicket.eventId == _eventId) {
                StekcitUser memory currentUser = getUserByWalletAddress(
                    currentTicket.attendingUserWalletAddress
                );
                eventAttendees[runningUserId] = currentUser;
                runningUserId++;
            }
        }

        return eventAttendees;
    }

    function checkStekcitBwCAllowanceOfUser(address _walletAddress)
        public
        view
        returns (uint256)
    {
        return CUSD.allowance(_walletAddress, address(this));
    }

    function payForEvent(uint256 _amount) public returns (bool) {
        return CUSD.transfer(address(this), _amount);
    }

    function createTicketForUser(
        uint256 _eventId,
        address _attendingUserWalletAddress,
        uint256 _amountPaid
    ) public returns (StekcitTicket memory) {
        uint256 newTicketId = currentTicketId;

        allStekcitTickets.push(
            StekcitTicket(
                newTicketId,
                _eventId,
                _attendingUserWalletAddress,
                _amountPaid
            )
        );

        currentTicketId++;

        return getTicketById(newTicketId);
    }

    function checkIfUserAlreadyHasTicket(
        uint256 _eventId,
        address _walletAddress
    ) public view returns (bool) {
        StekcitTicket[] memory userTickets = getAllTicketsOfUser(
            _walletAddress
        );
        for (uint256 ticketId = 0; ticketId < userTickets.length; ticketId++) {
            StekcitTicket memory currentTicket = userTickets[ticketId];
            if (currentTicket.eventId == _eventId) {
                return true;
            }
        }

        return false;
    }

    function checkIfEventIsAlreadyPaidOut(uint256 _eventId)
        public
        view
        onlyCreatingUser(_eventId)
        returns (bool)
    {
        for (
            uint256 payoutId = 0;
            payoutId < allStekcitPayouts.length;
            payoutId++
        ) {
            StekcitPayout memory currentPayout = allStekcitPayouts[payoutId];

            if (currentPayout.eventId == _eventId) {
                return true;
            }
        }

        return false;
    }

    function processPayout(uint256 _eventId)
        public
        onlyCreatingUser(_eventId)
        returns (StekcitPayout memory)
    {
        // Check if event has already been paid out (if payout exists)

        StekcitEvent memory eventToBePaidOut = allStekcitEvents[_eventId];

        bool eventIsAlreadyPaidOut = checkIfEventIsAlreadyPaidOut(_eventId);

        StekcitPayout memory blankPayout;
        blankPayout.isBlank = true;

        if (eventIsAlreadyPaidOut) {
            return blankPayout;
        }

        // Get amount to be paid
        uint256 amountPaidToEvent = getTotalAmountPaidToEvent(_eventId);
        uint256 amountToBePaidOutToCreatingUser = (amountPaidToEvent * 8) / 10;
        uint256 amountToBePaidOutToCreatingUserInEthers = amountToBePaidOutToCreatingUser *
                (10**CUSD.decimals());

        // Transfer to creating user
        bool isCreatingUserPaid = CUSD.transfer(
            eventToBePaidOut.creatingUserWalletAddress,
            amountToBePaidOutToCreatingUserInEthers
        );

        if (isCreatingUserPaid) {
            uint256 amountToBePaidOutToStekcitBwcOwner = (amountPaidToEvent *
                2) / 10;

            // Transfer to StekcitBwCOwner
            uint256 amountToBePaidOutToStekcitBwcOwnerInEthers = amountToBePaidOutToStekcitBwcOwner *
                    (10**CUSD.decimals());

            bool isStekcitBwCOwnerPaid = CUSD.transfer(
                stekcitBwCOwnerAddress,
                amountToBePaidOutToStekcitBwcOwnerInEthers
            );

            if (isStekcitBwCOwnerPaid) {
                // allStekcitPayouts =
                StekcitPayout memory newPayout = createPayout(
                    _eventId,
                    amountToBePaidOutToCreatingUser
                );
                return newPayout;
            }
        } else {
            return blankPayout;
        }

        return blankPayout;
    }

    function createPayout(uint256 _eventId, uint256 _amount)
        public
        onlyCreatingUser(_eventId)
        returns (StekcitPayout memory)
    {
        uint256 newPayoutId = currentPayoutId;

        allStekcitPayouts.push(
            StekcitPayout(
                newPayoutId,
                _eventId,
                msg.sender,
                _amount,
                block.timestamp,
                false
            )
        );

        return getPayoutById(newPayoutId);
    }

    function getPayoutById(uint256 _payoutId)
        public
        view
        returns (StekcitPayout memory)
    {
        return allStekcitPayouts[_payoutId];
    }

    function getTotalAmountPaidToEvent(uint256 _eventId)
        public
        view
        returns (uint256)
    {
        uint256 totalAmount = 0;

        StekcitTicket[] memory allTicketsOfEvent = getAllTicketsOfEvent(
            _eventId
        );

        for (
            uint256 ticketId = 0;
            ticketId < allTicketsOfEvent.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allTicketsOfEvent[ticketId];
            totalAmount += currentTicket.amountPaid;
        }

        return totalAmount;
    }

    function verifyEvent(uint256 _eventId)
        public
        returns (StekcitEvent memory)
    {
        StekcitEvent memory eventToVerifyAndUpdate = getEventById(_eventId);

        uint256 verificationAmount = (eventToVerifyAndUpdate.amount * 1) / 10;

        eventToVerifyAndUpdate.updatedAt = block.timestamp;
        eventToVerifyAndUpdate.isVerified = true;
        eventToVerifyAndUpdate.verificationAmount = verificationAmount;

        allStekcitEvents[_eventId] = eventToVerifyAndUpdate;

        return eventToVerifyAndUpdate;
    }

    function publishEvent(uint256 _eventId)
        public
        returns (StekcitEvent memory)
    {
        StekcitEvent memory eventToVerifyAndUpdate = getEventById(_eventId);

        eventToVerifyAndUpdate.isPublished = true;

        allStekcitEvents[_eventId] = eventToVerifyAndUpdate;

        return eventToVerifyAndUpdate;
    }

    function approveStekcitBM(uint256 _amount) public returns (bool) {
        uint256 approvalAmountInEthers = _amount * (10**CUSD.decimals());
        return CUSD.approve(address(this), approvalAmountInEthers);
    }

    function increaseApprovalForStekcitBwC(uint256 _increaseApprovalAmount)
        public
        returns (bool)
    {
        uint256 increaseApprovalAmountInEthers = _increaseApprovalAmount *
            (10**CUSD.decimals());

        return
            CUSD.increaseAllowance(
                address(this),
                increaseApprovalAmountInEthers
            );
    }
}
