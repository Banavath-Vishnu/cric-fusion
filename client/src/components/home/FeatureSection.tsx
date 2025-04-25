import React from 'react';
import { TrendingUp, Archive, Trophy, Users, ShoppingBag } from 'lucide-react';

const features = [
  {
    title: "Live Scores & Updates",
    description: "Get real-time ball-by-ball updates, detailed statistics, and live commentary for matches across all formats.",
    icon: TrendingUp,
    color: "bg-blue-50 text-blue-700"
  },
  {
    title: "Cricket Archives",
    description: "Dive into an extensive historical database of matches, players, and tournaments dating back to cricket's origins.",
    icon: Archive,
    color: "bg-amber-50 text-amber-700"
  },
  {
    title: "Fantasy Cricket",
    description: "Create your dream team, join leagues with friends, and compete globally in our innovative fantasy cricket platform.",
    icon: Trophy,
    color: "bg-green-50 text-green-700"
  },
  {
    title: "Community Forums",
    description: "Connect with cricket enthusiasts worldwide, engage in discussions, share opinions, and stay updated with latest trends.",
    icon: Users,
    color: "bg-purple-50 text-purple-700"
  },
  {
    title: "NFT Marketplace",
    description: "Collect, trade, and showcase exclusive digital cricket memorabilia authenticated on the blockchain.",
    icon: ShoppingBag,
    color: "bg-rose-50 text-rose-700"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex h-6 items-center rounded-full bg-blue-100 px-3 text-sm font-medium text-blue-800 mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Ultimate Cricket Experience
          </h2>
          <p className="text-lg text-gray-600">
            CricketFusion brings together everything a cricket enthusiast needs in one seamless, elegant platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
            >
              <div className="mb-4">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
