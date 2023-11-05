// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract candidatesInfo {
    
    struct StandingConstituency {
        uint constituencyID;
        uint totalVotes;
    }

    struct Candidate {
        string candidateType;
        string partyName;
        string symbolURL;
        string cid;
    }

    mapping(uint => Candidate) public candidates;
    mapping(uint => StandingConstituency[]) public standingConstituencies;
    uint[] allCandidatesNID;

    //add and update standingConstituency
    function addStandingConstituency(uint candidateNID, uint _constituencyID) public returns (bool) {
        
        // require(standingConstituencies[candidateNID].length < 5, "Maximum Constituency Added");

        if(standingConstituencies[candidateNID].length < 5){
        
            StandingConstituency memory newConstituency = StandingConstituency(_constituencyID,0);
            standingConstituencies[candidateNID].push(newConstituency);

            return true;
        }

        return false;
    }

    //add candidate
    function addCandidate(uint _candidateNID, string memory _candidateType, string memory _partyName, string memory _symbol, string memory _cid, uint _constituencyID) public returns (bool) { 

        Candidate memory newCandidate = Candidate(_candidateType,_partyName,_symbol,_cid);
        candidates[_candidateNID] = newCandidate;

        bool status = addStandingConstituency(_candidateNID, _constituencyID);

        allCandidatesNID.push(_candidateNID);

        return status;
    }

    function removeCandidateNID(uint NIDToRemove) internal {

        for (uint i = 0; i < allCandidatesNID.length; i++) {
            if (allCandidatesNID[i] == NIDToRemove) {
                if (i != allCandidatesNID.length - 1) {
                    allCandidatesNID[i] = allCandidatesNID[
                        allCandidatesNID.length - 1
                    ];
                }
                allCandidatesNID.pop();
                break;
            }
        }
    }

    function deleteCandidate( uint _candidateNID,uint _constituencyID) public returns (bool) {
        //check for only one seat candidate
        if (standingConstituencies[_candidateNID].length == 1) {
            delete candidates[_candidateNID];
            delete standingConstituencies[_candidateNID];
            removeCandidateNID(_candidateNID);
        } else {

            uint constituencyIndex = 0;
            for (uint i = 0; i < standingConstituencies[_candidateNID].length; i++) {
                if (standingConstituencies[_candidateNID][i].constituencyID == _constituencyID) {
                    constituencyIndex = i;
                    break;
                }
            }

            if (constituencyIndex < standingConstituencies[_candidateNID].length - 1) {
                // Move the last element to the index of the element to be deleted
                standingConstituencies[_candidateNID][constituencyIndex] =
                 standingConstituencies[_candidateNID][standingConstituencies[_candidateNID].length - 1];
            }

            // Pop the last element to remove it
            standingConstituencies[_candidateNID].pop();
        }

        return true;
    }

    //get length
    function getLength() public view returns (uint) {
        return allCandidatesNID.length;
    }

    //get all candidate nid
    function getAllCandidateNID() public view returns (uint[] memory) {
        return allCandidatesNID;
    }

    //get length of standing constituency of each candidate
    function getStandingConstituencyLength(uint _candidateNID) public view returns (uint){
        return standingConstituencies[_candidateNID].length;
    }

    //update votes count
    function castVoteAction(uint _candidateNID,uint _constituencyID) public returns (bool) {

        int constituencyIndex = -1;

        for (uint i = 0; i < standingConstituencies[_candidateNID].length; i++) {
            if (standingConstituencies[_candidateNID][i].constituencyID == _constituencyID) {
                constituencyIndex = int(i);
                break;
            }
        }

        standingConstituencies[_candidateNID][uint(constituencyIndex)].totalVotes =
            standingConstituencies[_candidateNID][uint(constituencyIndex)].totalVotes + 1;
        
        return true;
    }

    //vote count
    function getConstituencyWiseVoteCount(uint _candidateNID,uint _constituencyID) public view returns (uint) {
        uint votes = 0;

        for (uint j = 0; j < standingConstituencies[_candidateNID].length; j++) {
            
            if (standingConstituencies[_candidateNID][j].constituencyID == _constituencyID) {
                votes = standingConstituencies[_candidateNID][j].totalVotes;
            }
        }

        return votes;
    }
}
