//SPDX-License-Identifier:MIT
pragma solidity >=0.4.22 <0.9.0;

contract politicalParty {
    
    struct PartyData {
        uint partyID;
        string partyName;
        string partySymbol;
        string cid;
        uint participateSeat;
    }

    PartyData[] public parties;
    uint id = 100;

    // party add
    function setParty(string memory _name, string memory _symbol, string memory _cid) public returns (bool){
        
        id++;
        parties.push(PartyData(id, _name, _symbol, _cid, 0));

        return true;
    }

    //delete party
    function deleteParty(uint _partyID) public returns (bool) {
        bool status = false;
        int index = -1;

        for (uint i = 0; i < parties.length; i++) {
            if (parties[i].partyID == _partyID) {
                index = int(i);
                break;
            }
        }

        if (index != -1) {
            for (uint j = uint(index); j < parties.length - 1; j++) {
                parties[j] = parties[j + 1];
            }
            parties.pop();
            status = true;
        }

        return status;
    }

    //get length
    function getLength() public view returns (uint) {
        return parties.length;
    }

    //increase participate seat number
    function increaseSeat(uint _id) public returns (bool) {
        bool status=false;

        for(uint i=0; i<parties.length; i++)
        {
            if(parties[i].partyID == _id)
            {
                parties[i].participateSeat= parties[i].participateSeat + 1;
                status=true;
                break;
            }
        }
        return status;
    }

    //deccrease participate seat number
    function decreaseSeat(uint _id) public returns (bool) {
        bool status=false;

        for(uint i=0; i<parties.length; i++)
        {
            if(parties[i].partyID == _id)
            {
                parties[i].participateSeat= parties[i].participateSeat - 1;
                status=true;
                break;
            }
        }
        return status;
    }
}
