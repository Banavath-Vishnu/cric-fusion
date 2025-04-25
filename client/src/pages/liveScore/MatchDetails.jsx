import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMatchDetailsApi } from "../../components/apis/api";

const MatchDetails = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await fetchMatchDetailsApi(matchId);
        if (details && details.data) {
          setMatchDetails(details.data);
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [matchId]);

  if (loading) return <div className="text-center mt-10">Loading match details...</div>;

  if (!matchDetails) return <div className="text-center mt-10 text-red-500">Match details not found.</div>;

  return (
    <div className="h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold">{matchDetails?.name || "Match Name Not Available"}</h1>
      <p className="text-gray-600 mt-2">{matchDetails?.status || "Status Unavailable"}</p>
      <p className="mt-2"><strong>Venue:</strong> {matchDetails?.venue || "Venue Not Available"}</p>
      <p><strong>Date:</strong> {matchDetails?.dateTimeGMT ? new Date(matchDetails.dateTimeGMT).toLocaleString() : "Date Unavailable"}</p>
      <p><strong>Match Type:</strong> {matchDetails?.matchType?.toUpperCase() || "N/A"}</p>
      <p><strong>Toss:</strong> {matchDetails?.tossWinner ? `${matchDetails.tossWinner} chose to ${matchDetails.tossChoice}` : "Toss Info Unavailable"}</p>
      <p><strong>Match Winner:</strong> {matchDetails?.matchWinner || "Not Decided Yet"}</p>

      {/* Scoreboard */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Scoreboard</h2>
        {matchDetails?.score?.length > 0 ? (
          matchDetails.score.map((inning, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mt-3">
              <p className="font-bold">{inning.inning}</p>
              <p>Runs: {inning.r} | Wickets: {inning.w} | Overs: {inning.o}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Score details unavailable</p>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
