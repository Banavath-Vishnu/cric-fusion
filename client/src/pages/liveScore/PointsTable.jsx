import React, { useState, useEffect } from "react";
import { pointsTableApi } from "../../components/apis/api";

const PointsTable = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pointsTableApi();
        if (data && data.value && data.value[0].standings) {
          setTeams(data.value[0].standings);
        } else {
          setError("Invalid API response");
        }
      } catch (error) {
        setError("Error fetching standings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading standings...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">IPL 2025 Standings</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Team</th>
            <th className="border p-2">Matches</th>
            <th className="border p-2">Wins</th>
            <th className="border p-2">Losses</th>
            <th className="border p-2">Points</th>
            <th className="border p-2">NRR</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index} className="text-center bg-white border">
              <td className="border p-2">{team.overallRank}</td>
              <td className="border p-2 flex items-center space-x-2">
              <img 
  src={`https://www.bing.com/th?id=${team.team.image.id}&pid=MSports&w=50&h=50&qlt=90`} 
  alt={team.team.schoolName} 
  className="w-8 h-8 rounded-full"
/>
                <span>{team.team.schoolName}</span>
              </td>
              <td className="border p-2">{team.gamesPlayed}</td>
              <td className="border p-2">{team.winLoss.wins}</td>
              <td className="border p-2">{team.winLoss.losses}</td>
              <td className="border p-2 font-bold">{team.points}</td>
              <td className="border p-2">0.00</td> {/* Placeholder for NRR */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;
