require("dotenv").config();

const { REACT_APP_MNEMONIC, REACT_APP_PROJECT_ID } = process.env;

const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  contracts_build_directory: "./src/contractABIs",

  networks: {
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    //
    // An additional network, but with some advanced options…
    // advanced: {
    //   port: 8777,             // Custom port
    //   network_id: 1342,       // Custom network
    //   gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    //   gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    //   from: <address>,        // Account to send transactions from (default: accounts[0])
    //   websocket: true         // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.

    // goerli: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 5,       // Goerli's id
    //   confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    sepolia: {
      provider: () => new HDWalletProvider(REACT_APP_MNEMONIC, `https://sepolia.infura.io/v3/${REACT_APP_PROJECT_ID}`),
      network_id: 11155111, // Sepolia's network ID
      chain_id: 11155111,
      gas: 4000000, // Adjust the gas limit as per your requirements
      gasPrice: 10000000000, // Set the gas price to an appropriate value
      confirmations: 2, // Set the number of confirmations needed for a transaction
      timeoutBlocks: 200, // Set the timeout for transactions
      skipDryRun: true, // Skip the dry run option
      networkCheckTimeout: 10000,
    },

    // Useful for private networks
    // private: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://network.io`),
    //   network_id: 2111,   // This network is yours, in the cloud.
    //   production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        // evmVersion: "byzantium",
      },
    },
  },

  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
