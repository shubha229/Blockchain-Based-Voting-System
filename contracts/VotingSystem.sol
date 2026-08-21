// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystem {

    // =====================================================
    // STRUCTS
    // =====================================================

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string name;
        uint8 status;
        uint256 candidateCount;
    }

    // =====================================================
    // CONSTANTS
    // =====================================================

    uint8 public constant NOT_STARTED = 0;
    uint8 public constant ACTIVE = 1;
    uint8 public constant CLOSED = 2;

    // =====================================================
    // ADMIN
    // =====================================================

    address public admin;

    // =====================================================
    // ELECTION STORAGE
    // =====================================================

    uint256 public electionCount;

    uint256 public currentElectionId;

    mapping(uint256 => Election) public elections;

    // electionId => candidateId => Candidate
    mapping(
        uint256 =>
        mapping(uint256 => Candidate)
    ) private candidates;

    // electionId => voter => registered
    mapping(
        uint256 =>
        mapping(address => bool)
    ) private registeredVoters;

    // electionId => voter => voted
    mapping(
        uint256 =>
        mapping(address => bool)
    ) private voterHasVoted;

    // electionId => voter => candidateId
    mapping(
        uint256 =>
        mapping(address => uint256)
    ) private voterChoice;

    // =====================================================
    // EVENTS
    // =====================================================

    event ElectionCreated(
        uint256 indexed electionId,
        string name
    );

    event ElectionStarted(
        uint256 indexed electionId
    );

    event ElectionEnded(
        uint256 indexed electionId
    );

    event CandidateAdded(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string name,
        string party
    );

    event VoterRegistered(
        uint256 indexed electionId,
        address indexed voter
    );

    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        uint256 indexed candidateId
    );

    // =====================================================
    // MODIFIER
    // =====================================================

    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only admin can perform this action"
        );
        _;
    }

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor() {
        admin = msg.sender;
    }

    // =====================================================
    // CREATE ELECTION
    // =====================================================

    function createElection(
        string memory _name
    )
        public
        onlyAdmin
        returns (uint256)
    {
        require(
            bytes(_name).length > 0,
            "Election name required"
        );

        // Previous election must be closed
        if (electionCount > 0) {
            require(
                elections[currentElectionId].status ==
                    CLOSED,
                "Previous election is still active"
            );
        }

        electionCount++;

        uint256 newElectionId =
            electionCount;

        elections[newElectionId] =
            Election({
                id: newElectionId,
                name: _name,
                status: NOT_STARTED,
                candidateCount: 0
            });

        currentElectionId =
            newElectionId;

        emit ElectionCreated(
            newElectionId,
            _name
        );

        return newElectionId;
    }

    // =====================================================
    // GET CURRENT ELECTION
    // =====================================================

    function getCurrentElection()
        public
        view
        returns (
            uint256 id,
            string memory name,
            uint8 status,
            uint256 candidateCount
        )
    {
        require(
            electionCount > 0,
            "No election exists"
        );

        Election memory election =
            elections[currentElectionId];

        return (
            election.id,
            election.name,
            election.status,
            election.candidateCount
        );
    }

    // =====================================================
    // GET ELECTION
    // =====================================================

    function getElection(
        uint256 _electionId
    )
        public
        view
        returns (
            uint256 id,
            string memory name,
            uint8 status,
            uint256 candidateCount
        )
    {
        require(
            _electionId > 0 &&
            _electionId <= electionCount,
            "Invalid election"
        );

        Election memory election =
            elections[_electionId];

        return (
            election.id,
            election.name,
            election.status,
            election.candidateCount
        );
    }

    // =====================================================
    // REGISTER VOTER
    // =====================================================

    function registerVoter(
        address _voter
    )
        public
        onlyAdmin
    {
        require(
            electionCount > 0,
            "Create election first"
        );

        require(
            elections[currentElectionId].status ==
                NOT_STARTED,
            "Cannot register voter now"
        );

        require(
            _voter != address(0),
            "Invalid voter address"
        );

        registeredVoters[
            currentElectionId
        ][_voter] = true;

        emit VoterRegistered(
            currentElectionId,
            _voter
        );
    }

    // =====================================================
    // CHECK VOTER REGISTRATION
    // =====================================================

    function isRegisteredVoter(
        address _voter
    )
        public
        view
        returns (bool)
    {
        return
            registeredVoters[
                currentElectionId
            ][_voter];
    }

    // =====================================================
    // ADD CANDIDATE
    // =====================================================

    function addCandidate(
        string memory _name,
        string memory _party
    )
        public
        onlyAdmin
    {
        require(
            electionCount > 0,
            "Create election first"
        );

        require(
            elections[currentElectionId].status ==
                NOT_STARTED,
            "Cannot add candidate now"
        );

        require(
            bytes(_name).length > 0,
            "Candidate name required"
        );

        require(
            bytes(_party).length > 0,
            "Party name required"
        );

        uint256 candidateId =
            elections[currentElectionId]
                .candidateCount;

        candidates[
            currentElectionId
        ][candidateId] =
            Candidate({
                id: candidateId,
                name: _name,
                party: _party,
                voteCount: 0
            });

        elections[currentElectionId]
            .candidateCount++;

        emit CandidateAdded(
            currentElectionId,
            candidateId,
            _name,
            _party
        );
    }

    // =====================================================
    // GET CANDIDATE COUNT
    // =====================================================

    function getCandidateCount()
        public
        view
        returns (uint256)
    {
        if (electionCount == 0) {
            return 0;
        }

        return
            elections[currentElectionId]
                .candidateCount;
    }

    // =====================================================
    // GET CANDIDATE
    // =====================================================

    function getCandidate(
        uint256 _id
    )
        public
        view
        returns (
            uint256 id,
            string memory name,
            string memory party,
            uint256 voteCount
        )
    {
        require(
            electionCount > 0,
            "No election exists"
        );

        require(
            _id <
                elections[currentElectionId]
                    .candidateCount,
            "Invalid candidate"
        );

        Candidate memory candidate =
            candidates[
                currentElectionId
            ][_id];

        return (
            candidate.id,
            candidate.name,
            candidate.party,
            candidate.voteCount
        );
    }

    // =====================================================
    // START ELECTION
    // =====================================================

    function startElection()
        public
        onlyAdmin
    {
        require(
            electionCount > 0,
            "Create election first"
        );

        require(
            elections[currentElectionId].status ==
                NOT_STARTED,
            "Election cannot be started"
        );

        require(
            elections[currentElectionId]
                .candidateCount > 0,
            "Add candidates first"
        );

        elections[currentElectionId]
            .status = ACTIVE;

        emit ElectionStarted(
            currentElectionId
        );
    }

    // =====================================================
    // END ELECTION
    // =====================================================

    function endElection()
        public
        onlyAdmin
    {
        require(
            electionCount > 0,
            "No election exists"
        );

        require(
            elections[currentElectionId].status ==
                ACTIVE,
            "Election is not active"
        );

        elections[currentElectionId]
            .status = CLOSED;

        emit ElectionEnded(
            currentElectionId
        );
    }

    // =====================================================
    // GET STATUS
    // =====================================================

    function getElectionStatus()
        public
        view
        returns (uint8)
    {
        if (electionCount == 0) {
            return NOT_STARTED;
        }

        return
            elections[currentElectionId]
                .status;
    }

    // =====================================================
    // VOTE
    // =====================================================

    function vote(
        uint256 _candidateId
    )
        public
    {
        require(
            electionCount > 0,
            "No election exists"
        );

        require(
            elections[currentElectionId].status ==
                ACTIVE,
            "Election is not active"
        );

        require(
            registeredVoters[
                currentElectionId
            ][msg.sender],
            "Voter not registered"
        );

        require(
            !voterHasVoted[
                currentElectionId
            ][msg.sender],
            "Already voted"
        );

        require(
            _candidateId <
                elections[currentElectionId]
                    .candidateCount,
            "Invalid candidate"
        );

        voterHasVoted[
            currentElectionId
        ][msg.sender] = true;

        voterChoice[
            currentElectionId
        ][msg.sender] = _candidateId;

        candidates[
            currentElectionId
        ][_candidateId].voteCount++;

        emit VoteCast(
            currentElectionId,
            msg.sender,
            _candidateId
        );
    }

    // =====================================================
    // CHECK HAS VOTED
    // =====================================================

    function hasVoted(
        address _voter
    )
        public
        view
        returns (bool)
    {
        return
            voterHasVoted[
                currentElectionId
            ][_voter];
    }

    // =====================================================
    // GET VOTER'S CHOICE
    // =====================================================

    function getVoterChoice(
        address _voter
    )
        public
        view
        returns (uint256)
    {
        require(
            voterHasVoted[
                currentElectionId
            ][_voter],
            "Voter has not voted"
        );

        return
            voterChoice[
                currentElectionId
            ][_voter];
    }
}