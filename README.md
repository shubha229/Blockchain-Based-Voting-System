# 🗳️ Blockchain-Based Voting System

A decentralized voting application built using **Solidity, Hardhat, React, TypeScript, and Ethers.js**.

The system uses smart contracts to manage elections, candidates, voters, and votes on the blockchain, providing a transparent and tamper-resistant voting process.

---

## 🚀 Features

### 👤 Voter Features

- Connect wallet using MetaMask
- Register as a voter
- View available elections
- View election status
- Cast a vote securely through the blockchain
- Prevent multiple voting in the same election
- View voting results
- View election winner

### 👨‍💼 Admin Features

- Admin-controlled election management
- Start an election
- End an election
- Add candidates
- Register voters
- Manage election-related actions
- View election information and results

### 🗳️ Election Features

- Support for multiple elections
- Election-specific candidates
- Election status tracking
- Blockchain-based vote counting
- Winner detection
- Tie detection
- Early voting support
- Blockchain transaction records

### 🔐 Blockchain Features

- Smart-contract-based vote recording
- Transparent vote counting
- Tamper-resistant data
- Wallet-based authentication
- Decentralized transaction processing

---

## 📸 Screenshots

### 1. Initial Dashboard
<img width="1600" height="797" alt="image" src="https://github.com/user-attachments/assets/7956235f-b492-447e-89cb-99f7b9da4278" />

### 2. Creating an Election
<img width="1600" height="794" alt="image" src="https://github.com/user-attachments/assets/43875359-5b2d-40a0-ae82-6fa258587d76" />

### 3. Voter Registration
<img width="1413" height="906" alt="image" src="https://github.com/user-attachments/assets/432136f7-1d33-481f-b468-c0aebbf13bd1" />

### 4. Selecting a Voter Account
<img width="1600" height="761" alt="image" src="https://github.com/user-attachments/assets/5f3ffb4f-a672-4caf-9f29-0dbd3845d510" />

### 5. Adding a Candidate
<img width="1600" height="807" alt="image" src="https://github.com/user-attachments/assets/8283a483-64ea-4a9a-8849-10ca4eba85a0" />

### 6. Candidate Registration Transaction
<img width="1600" height="800" alt="image" src="https://github.com/user-attachments/assets/49770694-e644-4ec9-9c78-387035e812ea" />

### 7. Election with Candidates
<img width="1423" height="918" alt="image" src="https://github.com/user-attachments/assets/e61fb9f7-1dbb-4f72-8b57-d8e20dd2fd83" />

### 8. Election Started
<img width="1600" height="763" alt="image" src="https://github.com/user-attachments/assets/6aa2bc34-6ee6-4c43-aee4-4c7ab41776d9" />

### 9. Vote Successfully Recorded
<img width="1600" height="759" alt="image" src="https://github.com/user-attachments/assets/585fd5e9-9c91-48f8-8adf-4db03527acf9" />

### 10. Ending the Election
<img width="1600" height="797" alt="image" src="https://github.com/user-attachments/assets/f4e28761-a5ab-4c7a-be52-610e3123b692" />

### 11. Final Election Results & Winner
<img width="1600" height="766" alt="image" src="https://github.com/user-attachments/assets/3206236d-ca32-497e-bdd3-235b3ca163fb" />

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Blockchain

- Solidity
- Hardhat 3
- Ethers.js
- Ethereum-compatible network
- MetaMask

### Development

- Node.js
- TypeScript
- Mocha
- Hardhat testing tools

---

## 📁 Project Structure

```text
Blockchain-Based-Voting-System/
│
├── contracts/
│   └── VotingSystem.sol
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.tsx
│       ├── App.css
│       ├── contract.ts
│       ├── index.css
│       └── main.tsx
│
├── ignition/
│   └── modules/
│       └── Counter.ts
│
├── scripts/
│   ├── addCandidates.ts
│   ├── adminActions.ts
│   ├── castVotes.ts
│   ├── deploy.ts
│   ├── earlyVoteTest.ts
│   ├── endElection.ts
│   ├── getResults.ts
│   └── startElection.ts
│
├── types/
│   └── ethers-contracts/
│
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/shubha229/Blockchain-Based-Voting-System.git
```

Navigate into the project:

```bash
cd Blockchain-Based-Voting-System
```

Install blockchain dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

---

## 🔨 Compile the Smart Contract

From the project root:

```bash
npx hardhat compile
```

This compiles `VotingSystem.sol` and generates the required contract artifacts and TypeScript typings.

---

## 🚀 Deploy the Smart Contract

Run the deployment script:

```bash
npx hardhat run scripts/deploy.ts
```

After deployment, copy the deployed contract address into:

```text
frontend/src/contract.ts
```

Update:

```typescript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

---

## 💻 Run the Frontend

Navigate to the frontend:

```bash
cd frontend
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

---

## 🦊 MetaMask

The application requires a Web3 wallet such as **MetaMask**.

Before interacting with the application:

1. Install MetaMask.
2. Connect your wallet.
3. Select the same blockchain network where the contract was deployed.
4. Make sure the wallet has sufficient funds for transaction gas fees.
5. Connect the wallet from the application.

---

## 🔄 Application Flow

```text
Admin
  │
  ├── Start Election
  │
  ├── Add Candidates
  │
  ├── Register Voters
  │
  ▼
Election Active
  │
  ├── Voter connects wallet
  │
  ├── Voter selects candidate
  │
  ├── Vote transaction
  │
  ▼
Blockchain
  │
  ├── Vote recorded
  ├── Vote count updated
  └── Duplicate voting prevented
  │
  ▼
Election Ends
  │
  ├── Results calculated
  ├── Winner determined
  
```

---

## 🏗️ Smart Contract

The main smart contract is:

```text
contracts/VotingSystem.sol
```

The smart contract handles the core voting logic, including:

- Election management
- Candidate management
- Voter management
- Vote recording
- Vote counting
- Election results
- Winner and tie detection

---

## 📜 Available Scripts

| Script | Purpose |
|---|---|
| `deploy.ts` | Deploy the voting smart contract |
| `addCandidates.ts` | Add candidates |
| `adminActions.ts` | Perform administrative actions |
| `castVotes.ts` | Cast votes |
| `earlyVoteTest.ts` | Test early voting functionality |
| `startElection.ts` | Start an election |
| `endElection.ts` | End an election |
| `getResults.ts` | Retrieve election results |

Run a script using:

```bash
npx hardhat run scripts/<script-name>.ts
```

Example:

```bash
npx hardhat run scripts/getResults.ts
```

---

## 🔒 Security & Integrity

The system is designed around blockchain-based verification:

- Votes are recorded through smart-contract transactions.
- Wallet addresses are used to identify voters.
- Voting restrictions are enforced by the smart contract.
- Vote counts are maintained on-chain.
- Election results are calculated from blockchain data.
- Administrative operations are restricted to the designated administrator.

---

## 📊 Results

After an election ends, the application can display:

- Candidate names
- Vote counts
- Election results
- Winner
- Tie information when applicable

---

## 🎯 Future Improvements

- Election scheduling
- Real-time event notifications
- Detailed blockchain transaction history
- Enhanced admin dashboard
- Improved accessibility and mobile experience

---

## 👩‍💻 Author

**Shubhashree Baburaya Nayak**

GitHub:

https://github.com/shubha229

---

## 📄 License

This project is developed for educational and demonstration purposes.
