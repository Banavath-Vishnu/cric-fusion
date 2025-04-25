import React from "react";

const LiveCricketScore = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg my-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🏏 Live Cricket Score</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cricketMatches.map((match, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex justify-between mb-2">
              <span className="text-lg font-semibold text-gray-900">{match.team1}</span>
              <span className="text-lg font-semibold text-gray-900">{match.team2}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{match.status}</p>
            <div className="text-gray-800 font-bold">{match.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const cricketMatches = [
  { team1: "India 🇮🇳", team2: "Australia 🇦🇺", score: "245/3 (40.3 ov)", status: "India batting" },
  { team1: "England 🏴", team2: "South Africa 🇿🇦", score: "178/5 (32.1 ov)", status: "England batting" },
  { team1: "Pakistan 🇵🇰", team2: "New Zealand 🇳🇿", score: "152/8 (50.0 ov)", status: "New Zealand won by 6 wickets" },
];

export default LiveCricketScore;
