import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // Use your LATEST deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [admin] = await ethers.getSigners();

  console.log("👑 Admin:", admin.address);
  console.log("📜 Contract:", contractAddress);

  const votingSystem = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  // Check current status
  const beforeStatus = await votingSystem.getElectionStatus();

  console.log("\n🔎 Election status BEFORE starting:", beforeStatus.toString());

  console.log("\n🚀 Starting election...");

  const tx = await votingSystem.startElection();

  console.log("⏳ Transaction submitted...");
  console.log("Transaction hash:", tx.hash);

  await tx.wait();

  console.log("✅ Election started successfully!");

  // Check status after starting
  const afterStatus = await votingSystem.getElectionStatus();

  console.log(
    "🟢 Election status AFTER starting:",
    afterStatus.toString()
  );

  console.log("\n🎉 Election is now ACTIVE!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});