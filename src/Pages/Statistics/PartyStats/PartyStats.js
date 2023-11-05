import React, { useEffect, useState } from "react";
import independentCandidateIcon from "../../../images/independent.png";

const PartyStats = ({ party, constituencyData, candidate }) => {
  const [partyResult, setPartyResult] = useState([]);

  useEffect(() => {
    const independentCandidate = candidate.filter((c) => c.partyName === "Independent Candidate");
    let arr = [];

    arr.push({
      Name: "Independent Candidate",
      Symbol: independentCandidateIcon,
      Participated: independentCandidate?.length,
      WonSeat: [],
      WonConstituency: [],
    });

    party.forEach((e) => {
      arr.push({
        Name: e.partyName,
        Symbol: e.partySymbol,
        Participated: e.participateSeat.toNumber(),
        WonSeat: [],
        WonConstituency: [],
      });
    });
    // console.log(arr);

    constituencyData.forEach((element) => {
      //get each constituency candidate
      const filtering = candidate?.filter((c) => c.standingConstituency.includes(element.constituencyName));

      let voteCountArr = [];

      filtering.forEach((data) => {
        for (let i = 0; i < data.standingConstituency.length; i++) {
          if (data.standingConstituency[i] === element.constituencyName) {
            voteCountArr.push({
              partyName: data.partyName,
              totalVotes: data.totalVotes[i],
            });
          }
        }
      });

      //   console.log(element.constituencyName);
      //   console.log(voteCountArr);

      //sorting based on total votes
      let sorted = voteCountArr.sort((c1, c2) => (c1.totalVotes < c2.totalVotes ? 1 : c1.totalVotes > c2.totalVotes ? -1 : 0));

      if (sorted && sorted[0]?.totalVotes > 0) {
        // console.log(sorted[0]);
        arr.forEach((e) => {
          if (sorted[0].partyName === e.Name) {
            e.WonConstituency.push(element.constituencyName);
            e.WonSeat.push(1);
          }
        });
      }
    });

    // console.log(arr);
    setPartyResult(arr);
  }, [candidate, constituencyData, party]);

  return (
    <div className="px-6 mx-auto mt-6 rounded-lg bg-slate-100 text-gray-800 border shadow-sm">
      <h2 className="ps-3 pt-4 text-2xl font-extrabold tracking-tight text-gray-900 text-left">Political Party Statistics</h2>
      <div className="container px-5 py-4 mx-auto">
        <div className="flex flex-wrap -m-4 text-center">
          {partyResult?.length > 0 &&
            partyResult?.map((party, i) => (
              <div className="p-3 md:w-1/4 sm:w-1/2 w-full">
                <div className="border-2 border-gray-600 p-2 rounded-lg transform transition duration-500 hover:scale-110">
                  <div className="avatar">
                    <div className="w-16 rounded">
                      <img src={party.Symbol} alt="voters icon" />
                    </div>
                  </div>
                  <h2 className="text-base py-2">{party.Name}</h2>
                  <div className="flex justify-center items-center">
                    <div className="">
                      <h2 className="title-font font-bold text-3xl text-gray-900">{party?.WonSeat.length}</h2>
                      <p className="leading-relaxed text-green-600">WON</p>
                    </div>
                    <div className="divider divider-horizontal ps-2"></div>
                    <div>
                      <h2 className="title-font font-bold text-3xl text-gray-900">{party.Participated - party.WonSeat?.length}</h2>
                      <p className="leading-relaxed text-red-600">LOST</p>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    Participated Constituency: <span className="title-font font-bold text-gray-900">{party.Participated}</span>
                  </p>
                </div>
              </div>
            ))}
          {/* <div className="p-3 md:w-1/4 sm:w-1/2 w-full">
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
          */}
        </div>
      </div>
    </div>
  );
};

export default PartyStats;
