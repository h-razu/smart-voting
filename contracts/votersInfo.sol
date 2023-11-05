// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract votersInfo {
    struct Voter {
        uint NID;
        string name;
        string fatherName;
        string motherName;
        uint age;
        string gender;
        uint centerID;
        string imageURL;
        bool votingStatus;
    }

    Voter[] public voters;

    // voter add
    function setVoter(uint _nid,string memory _name,string memory _fatherName,string memory _motherName,uint _age,string memory _gender,uint _centerID,string memory _imageURL) public returns (bool){
        bool status=true;
        voters.push(Voter(_nid,_name,_fatherName,_motherName,_age,_gender,_centerID,_imageURL,false));
        return status;
    }

    //delete voter
    function deleteVoter(uint _nid) public returns (bool) {
        bool status = false;
        int index = -1;

        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].NID == _nid) {
                index = int(i);
                break;
            }
        }

        if (index != -1) {
            for (uint j = uint(index); j < voters.length - 1; j++) {
                voters[j] = voters[j + 1];
            }
            voters.pop();
            status = true;
        }

        return status;
    }

    function getLength() public view returns (uint) {
        return voters.length;
    }

    function verifyVoterInfo(uint _NID) public view returns (Voter memory) {
        Voter memory emptyData;

        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].NID == _NID) {
                return voters[i];
            }
        }
        return emptyData;
    }

    //check is the citizen add to voter list
    function getCitizenStatus() public view returns (uint[] memory) {
        uint[] memory addedVoter = new uint[](voters.length);

        for (uint i = 0; i < voters.length; i++) {
            addedVoter[i] = voters[i].NID;
        }

        return addedVoter;
    }

    //constituency and center wise voter list
    //get length
    function constituencyAndCenterWiseLength(uint _centerID) internal view returns (uint) {
        uint count = 0;

        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].centerID == _centerID) {
                count++;
            }
        }
        return count;
    }

    //get index
    function constituencyAndCenterWiseVoterIndex(uint _centerID) public view returns (uint[] memory) {
        uint len = constituencyAndCenterWiseLength(_centerID);

        uint[] memory voterIndex = new uint[](len);
        uint count = 0;

        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].centerID == _centerID) {
                voterIndex[count] = i;
                count++;
            }
        }
        return voterIndex;
    }

    //change voting status after vote
    function castVote(uint _NID) public returns (bool) {
        bool status = false;

        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].NID == _NID) {
                voters[i].votingStatus = true;

                status = true;
            }
        }
        return status;
    }
}
