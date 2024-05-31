
// File: smart-contracts/StekcitBwCInterfaces.sol


pragma solidity 0.8.7;

interface ERC20 {
    function initialize(string memory name_, string memory symbol_) external;

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);

    function _transfer(address from, address to, uint256 amount) external;
    function _mint(address account, uint256 amount) external;
    function _burn(address account, uint256 amount) external;
    function _approve(address owner, address spender, uint256 amount) external;
    function _spendAllowance(address owner, address spender, uint256 amount) external;

    function _beforeTokenTransfer(address from, address to, uint256 amount) external;
    function _afterTokenTransfer(address from, address to, uint256 amount) external;
}

// File: smart-contracts/StekcitBwCStructs.sol



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
    uint256 amountInEthers;
    uint256 createdAt;
    uint256 updatedAt;
    uint256 dateAndTime;
    bool isBlank;
    bool isPublished;
    bool isVerified;
    uint256 verificationAmountInEthers;
    bool isEnded;
    bool isPaidOut;
}

struct StekcitTicket {
    uint256 id;
    uint256 eventId;
    address attendingUserWalletAddress;
    uint256 amountPaidInEthers;
    bool isBlank;
}

struct StekcitPayout {
    uint256 id;
    uint256 eventId;
    address creatingUserWalletAddress;
    uint256 amountPaidOutInEthers;
    uint256 dateTimeAndMade;
    bool isBlank;
}
// File: smart-contracts/StekcitBwC.sol



