import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "NEW_CONTRACT_ADDRESS"; // Use your LATEST deployed contract address

  const votingSystem = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  const [, voterA, voterB, voterC] = await ethers.getSigners();

  console.log("🗳️ Casting votes...\n");

  // Voter A → Alice (Candidate ID 0)
  const txA = await votingSystem
    .connect(voterA)
    .vote(0);

  await txA.wait();
  console.log("✅ Voter A voted for Alice");

  // Voter B → Bob (Candidate ID 1)
  const txB = await votingSystem
    .connect(voterB)
    .vote(1);

  await txB.wait();
  console.log("✅ Voter B voted for Bob");

  // Voter C → Charlie (Candidate ID 2)
  const txC = await votingSystem
    .connect(voterC)
    .vote(2);

  await txC.wait();
  console.log("✅ Voter C voted for Charlie");

  console.log("\n🎉 All votes cast successfully!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
