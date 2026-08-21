import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // Use the SAME contract address from your latest deployment
  const contractAddress = "NEW_CONTRACT_ADDRESS";

  const [admin, voterA, voterB, voterC] = await ethers.getSigners();

  console.log("👑 Admin:", admin.address);
  console.log("📜 Contract:", contractAddress);

  console.log("\n👥 Test Voter Addresses:");
  console.log("Voter A:", voterA.address);
  console.log("Voter B:", voterB.address);
  console.log("Voter C:", voterC.address);

  const votingSystem = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  // --------------------------------------------------
  // VOTER REGISTRATION
  // --------------------------------------------------

  console.log("\n👥 Registering voters...\n");

  let tx = await votingSystem.registerVoter(voterA.address);
  await tx.wait();
  console.log("✅ Voter A registered:", voterA.address);

  tx = await votingSystem.registerVoter(voterB.address);
  await tx.wait();
  console.log("✅ Voter B registered:", voterB.address);

  tx = await votingSystem.registerVoter(voterC.address);
  await tx.wait();
  console.log("✅ Voter C registered:", voterC.address);

  console.log("\n🎉 All 3 voters registered successfully!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