pragma solidity 0.8.7;



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

    ERC20 cUSD = ERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1);

    constructor(address _stekcitBwCOwnerAddress) {
        stekcitBwCOwnerAddress = _stekcitBwCOwnerAddress;
    }

    modifier onlyCreatingUserOfEvent(uint256 _eventId) {
        require(
            checkIfUserisCreatingUserOfEvent(_eventId, msg.sender),
            "Only a creating user of event can perform this action."
        );
        _;
    }

    modifier onlyCreatingUser(address _walletAddress) {
        StekcitUser memory checkingUser = getUserByWalletAddress(
            _walletAddress
        );
        require(
            checkingUser.isCreatingUser,
            "Only a creating user can perform this action."
        );
        _;
    }

    modifier onlyExistingUser() {
        require(
            checkIfUserExists(msg.sender),
            "Only existing users can perform this action."
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

    function createUser(string memory _username, string memory _emailAddress)
        public
        returns (StekcitUser memory)
    {
        bool userExists = checkIfUserExists(msg.sender);

        if (userExists) {
            return getUserByWalletAddress(msg.sender);
        }

        uint256 newUserId = currentUserId;

        allStekcitUsers.push(
            StekcitUser(
                newUserId,
                msg.sender,
                _username,
                _emailAddress,
                false,
                false
            )
        );

        currentUserId++;

        StekcitUser memory newUser = getUserByUserId(newUserId);

        return newUser;
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
        uint256 runningEventId = 0;
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
                eventsOfCreatingUser[runningEventId] = currentEvent;
                runningEventId++;
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
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];
            if (currentTicket.eventId == _eventId) {
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

    function makeCreatingUser() public onlyExistingUser returns (bool) {
        StekcitUser memory userToBeUpdated = getUserByWalletAddress(msg.sender);

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
        string memory _title,
        string memory _description,
        string memory _link,
        uint256 _amount,
        uint256 _dateAndTime,
        bool _forImmediatePublishing
    )
        public
        onlyExistingUser
        onlyCreatingUser(msg.sender)
        returns (StekcitEvent memory)
    {
        uint256 newEventId = currentEventId;
        uint256 createdAt = block.timestamp;
        uint256 updatedAt = block.timestamp;
        uint256 amountInEthers = _amount * (10**cUSD.decimals());

        allStekcitEvents.push(
            StekcitEvent(
                newEventId,
                msg.sender,
                _title,
                _description,
                _link,
                amountInEthers,
                createdAt,
                updatedAt,
                _dateAndTime,
                false,
                _forImmediatePublishing,
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

    function checkIfTicketOfUserForThisEventExists(uint256 _eventId)
        public
        view
        returns (bool)
    {
        for (
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];
            if (
                currentTicket.eventId == _eventId &&
                currentTicket.attendingUserWalletAddress == msg.sender
            ) {
                return true;
            }
        }
        return false;
    }

    function getTicketByEventIdAndWalletAddress(
        uint256 _eventId,
        address _walletAddress
    ) public view returns (StekcitTicket memory) {
        for (
            uint256 ticketId = 0;
            ticketId < allStekcitTickets.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allStekcitTickets[ticketId];
            if (
                currentTicket.eventId == _eventId &&
                currentTicket.attendingUserWalletAddress == _walletAddress
            ) {
                return currentTicket;
            }
        }

        StekcitTicket memory blankTicket;
        blankTicket.isBlank = true;
        return blankTicket;
    }

    function createTicketForUser(uint256 _eventId)
        public
        onlyExistingUser
        returns (StekcitTicket memory)
    {
        StekcitEvent memory currentEvent = allStekcitEvents[_eventId];

        bool ticketOfUserForThisEventExists = checkIfTicketOfUserForThisEventExists(
                _eventId
            );

        if (ticketOfUserForThisEventExists) {
            return getTicketByEventIdAndWalletAddress(_eventId, msg.sender);
        }

        uint256 newTicketId = currentTicketId;

        allStekcitTickets.push(
            StekcitTicket(
                newTicketId,
                _eventId,
                msg.sender,
                currentEvent.amountInEthers,
                false
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
        onlyCreatingUserOfEvent(_eventId)
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
        onlyCreatingUserOfEvent(_eventId)
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

        uint256 totalAmountToBePaidOutToCreatingUser = 0; // Starting value

        // Get amount to be paid
        uint256 amountPaidToEventInEthers = getTotalAmountPaidToEventInEthers(
            _eventId
        );

        // Add it to starting value (now running value)
        totalAmountToBePaidOutToCreatingUser +=
            (amountPaidToEventInEthers * 80) /
            100;

        // Add verification amount if [StekcitEvent] was verified
        if (eventToBePaidOut.isVerified) {
            totalAmountToBePaidOutToCreatingUser += eventToBePaidOut
                .verificationAmountInEthers;
        }

        // Transfer to creating user
        bool isCreatingUserPaid = cUSD.transfer(
            eventToBePaidOut.creatingUserWalletAddress,
            totalAmountToBePaidOutToCreatingUser
        );

        if (isCreatingUserPaid) {
            uint256 amountToBePaidOutToStekcitBwcOwner = (amountPaidToEventInEthers *
                    20) / 100;

            // Transfer to StekcitBwCOwner

            bool isStekcitBwCOwnerPaid = cUSD.transfer(
                stekcitBwCOwnerAddress,
                amountToBePaidOutToStekcitBwcOwner
            );

            if (isStekcitBwCOwnerPaid) {
                // Mark the event as ended and as paid out
                eventToBePaidOut.isEnded = true;
                eventToBePaidOut.isPaidOut = true;
                allStekcitEvents[_eventId] = eventToBePaidOut;

                // Create new payout
                StekcitPayout memory newPayout = createPayout(
                    _eventId,
                    totalAmountToBePaidOutToCreatingUser
                );
                return newPayout;
            }
        } else {
            return blankPayout;
        }

        return blankPayout;
    }

    function createPayout(uint256 _eventId, uint256 _amount)
        private
        onlyCreatingUserOfEvent(_eventId)
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

    function getTotalAmountPaidToEventInEthers(uint256 _eventId)
        public
        view
        returns (uint256)
    {
        uint256 totalAmountInEthers = 0;

        StekcitTicket[] memory allTicketsOfEvent = getAllTicketsOfEvent(
            _eventId
        );

        for (
            uint256 ticketId = 0;
            ticketId < allTicketsOfEvent.length;
            ticketId++
        ) {
            StekcitTicket memory currentTicket = allTicketsOfEvent[ticketId];
            totalAmountInEthers += currentTicket.amountPaidInEthers;
        }

        return totalAmountInEthers;
    }

    function verifyEvent(uint256 _eventId)
        public
        onlyCreatingUserOfEvent(_eventId)
        returns (StekcitEvent memory)
    {
        StekcitEvent memory eventToVerifyAndUpdate = getEventById(_eventId);

        uint256 verificationAmount = eventToVerifyAndUpdate.amountInEthers / 10;

        eventToVerifyAndUpdate.updatedAt = block.timestamp;
        eventToVerifyAndUpdate.isVerified = true;
        eventToVerifyAndUpdate.verificationAmountInEthers = verificationAmount;

        allStekcitEvents[_eventId] = eventToVerifyAndUpdate;

        return eventToVerifyAndUpdate;
    }

    function publishEvent(uint256 _eventId)
        public
        onlyCreatingUserOfEvent(_eventId)
        returns (StekcitEvent memory)
    {
        StekcitEvent memory eventToVerifyAndUpdate = getEventById(_eventId);

        eventToVerifyAndUpdate.isPublished = true;

        allStekcitEvents[_eventId] = eventToVerifyAndUpdate;

        return eventToVerifyAndUpdate;
    }
}
