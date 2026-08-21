import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "NEW_CONTRACT_ADDRESS";

  const [admin] = await ethers.getSigners();

  const votingSystem = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  console.log("👑 Admin:", admin.address);

  const statusBefore = await votingSystem.getElectionStatus();

  console.log(
    "🔎 Election status BEFORE ending:",
    statusBefore.toString()
  );

  console.log("\n🛑 Ending election...");

  const tx = await votingSystem.endElection();

  console.log("⏳ Transaction submitted...");
  console.log("Transaction hash:", tx.hash);

  await tx.wait();

  console.log("✅ Election ended successfully!");

  const statusAfter = await votingSystem.getElectionStatus();

  console.log(
    "🔴 Election status AFTER ending:",
    statusAfter.toString()
  );

  console.log("\n🏁 Election is now CLOSED!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
