//SPDX-License-Identifier:MIT
pragma solidity >=0.4.22 <0.9.0;

contract presidingOfficerData {
    
      struct presidingOfficer { 
      uint presidingOfficerID;
      string name;
      uint centerID;
      string pass;
   }

   presidingOfficer[] public presidingOfficers;

    // presidingOfficer add
   function setPresidingOfficer(uint _uid, string memory _name, uint _centerId, string memory _pass) public
    {
        presidingOfficers.push(presidingOfficer(_uid, _name, _centerId, _pass));
    }

    //delete presidingOfficer
    function deletePresidingOfficer(uint _presidingOfficerID) public returns(bool)
    {
        bool status =false;
        int index=-1;

        for(uint i=0; i<presidingOfficers.length; i++)
        {
            if(presidingOfficers[i].presidingOfficerID == _presidingOfficerID)
            {
                index=int(i);
                break;
            }
        }

        if(index != -1)
        {
          for(uint j=uint(index); j<presidingOfficers.length-1; j++)
          {
              presidingOfficers[j]=presidingOfficers[j+1];
          }
          presidingOfficers.pop();
          status=true;
        }

        return status;
    }

    //get length
    function getLength() public view returns(uint)
    {
        return presidingOfficers.length;
    }

    //verify presidingOfficer
    function verifyPresidingOfficer(uint _presidingOfficerID, string memory _pass) public view returns(int)
    {
        int index=-1;

        for(uint i=0; i<presidingOfficers.length; i++)
        {
            if(presidingOfficers[i].presidingOfficerID == _presidingOfficerID)
            {
                 if( keccak256(abi.encodePacked(presidingOfficers[i].pass)) == keccak256(abi.encodePacked(_pass)))
                {
                  
                  index=int(i);
                  break;
                }
            }
        }
        return index;
    }

    //allocate center
    function allocateCenter(uint _presidingOfficerID, uint _centerID) public returns(bool)
    {
        bool status=false;

        for(uint i=0; i<presidingOfficers.length; i++)
        {
            if(presidingOfficers[i].presidingOfficerID == _presidingOfficerID)
            {
                presidingOfficers[i].centerID=_centerID;
                status=true;
            }
        }
        return status;
    }
}


