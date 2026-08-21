import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { ethers } from "ethers";

import "./index.css";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "./contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type Candidate = {
  id: bigint;
  name: string;
  party: string;
  voteCount: bigint;
};

enum ElectionStatus {
  NOT_STARTED = 0,
  ACTIVE = 1,
  CLOSED = 2,
}

function App() {
  // =====================================================
  // STATE
  // =====================================================

  const [contract, setContract] =
    useState<ethers.Contract | null>(null);

  const [account, setAccount] =
    useState<string>("");

  const [admin, setAdmin] =
    useState<string>("");

  const [electionId, setElectionId] =
    useState<bigint | null>(null);

  const [electionName, setElectionName] =
    useState<string>("");

  const [electionStatus, setElectionStatus] =
    useState<ElectionStatus>(
      ElectionStatus.NOT_STARTED
    );

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [hasVoted, setHasVoted] =
    useState<boolean>(false);

  const [isRegistered, setIsRegistered] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [message, setMessage] =
    useState<string>("");

  // =====================================================
  // FORM STATES
  // =====================================================

  const [newElectionName, setNewElectionName] =
    useState<string>("");

  const [candidateName, setCandidateName] =
    useState<string>("");

  const [candidateParty, setCandidateParty] =
    useState<string>("");

  const [voterAddress, setVoterAddress] =
    useState<string>("");

  // =====================================================
  // CONNECT WALLET
  // =====================================================

  const connectWallet =
    useCallback(async () => {
      try {
        if (!window.ethereum) {
          setError(
            "Please install MetaMask."
          );
          return;
        }

        const provider =
          new ethers.BrowserProvider(
            window.ethereum
          );

        await provider.send(
          "eth_requestAccounts",
          []
        );

        const signer =
          await provider.getSigner();

        const address =
          await signer.getAddress();

        const votingContract =
          new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );

        setAccount(address);
        setContract(votingContract);
        setError("");
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Unable to connect wallet."
        );
      }
    }, []);

  // =====================================================
  // LOAD ELECTION DATA
  // =====================================================

  const loadElectionData =
    useCallback(async () => {
      try {
        if (!contract || !account) {
          return;
        }

        setError("");

        // -------------------------------------------------
        // ADMIN
        // -------------------------------------------------

        const adminAddress =
          await contract.getFunction(
            "admin"
          )();

        setAdmin(
          String(adminAddress)
        );

        // -------------------------------------------------
        // ELECTION COUNT
        // -------------------------------------------------

        const totalElections =
          await contract.getFunction(
            "electionCount"
          )();

        if (
          Number(totalElections) === 0
        ) {
          setElectionId(null);
          setElectionName("");
          setElectionStatus(
            ElectionStatus.NOT_STARTED
          );
          setCandidates([]);
          setHasVoted(false);
          setIsRegistered(false);

          return;
        }

        // -------------------------------------------------
        // CURRENT ELECTION
        // -------------------------------------------------

        const currentElection =
          await contract.getFunction(
            "getCurrentElection"
          )();

        setElectionId(
          BigInt(currentElection[0])
        );

        setElectionName(
          String(currentElection[1])
        );

        setElectionStatus(
          Number(
            currentElection[2]
          ) as ElectionStatus
        );

        // -------------------------------------------------
        // CANDIDATES
        // -------------------------------------------------

        const candidateCount =
          Number(currentElection[3]);

        const loadedCandidates: Candidate[] =
          [];

        for (
          let i = 0;
          i < candidateCount;
          i++
        ) {
          const candidate =
            await contract.getFunction(
              "getCandidate"
            )(i);

          loadedCandidates.push({
            id: BigInt(candidate[0]),
            name: String(candidate[1]),
            party: String(candidate[2]),
            voteCount:
              BigInt(candidate[3]),
          });
        }

        setCandidates(
          loadedCandidates
        );

        // -------------------------------------------------
        // HAS VOTED
        // -------------------------------------------------

        const voted =
          await contract.getFunction(
            "hasVoted"
          )(account);

        setHasVoted(
          Boolean(voted)
        );

        // -------------------------------------------------
        // REGISTERED
        // -------------------------------------------------

        const registered =
          await contract.getFunction(
            "isRegisteredVoter"
          )(account);

        setIsRegistered(
          Boolean(registered)
        );
      } catch (err: any) {
        console.error(
          "Load election error:",
          err
        );

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Unable to load election data."
        );
      }
    }, [contract, account]);

  // =====================================================
  // INITIAL CONNECTION
  // =====================================================

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  // =====================================================
  // LOAD DATA AFTER CONNECTION
  // =====================================================

  useEffect(() => {
    if (
      contract &&
      account
    ) {
      loadElectionData();
    }
  }, [
    contract,
    account,
    loadElectionData,
  ]);

  // =====================================================
  // METAMASK ACCOUNT CHANGE
  // =====================================================

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged =
      (accounts: string[]) => {
        if (
          !accounts ||
          accounts.length === 0
        ) {
          setAccount("");
          setContract(null);
          setAdmin("");
          setHasVoted(false);
          setIsRegistered(false);

          return;
        }

        connectWallet();
      };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, [connectWallet]);

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const isAdmin =
    account !== "" &&
    admin !== "" &&
    account.toLowerCase() ===
      admin.toLowerCase();

  // =====================================================
  // CREATE ELECTION
  // =====================================================

  const createElection =
    async () => {
      try {
        if (!contract) {
          setError(
            "Wallet is not connected."
          );
          return;
        }

        if (!isAdmin) {
          setError(
            "Only the admin can create an election."
          );
          return;
        }

        if (
          !newElectionName.trim()
        ) {
          setError(
            "Please enter an election name."
          );
          return;
        }

        if (
          electionId !== null &&
          electionStatus !==
            ElectionStatus.CLOSED
        ) {
          setError(
            "The current election must be closed first."
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const tx =
          await contract.getFunction(
            "createElection"
          )(
            newElectionName.trim()
          );

        setMessage(
          "⏳ Creating election..."
        );

        await tx.wait();

        setMessage(
          "✅ New election created successfully!"
        );

        setNewElectionName("");

        await loadElectionData();
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Failed to create election."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // REGISTER VOTER
  // =====================================================

  const registerVoter =
    async () => {
      try {
        if (!contract) {
          setError(
            "Wallet is not connected."
          );
          return;
        }

        if (!isAdmin) {
          setError(
            "Only the admin can register voters."
          );
          return;
        }

        if (
          !ethers.isAddress(
            voterAddress.trim()
          )
        ) {
          setError(
            "Please enter a valid MetaMask address."
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const validAddress =
          ethers.getAddress(
            voterAddress.trim()
          );

        const tx =
          await contract.getFunction(
            "registerVoter"
          )(
            validAddress
          );

        setMessage(
          "⏳ Registering voter..."
        );

        await tx.wait();

        setMessage(
          "✅ Voter registered successfully!"
        );

        setVoterAddress("");
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Failed to register voter."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // ADD CANDIDATE
  // =====================================================

  const addCandidate =
    async () => {
      try {
        if (!contract) {
          setError(
            "Wallet is not connected."
          );
          return;
        }

        if (!isAdmin) {
          setError(
            "Only the admin can add candidates."
          );
          return;
        }

        if (
          !candidateName.trim()
        ) {
          setError(
            "Please enter candidate name."
          );
          return;
        }

        if (
          !candidateParty.trim()
        ) {
          setError(
            "Please enter party name."
          );
          return;
        }

        if (
          electionStatus !==
          ElectionStatus.NOT_STARTED
        ) {
          setError(
            "Candidates can only be added before the election starts."
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const tx =
          await contract.getFunction(
            "addCandidate"
          )(
            candidateName.trim(),
            candidateParty.trim()
          );

        setMessage(
          "⏳ Adding candidate..."
        );

        await tx.wait();

        setMessage(
          "✅ Candidate added successfully!"
        );

        setCandidateName("");
        setCandidateParty("");

        await loadElectionData();
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Failed to add candidate."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // START ELECTION
  // =====================================================

  const startElection =
    async () => {
      try {
        if (!contract) {
          setError(
            "Wallet is not connected."
          );
          return;
        }

        if (!isAdmin) {
          setError(
            "Only the admin can start the election."
          );
          return;
        }

        if (
          candidates.length === 0
        ) {
          setError(
            "Add at least one candidate before starting."
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const tx =
          await contract.getFunction(
            "startElection"
          )();

        setMessage(
          "⏳ Starting election..."
        );

        await tx.wait();

        setMessage(
          "🚀 Election started successfully!"
        );

        await loadElectionData();
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Failed to start election."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // END ELECTION
  // =====================================================

  const endElection =
    async () => {
      try {
        if (!contract) {
          setError(
            "Wallet is not connected."
          );
          return;
        }

        if (!isAdmin) {
          setError(
            "Only the admin can end the election."
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const tx =
          await contract.getFunction(
            "endElection"
          )();

        setMessage(
          "⏳ Ending election..."
        );

        await tx.wait();

        setMessage(
          "🔒 Election ended successfully!"
        );

        await loadElectionData();
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Failed to end election."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // VOTE
  // =====================================================

  const vote =
    async (
      candidateId: bigint
    ) => {
      try {
        if (!contract) {
          setError(
            "Wallet is not connected."
          );
          return;
        }

        if (
          electionStatus !==
          ElectionStatus.ACTIVE
        ) {
          setError(
            "Election is not active."
          );
          return;
        }

        if (!isRegistered) {
          setError(
            "You are not registered for this election."
          );
          return;
        }

        if (hasVoted) {
          setError(
            "You have already voted."
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const tx =
          await contract.getFunction(
            "vote"
          )(
            candidateId
          );

        setMessage(
          "⏳ Confirming your vote..."
        );

        await tx.wait();

        setHasVoted(true);

        setMessage(
          "✅ Your vote was recorded successfully!"
        );

        await loadElectionData();
      } catch (err: any) {
        console.error(err);

        setError(
          err?.shortMessage ||
            err?.reason ||
            err?.message ||
            "Voting failed."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusText =
    () => {
      if (
        electionStatus ===
        ElectionStatus.ACTIVE
      ) {
        return "ACTIVE";
      }

      if (
        electionStatus ===
        ElectionStatus.CLOSED
      ) {
        return "CLOSED";
      }

      return "NOT STARTED";
    };

  // =====================================================
  // WINNER CALCULATION
  // =====================================================

  const highestVotes =
    candidates.length > 0
      ? candidates.reduce(
          (
            highest,
            candidate
          ) =>
            candidate.voteCount >
            highest
              ? candidate.voteCount
              : highest,
          0n
        )
      : 0n;

  const winners =
    candidates.filter(
      (candidate) =>
        candidate.voteCount ===
        highestVotes
    );

  const hasWinner =
    winners.length === 1 &&
    highestVotes > 0n;

  const isTie =
    winners.length > 1 &&
    highestVotes > 0n;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-logo">
            🗳️
          </div>

          <div>
            <h2>
              VoteChain
            </h2>

            <span>
              Blockchain Voting System
            </span>
          </div>

        </div>

        <div className="wallet">

          {account ? (
            <>
              <span>
                {account.slice(0, 6)}
                ...
                {account.slice(-4)}
              </span>

              {isAdmin && (
                <strong className="admin-badge">
                  ADMIN
                </strong>
              )}
            </>
          ) : (
            <button
              className="connect-btn"
              onClick={
                connectWallet
              }
            >
              Connect Wallet
            </button>
          )}

        </div>

      </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-left">

          <div className="eyebrow">
            🔒 SECURE • DECENTRALIZED •
            TRANSPARENT
          </div>

          <h1>
            Your Vote.
            <br />

            <span>
              On the Blockchain.
            </span>
          </h1>

          <p>
            A secure, transparent and
            tamper-resistant voting
            system powered by Ethereum
            smart contracts.
          </p>

          <div className="hero-actions">

            <button
              className="refresh-btn"
              onClick={
                loadElectionData
              }
              disabled={loading}
            >
              🔄 Refresh Election
            </button>

            <span
              className={
                electionStatus ===
                ElectionStatus.ACTIVE
                  ? "status active"
                  : electionStatus ===
                    ElectionStatus.CLOSED
                  ? "status closed"
                  : "status pending"
              }
            >
              ● {getStatusText()}
            </span>

          </div>

        </div>

        <div className="hero-card">

          <div className="chain-icon">
            ⛓️
          </div>

          <h3>
            {electionName ||
              "No Election"}
          </h3>

          <p>
            {electionId
              ? `Election #${electionId.toString()}`
              : "Create an election to begin."}
          </p>

        </div>

      </section>

      {/* =================================================
          ADMIN PANEL
      ================================================= */}

      {isAdmin && (
        <section className="admin-panel">

          <span className="admin-label">
            👑 ADMIN CONTROL
          </span>

          <h2>
            Election Management
          </h2>

          <p>
            Manage elections, candidates
            and registered voters.
          </p>

          {/* -----------------------------------------------
              CREATE FIRST ELECTION
          ----------------------------------------------- */}

          {electionId === null && (

            <div className="admin-management-box">

              <div>
                <span className="admin-label">
                  🗳️ CREATE ELECTION
                </span>

                <h3>
                  Create Your First Election
                </h3>
              </div>

              <div className="management-form">

                <input
                  type="text"
                  placeholder="Election name"
                  value={
                    newElectionName
                  }
                  onChange={(e) =>
                    setNewElectionName(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  className="add-candidate-btn"
                  onClick={
                    createElection
                  }
                  disabled={loading}
                >
                  🗳️ Create Election
                </button>

              </div>

            </div>

          )}

          {/* -----------------------------------------------
              CREATE NEXT ELECTION
          ----------------------------------------------- */}

          {electionId !== null &&
            electionStatus ===
              ElectionStatus.CLOSED && (

            <div className="admin-management-box">

              <div>
                <span className="admin-label">
                  🆕 NEW ELECTION
                </span>

                <h3>
                  Create Another Election
                </h3>

                <p>
                  Previous election results
                  remain stored on-chain.
                </p>
              </div>

              <div className="management-form">

                <input
                  type="text"
                  placeholder="New election name"
                  value={
                    newElectionName
                  }
                  onChange={(e) =>
                    setNewElectionName(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  className="add-candidate-btn"
                  onClick={
                    createElection
                  }
                  disabled={loading}
                >
                  🆕 Create Election
                </button>

              </div>

            </div>

          )}

          {/* -----------------------------------------------
              REGISTER VOTER
          ----------------------------------------------- */}

          {electionId !== null &&
            electionStatus ===
              ElectionStatus.NOT_STARTED && (

            <div className="admin-management-box">

              <div>
                <span className="admin-label">
                  👤 VOTER MANAGEMENT
                </span>

                <h3>
                  Register Voter
                </h3>

                <p>
                  Register a MetaMask
                  address for this election.
                </p>
              </div>

              <div className="management-form">

                <input
                  type="text"
                  placeholder="0x... voter wallet address"
                  value={
                    voterAddress
                  }
                  onChange={(e) =>
                    setVoterAddress(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  className="register-voter-btn"
                  onClick={
                    registerVoter
                  }
                  disabled={loading}
                >
                  👤 Register Voter
                </button>

              </div>

            </div>

          )}

          {/* -----------------------------------------------
              ADD CANDIDATE
          ----------------------------------------------- */}

          {electionId !== null &&
            electionStatus ===
              ElectionStatus.NOT_STARTED && (

            <div className="admin-management-box">

              <div>
                <span className="admin-label">
                  ➕ CANDIDATE MANAGEMENT
                </span>

                <h3>
                  Add Candidate
                </h3>

                <p>
                  Add candidates before
                  starting this election.
                </p>
              </div>

              <div className="management-form">

                <input
                  type="text"
                  placeholder="Candidate name"
                  value={
                    candidateName
                  }
                  onChange={(e) =>
                    setCandidateName(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <input
                  type="text"
                  placeholder="Party"
                  value={
                    candidateParty
                  }
                  onChange={(e) =>
                    setCandidateParty(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  className="add-candidate-btn"
                  onClick={
                    addCandidate
                  }
                  disabled={loading}
                >
                  ➕ Add Candidate
                </button>

              </div>

            </div>

          )}

          {/* -----------------------------------------------
              START
          ----------------------------------------------- */}

          {electionId !== null &&
            electionStatus ===
              ElectionStatus.NOT_STARTED && (

            <button
              className="start-btn"
              onClick={
                startElection
              }
              disabled={
                loading ||
                candidates.length === 0
              }
            >
              🚀 Start Election
            </button>

          )}

          {/* -----------------------------------------------
              END
          ----------------------------------------------- */}

          {electionStatus ===
            ElectionStatus.ACTIVE && (

            <button
              className="end-btn"
              onClick={
                endElection
              }
              disabled={loading}
            >
              🔒 End Election
            </button>

          )}

        </section>
      )}

      {/* =================================================
          MESSAGES
      ================================================= */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <section className="stats">

        <div className="stat-card">

          <span>
            🗳️
          </span>

          <small>
            ELECTION
          </small>

          <strong>
            {electionName ||
              "None"}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            🔢
          </span>

          <small>
            ELECTION ID
          </small>

          <strong>
            {electionId
              ? `#${electionId.toString()}`
              : "-"}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            👥
          </span>

          <small>
            CANDIDATES
          </small>

          <strong>
            {candidates.length}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            🔐
          </span>

          <small>
            YOUR STATUS
          </small>

          <strong>
            {hasVoted
              ? "VOTED"
              : isRegistered
              ? "REGISTERED"
              : "NOT REGISTERED"}
          </strong>

        </div>

      </section>

      {/* =================================================
          ELECTION
      ================================================= */}

      <section className="election-section">

        <div className="section-heading">

          <span>
            ELECTION #
            {electionId
              ? electionId.toString()
              : "-"}
          </span>

          <h2>
            {electionName ||
              "No Election Created"}
          </h2>

          {electionStatus ===
            ElectionStatus.ACTIVE &&
            !isRegistered && (

            <p className="error-text">
              ⚠️ Your wallet is not
              registered for this election.
            </p>

          )}

          {electionStatus ===
            ElectionStatus.ACTIVE &&
            isRegistered &&
            !hasVoted && (

            <p>
              Select one candidate to
              cast your vote.
            </p>

          )}

          {hasVoted &&
            electionStatus ===
              ElectionStatus.ACTIVE && (

            <p className="voted-text">
              ✅ Your vote has been
              recorded.
            </p>

          )}

          {electionStatus ===
            ElectionStatus.CLOSED && (

            <p>
              🔒 Election closed.
              Final results are shown below.
            </p>

          )}

        </div>

        {/* =================================================
            CANDIDATES
        ================================================= */}

        <div className="candidate-grid">

          {candidates.map(
            (
              candidate,
              index
            ) => (

              <div
                className="candidate-card"
                key={
                  candidate.id.toString()
                }
              >

                <div className="candidate-number">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="candidate-avatar">
                  {candidate.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h3>
                  {candidate.name}
                </h3>

                <p className="party">
                  {candidate.party}
                </p>

                {/* -----------------------------------------
                    VOTE COUNT ONLY AFTER ELECTION CLOSES
                ----------------------------------------- */}

                {electionStatus ===
                  ElectionStatus.CLOSED && (

                  <div className="vote-result">

                    <span>
                      VOTES
                    </span>

                    <strong>
                      {candidate.voteCount.toString()}
                    </strong>

                  </div>

                )}

                {/* -----------------------------------------
                    VOTE BUTTON
                ----------------------------------------- */}

                {electionStatus ===
                  ElectionStatus.ACTIVE && (

                  <button
                    className="vote-btn"
                    disabled={
                      !isRegistered ||
                      hasVoted ||
                      loading
                    }
                    onClick={() =>
                      vote(
                        candidate.id
                      )
                    }
                  >
                    {!isRegistered
                      ? "Not Registered"
                      : hasVoted
                      ? "Already Voted"
                      : loading
                      ? "Processing..."
                      : "Vote →"}
                  </button>

                )}

                {/* -----------------------------------------
                    NOT STARTED
                ----------------------------------------- */}

                {electionStatus ===
                  ElectionStatus.NOT_STARTED && (

                  <button
                    className="disabled-btn"
                    disabled
                  >
                    Election Not Started
                  </button>

                )}

                {/* -----------------------------------------
                    CLOSED
                ----------------------------------------- */}

                {electionStatus ===
                  ElectionStatus.CLOSED && (

                  <button
                    className="disabled-btn"
                    disabled
                  >
                    Election Closed
                  </button>

                )}

              </div>

            )
          )}

          {candidates.length === 0 && (

            <div className="empty-state">

              <span>
                🗳️
              </span>

              <h3>
                No candidates yet
              </h3>

              <p>
                The administrator needs
                to add candidates before
                starting the election.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =================================================
          FINAL RESULTS
      ================================================= */}

      {electionStatus ===
        ElectionStatus.CLOSED && (

        <section className="results-section">

          <div className="section-heading">

            <span>
              FINAL RESULTS
            </span>

            <h2>
              Election Results
            </h2>

          </div>

          <div className="results-grid">

            {candidates.map(
              (
                candidate,
                index
              ) => (

                <div
                  className="result-card"
                  key={
                    candidate.id.toString()
                  }
                >

                  <div className="result-position">
                    #{index + 1}
                  </div>

                  <div>

                    <h3>
                      {candidate.name}
                    </h3>

                    <p>
                      {candidate.party}
                    </p>

                  </div>

                  <strong>
                    {candidate.voteCount.toString()}

                    <small>
                      {" "}
                      votes
                    </small>
                  </strong>

                </div>

              )
            )}

          </div>

        </section>

      )}

      {/* =================================================
          WINNER
      ================================================= */}

      {electionStatus ===
        ElectionStatus.CLOSED &&
        candidates.length > 0 && (

        <section className="winner-section">

          <div className="winner-icon">
            🏆
          </div>

          <div className="winner-content">

            {hasWinner && (
              <>
                <span className="winner-label">
                  ELECTION WINNER
                </span>

                <h2>
                  {winners[0].name}
                </h2>

                <p>
                  {winners[0].party}
                </p>

                <div className="winner-votes">

                  <strong>
                    {winners[0].voteCount.toString()}
                  </strong>

                  <span>
                    votes
                  </span>

                </div>
              </>
            )}

            {isTie && (
              <>
                <span className="winner-label">
                  ELECTION RESULT
                </span>

                <h2>
                  🤝 It's a Tie
                </h2>

                <p>
                  Multiple candidates received
                  the highest number of votes.
                </p>

                <div className="tie-winners">

                  {winners.map(
                    (candidate) => (

                      <div
                        className="tie-candidate"
                        key={
                          candidate.id.toString()
                        }
                      >

                        <strong>
                          {candidate.name}
                        </strong>

                        <span>
                          {candidate.voteCount.toString()}
                          {" "}
                          votes
                        </span>

                      </div>

                    )
                  )}

                </div>
              </>
            )}

            {!hasWinner &&
              !isTie && (

              <>
                <span className="winner-label">
                  ELECTION RESULT
                </span>

                <h2>
                  No Votes Cast
                </h2>

                <p>
                  No candidate received
                  any votes in this election.
                </p>
              </>

            )}

          </div>

        </section>

      )}

      {/* =================================================
          TRUST
      ================================================= */}

      <section className="trust">

        <div className="section-heading">

          <span>
            WHY VOTECHAIN?
          </span>

          <h2>
            Built for Trust.
          </h2>

        </div>

        <div className="trust-grid">

          <div>

            <span>
              🔒
            </span>

            <h3>
              Immutable
            </h3>

            <p>
              Once recorded, votes
              cannot be secretly
              modified.
            </p>

          </div>

          <div>

            <span>
              👁️
            </span>

            <h3>
              Transparent
            </h3>

            <p>
              Election activity can
              be independently verified.
            </p>

          </div>

          <div>

            <span>
              ⚡
            </span>

            <h3>
              Multiple Elections
            </h3>

            <p>
              The administrator can
              create new elections while
              preserving previous results.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default App;