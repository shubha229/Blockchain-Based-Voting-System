import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // Use your LATEST deployed contract address
  const contractAddress = "NEW_CONTRACT_ADDRESS";

  const [admin, voterA] = await ethers.getSigners();

  console.log("👑 Admin:", admin.address);
  console.log("🗳️ Voter A:", voterA.address);
  console.log("📜 Contract:", contractAddress);

  const votingSystem = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  console.log("\n🔎 Testing election status...");

  const status = await votingSystem.getElectionStatus();

  console.log("Election status:", status.toString());

  console.log("\n🗳️ Voter A is attempting to vote BEFORE election starts...");

  try {
    const tx = await votingSystem
      .connect(voterA)
      .vote(0);

    await tx.wait();

    console.log("❌ ERROR: Vote was unexpectedly accepted!");
  } catch (error) {
    console.log("✅ Vote correctly rejected!");
    console.log("🔒 Voting is not allowed before the election starts.");
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});
