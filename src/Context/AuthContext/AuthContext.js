import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import toast from "react-hot-toast";
import LoadingSpinner from "../../Pages/Shared/LoadingSpinner/LoadingSpinner";
//import ABI
import constituencyCenter from "../../contractABIs/constituencyCenter.json";
import votersInfo from "../../contractABIs/votersInfo.json";
import candidateInfo from "../../contractABIs/candidatesInfo.json";
import presidingOfficer from "../../contractABIs/presidingOfficerData.json";
import politicalParty from "../../contractABIs/politicalParty.json";

export const authProvider = createContext();

const AuthContext = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loggedPresidingOfficer, setLoggedPresidingOfficer] = useState(null);
  const [isPresidingOfficer, setIsPresidingOfficer] = useState(false);
  const [loggedCenter, setLoggedCenter] = useState(null);
  const [state, setState] = useState({ contract: {} });
  const [isConnected, setIsConnected] = useState(false);
  const [castingProcess, setCastingProcess] = useState(false);

  useEffect(() => {
    const provider =
      window.ethereum != null ? new ethers.providers.Web3Provider(window.ethereum) : new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    const loadContract = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("METAMASK ACCOUNT CONNECTION SUCCESSFUL....!!!");

          const signer = provider.getSigner();

          /**
           * TO CONNECT WITH SMART CONTRACT, NEED TWO THINGS:
           * 1. ABI: have to import from ./src/contractABIs folder. found after migrate smart contract
           * 2. DEPLOYED CONTRACT ADDRESS
           */

          const network = await provider.getNetwork();
          const chain = await network.chainId;
          // console.log(chain);

          //get deployed network
          const deployedNetwork1 = constituencyCenter.networks[chain];
          const deployedNetwork2 = votersInfo.networks[chain];
          const deployedNetwork3 = presidingOfficer.networks[chain];
          const deployedNetwork4 = candidateInfo.networks[chain];
          const deployedNetwork5 = politicalParty.networks[chain];
          // console.log(deployedNetwork1.address);

          // //creating  contract instance
          const constituencyCenterContract = new ethers.Contract(deployedNetwork1.address, constituencyCenter.abi, signer);
          const votersInfoContract = new ethers.Contract(deployedNetwork2.address, votersInfo.abi, signer);
          const presidingOfficerContract = new ethers.Contract(deployedNetwork3.address, presidingOfficer.abi, signer);
          const candidatesInfoContract = new ethers.Contract(deployedNetwork4.address, candidateInfo.abi, signer);
          const politicalPartyContract = new ethers.Contract(deployedNetwork5.address, politicalParty.abi, signer);

          // console.log(constituencyCenterContract);

          setState({
            contract: {
              constituencyCenterContract,
              votersInfoContract,
              presidingOfficerContract,
              candidatesInfoContract,
              politicalPartyContract,
            },
          });

          setIsConnected(true);
        } else {
          console.log("Please Install Metamask!!!");
          alert("Metamask is not Installed...");
          window.location.replace("/smart-voting");
        }
      } catch (error) {
        toast.error("Connection Problem...");
      }
    };

    (admin || isPresidingOfficer || loggedPresidingOfficer || castingProcess) && provider && loadContract();
  }, [admin, isPresidingOfficer, loggedPresidingOfficer, castingProcess]);

  //for admin login
  const adminLogin = (id, pass) => {
    if (id === process.env.REACT_APP_ADMIN_ID && pass === process.env.REACT_APP_ADMIN_PASS) {
      return true;
    }
  };

  if ((admin || isPresidingOfficer) && !isConnected) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  const authValue = {
    admin,
    setAdmin,
    loggedPresidingOfficer,
    setLoggedPresidingOfficer,
    setIsPresidingOfficer,
    setCastingProcess,
    adminLogin,
    loggedCenter,
    setLoggedCenter,
    state,
  };

  return <authProvider.Provider value={authValue}>{children}</authProvider.Provider>;
};

export default AuthContext;
