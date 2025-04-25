
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SlideUp, FadeIn } from '../ui/Transitions';

const Hero = () => {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-cricket-50/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto space-y-10">
        <SlideUp delay={0.15}>
          <span className="inline-flex h-6 items-center rounded-full bg-cricket-100 px-3 text-sm font-medium text-cricket-800 mb-4">
            Transforming Cricket Experience
          </span>
        </SlideUp>
        
        <SlideUp delay={0.3}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
            The Next Evolution of{' '}
            <span className="text-cricket-600 inline-block relative">
              Cricket Entertainment
              <span className="absolute bottom-1 left-0 w-full h-1 bg-cricket-200 rounded-full"></span>
            </span>
          </h1>
        </SlideUp>
        
        <SlideUp delay={0.45}>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Real-time scores, comprehensive archives, fantasy leagues, community forums, and exclusive 
            digital collectibles—all in one seamless platform.
          </p>
        </SlideUp>
        
        {/* CTA Buttons */}
        <SlideUp delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/scores"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-cricket-600 hover:bg-cricket-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cricket-500 shadow-sm transition-all duration-200 ease-in-out"
            >
              Live Scores
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/fantasy"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-cricket-700 bg-white border border-cricket-200 hover:bg-cricket-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cricket-500 shadow-sm transition-all duration-200 ease-in-out"
            >
              Join Fantasy League
            </Link>
          </div>
        </SlideUp>
        
        {/* Stats */}
        <FadeIn delay={0.9}>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-cricket-700">20M+</p>
              <p className="text-sm text-gray-500">Cricket Fans</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cricket-700">110+</p>
              <p className="text-sm text-gray-500">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cricket-700">250K+</p>
              <p className="text-sm text-gray-500">NFT Collectibles</p>
            </div>
          </div>
        </FadeIn>
      </div>
      
      {/* Down arrow animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
