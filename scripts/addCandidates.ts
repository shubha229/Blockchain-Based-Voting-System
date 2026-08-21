import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // Replace this with your CURRENT contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const contract = await ethers.getContractAt(
    "VotingSystem",
    contractAddress
  );

  console.log("Adding candidates...");

  const candidates = [
    { name: "Alice", party: "Group A" },
    { name: "Bob", party: "Group B" },
    { name: "Charlie", party: "Group C" },
  ];

  for (const candidate of candidates) {
    const tx = await contract.addCandidate(
      candidate.name,
      candidate.party
    );

    await tx.wait();

    console.log(
      `✅ Candidate added: ${candidate.name} - ${candidate.party}`
    );
  }

  console.log("🎉 All candidates added successfully!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});