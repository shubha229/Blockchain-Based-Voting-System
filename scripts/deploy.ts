import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  console.log("🚀 Deploying VotingSystem...");

  const VotingSystem =
    await ethers.getContractFactory(
      "VotingSystem"
    );

  const votingSystem =
    await VotingSystem.deploy();

  await votingSystem.waitForDeployment();

  const address =
    await votingSystem.getAddress();

  console.log(
    "✅ VotingSystem deployed!"
  );

  console.log(
    "📜 Contract:",
    address
  );

  const [admin] =
    await ethers.getSigners();

  console.log(
    "👑 Admin:",
    admin.address
  );

  console.log(
    "\nIMPORTANT:"
  );

  console.log(
    "Update CONTRACT_ADDRESS in frontend/src/contract.ts"
  );

  console.log(
    "with:",
    address
  );
}

main().catch((error) => {
  console.error(
    "❌ Deployment failed:"
  );

  console.error(error);

  process.exitCode = 1;
});