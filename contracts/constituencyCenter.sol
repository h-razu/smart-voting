// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract constituencyCenter
{
    struct Constituency_Info{
        uint constituencyID;
        string constituencyName;
    }
    Constituency_Info[] public constituencies;
    uint consID=0;

    struct Center_Info{
        uint centerID;
        string constituencyName;
        string centerName;
        bool status;
    }
    Center_Info[] public centers;
    uint cnID=0;

    //add constituency
    function addConstituency(string memory _name) public returns(bool){
        consID++;
        constituencies.push(Constituency_Info(consID, _name));

        return true;
    }

    //add center
    function addCenter(string memory _constituencyName, string memory _center) public returns(bool)
    {
        cnID++;
        centers.push(Center_Info(cnID,_constituencyName, _center,false));
        
        return true;
    }

     //get center length
    function getCenterLength() public view returns(uint)
    {
        return centers.length;
    }

     //get constituency length
    function getConstituencyLength() public view returns(uint)
    {
        return constituencies.length;
    }

    //modify center
    function modifyCenter(uint _centerID, string memory _constituencyName, string memory _centerName) public returns(bool)
    {
        centers.push(Center_Info(_centerID,_constituencyName, _centerName,false));

        return true;
    }

    function removeCenter(uint _centerID) public returns(bool)
    {
        bool status =false;
        int index=-1;

        for(uint i=0; i<centers.length; i++)
        {
            if(centers[i].centerID == _centerID)
            {
                index=int(i);
                break;
            }
        }

        if(index != -1)
        {
          for(uint j=uint(index); j<centers.length-1; j++)
          {
              centers[j]=centers[j+1];
          }
          centers.pop();
          status=true;
        }

        return status;
    }

    //change center status
    function changeCenterStatus(uint _centerID, bool _status) public returns(bool)
    {
        bool st =false;

        for(uint i=0; i<centers.length; i++)
        {
            if(centers[i].centerID == _centerID)
            {
                centers[i].status=_status;
                st=true;
                break;
            }
        }
        return st;
    }

    //get center status
    function getCenterStatus(uint _centerID) public view returns(bool)
    {
        bool st=false;

        for(uint i=0; i<centers.length; i++)
        {
            if(centers[i].centerID == _centerID)
            {
                st=centers[i].status;
                break;
            }
        }
        return st;
    }

    //get center data
    function getSpecificCenter(uint _id) public view returns(Center_Info memory)
    {
        Center_Info memory emptyData;

        for(uint i=0; i<centers.length; i++)
        {
            if(centers[i].centerID == _id)
            {
               return centers[i];
            }
        }
        return emptyData;
    }
}