import React, { useEffect, useState } from "react";
import voterIcon from "../../../images/voters.png";
import maleVoterIcon from "../../../images/man.png";
import femaleVoterIcon from "../../../images/woman.png";

const VoterStats = ({ voters, option, centers }) => {
  const [totalVotersInConstituency, setTotalVotersInConstituency] = useState(0);
  const [totalMaleVotersInConstituency, setTotalMaleVotersInConstituency] = useState(0);
  const [totalFemaleVotersInConstituency, setTotalFemaleVotersInConstituency] = useState(0);

  const [totalVotedVotersInConstituency, setTotalVotedVotersInConstituency] = useState(0);
  const [totalVotedMaleVotersInConstituency, setTotalVotedMaleVotersInConstituency] = useState(0);
  const [totalVotedFemaleVotersInConstituency, setTotalVotedFemaleVotersInConstituency] = useState(0);

  useEffect(() => {
    if (option === "All Constituency") {
      setTotalVotersInConstituency(voters?.length);
      //voted voter
      const votedVoters = voters?.filter((voter) => voter.votingStatus === true);
      setTotalVotedVotersInConstituency(votedVoters?.length);

      //male voter
      const maleVoter = voters?.filter((voter) => voter.gender === "male");
      setTotalMaleVotersInConstituency(maleVoter?.length);
      //male voted voter
      const maleVotedVoter = maleVoter?.filter((mv) => mv.votingStatus === true);
      setTotalVotedMaleVotersInConstituency(maleVotedVoter?.length);

      //female voter
      const femaleVoter = voters?.filter((voter) => voter.gender === "female");
      setTotalFemaleVotersInConstituency(femaleVoter?.length);
      //female voted voter
      const femaleVotedVoter = femaleVoter?.filter((fv) => fv.votingStatus === true);
      setTotalVotedFemaleVotersInConstituency(femaleVotedVoter?.length);
    } else {
      const filteredCenter = centers?.filter((center) => center.constituencyName === option);

      //specific constituency voters
      const centerID = filteredCenter.map((d) => d.centerID.toNumber());
      const constituencyVoters = voters?.filter((voter) => centerID.includes(voter.centerID.toNumber()));
      setTotalVotersInConstituency(constituencyVoters?.length);
      //voted voter
      const votedVoters = constituencyVoters?.filter((voter) => voter.votingStatus === true);
      setTotalVotedVotersInConstituency(votedVoters?.length);

      //male voter
      const maleVoter = constituencyVoters?.filter((voter) => voter.gender === "male");
      setTotalMaleVotersInConstituency(maleVoter?.length);
      //male voted voter
      const maleVotedVoter = maleVoter?.filter((mv) => mv.votingStatus === true);
      setTotalVotedMaleVotersInConstituency(maleVotedVoter?.length);

      //female voter
      const femaleVoter = constituencyVoters?.filter((voter) => voter.gender === "female");
      setTotalFemaleVotersInConstituency(femaleVoter?.length);
      //female voted voter
      const femaleVotedVoter = femaleVoter?.filter((fv) => fv.votingStatus === true);
      setTotalVotedFemaleVotersInConstituency(femaleVotedVoter?.length);
    }
  }, [option, voters, centers]);

  return (
    <div className="px-6 mx-auto mt-2 rounded-lg bg-slate-100 text-gray-800 border shadow-sm">
      <h2 className="ps-3 pt-4 text-2xl font-extrabold tracking-tight text-gray-900 text-left">Voters Statistics</h2>
      <div className="container px-5 py-4 mx-auto">
        <div className="flex flex-wrap -m-4 text-center">
          <div className="p-3 md:w-1/4 sm:w-1/2 w-full">
            <div className="border-2 border-gray-600 p-2 rounded-lg transform transition duration-500 hover:scale-110">
              <div className="avatar">
                <div className="w-16 rounded">
                  <img src={voterIcon} alt="voters icon" />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="">
                  <h2 className="title-font font-bold text-3xl text-gray-900">{totalVotedVotersInConstituency}</h2>
                  <p className="leading-relaxed text-green-600">Voted</p>
                </div>
                <div className="divider divider-horizontal ps-2"></div>
                <div>
                  <h2 className="title-font font-bold text-3xl text-gray-900">{totalVotersInConstituency - totalVotedVotersInConstituency}</h2>
                  <p className="leading-relaxed text-red-600">Not Voted</p>
                </div>
              </div>
              <p className="leading-relaxed mt-4">
                Total Voters: <span className="title-font font-bold text-gray-900">{totalVotersInConstituency}</span>
              </p>
            </div>
          </div>
          <div className="p-3 md:w-1/4 sm:w-1/2 w-full">
            <div className="border-2 border-gray-600 p-2 rounded-lg transform transition duration-500 hover:scale-110">
              <div className="avatar">
                <div className="w-16 rounded">
                  <img src={maleVoterIcon} alt="voters icon" />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="">
                  <h2 className="title-font font-bold text-3xl text-gray-900">{totalVotedMaleVotersInConstituency}</h2>
                  <p className="leading-relaxed text-green-600">Voted</p>
                </div>
                <div className="divider divider-horizontal ps-2"></div>
                <div>
                  <h2 className="title-font font-bold text-3xl text-gray-900">
                    {totalMaleVotersInConstituency - totalVotedMaleVotersInConstituency}
                  </h2>
                  <p className="leading-relaxed text-red-600">Not Voted</p>
                </div>
              </div>
              <p className="leading-relaxed mt-4">
                Male Voters: <span className="title-font font-bold text-gray-900">{totalMaleVotersInConstituency}</span>
              </p>
            </div>
          </div>
          <div className="p-3 md:w-1/4 sm:w-1/2 w-full">
            <div className="border-2 border-gray-600 p-2 rounded-lg transform transition duration-500 hover:scale-110">
              <div className="avatar">
                <div className="w-16 rounded">
                  <img src={femaleVoterIcon} alt="voters icon" />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="">
                  <h2 className="title-font font-bold text-3xl text-gray-900">{totalVotedFemaleVotersInConstituency}</h2>
                  <p className="leading-relaxed text-green-600">Voted</p>
                </div>
                <div className="divider divider-horizontal ps-2"></div>
                <div>
                  <h2 className="title-font font-bold text-3xl text-gray-900">
                    {totalFemaleVotersInConstituency - totalVotedFemaleVotersInConstituency}
                  </h2>
                  <p className="leading-relaxed text-red-600">Not Voted</p>
                </div>
              </div>
              <p className="leading-relaxed mt-4">
                Female Voters: <span className="title-font font-bold text-gray-900">{totalFemaleVotersInConstituency}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterStats;
