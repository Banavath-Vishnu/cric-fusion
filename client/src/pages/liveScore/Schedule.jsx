import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allMatchesScoresApi } from "../../components/apis/api";

const CricketScore = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const data = await allMatchesScoresApi();
        if (data && data.data) {
          const iplMatches = data.data.filter(
            (match) => match.series === "Indian Premier League 2025"
          );
          setMatches(iplMatches);
        }
      } catch (error) {
        console.error("Error fetching live scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="h-screen flex flex-col w-full justify-center items-center">
      <div className="font-bold text-xl mb-4">All Matches Schedule</div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="w-full flex flex-wrap gap-1 justify-center items-center overflow-y-auto bg-white rounded-t-3xl p-4 space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => (
              <div 
                key={match.id} 
                className="bg-white w-[40%] shadow-lg rounded-2xl p-4 border border-gray-100 cursor-pointer hover:shadow-xl transition"
                onClick={() => navigate(`/match/${match.id}`)}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">{match.series}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(match.dateTimeGMT).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={match.t1img || "/api/placeholder/40/40"}
                      alt={match.t1}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{match.t1}</p>
                      <p className="text-sm text-gray-500">{match.t1s || "Yet to Bat"}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-lg text-gray-500">vs</span>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <div>
                      <p className="font-bold">{match.t2}</p>
                      <p className="text-sm text-gray-500">{match.t2s || "Yet to Bat"}</p>
                    </div>
                    <img
                      src={match.t2img || "/api/placeholder/40/40"}
                      alt={match.t2}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    {match.matchType?.toUpperCase()}
                  </span>
                  <span className={`font-medium ${
                    match.status?.toLowerCase().includes('live') 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                  }`}>
                    {match.status || "Status Pending"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-4">
              No live matches available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CricketScore;
