import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // Latest deployed contract address
  const contractAddress =
    "NEW_CONTRACT_ADDRESS";

  const votingSystem = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  console.log("\n📊 ELECTION RESULTS");
  console.log("==============================");

  // Get election status
  const status = await votingSystem.getElectionStatus();

  console.log("Election status:", status.toString());

  // Results should be checked only after election is closed
  if (status.toString() !== "2") {
    console.log("⚠️ Election is not closed yet.");
    console.log("Please end the election first.");
    return;
  }

  console.log("🔒 Election is CLOSED.");
  console.log("");

  // Get total candidates
  const candidateCount = await votingSystem.getCandidateCount();

  console.log("Total candidates:", candidateCount.toString());
  console.log("");

  let highestVotes = -1n;

  const winners: {
    name: string;
    party: string;
    votes: bigint;
  }[] = [];

  // Display every candidate
  for (let i = 0; i < Number(candidateCount); i++) {
    const candidate = await votingSystem.getCandidate(i);

    const id = candidate.id;
    const name = candidate.name;
    const party = candidate.party;
    const voteCount = candidate.voteCount;

    console.log(`🗳️ Candidate ${Number(id) + 1}`);
    console.log(`   👤 Name: ${name}`);
    console.log(`   🏛️ Party: ${party}`);
    console.log(`   🗳️ Votes: ${voteCount.toString()}`);
    console.log("------------------------------");

    // New highest vote count
    if (voteCount > highestVotes) {
      highestVotes = voteCount;

      winners.length = 0;

      winners.push({
        name,
        party,
        votes: voteCount,
      });
    }

    // Same vote count = tie
    else if (voteCount === highestVotes) {
      winners.push({
        name,
        party,
        votes: voteCount,
      });
    }
  }

  console.log("");

  // No candidates
  if (winners.length === 0) {
    console.log("⚠️ No candidates found.");
    return;
  }

  // Tie
  if (winners.length > 1) {
    console.log("🤝 ELECTION RESULT: TIE");
    console.log("==============================");

    console.log(
      `Multiple candidates received ${highestVotes.toString()} vote(s):`
    );

    console.log("");

    winners.forEach((winner, index) => {
      console.log(`🔹 ${index + 1}. ${winner.name}`);
      console.log(`   🏛️ Party: ${winner.party}`);
      console.log(`   🗳️ Votes: ${winner.votes.toString()}`);
    });

    console.log("");
    console.log("⚠️ No single winner.");
    console.log("A tie-breaking process is required.");
  }

  // Single winner
  else {
    const winner = winners[0];

    console.log("🏆 ELECTION WINNER");
    console.log("==============================");
    console.log("👤 Name:", winner.name);
    console.log("🏛️ Party:", winner.party);
    console.log("🗳️ Votes:", winner.votes.toString());
    console.log("==============================");
    console.log("🎉 Congratulations to the winner!");
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
