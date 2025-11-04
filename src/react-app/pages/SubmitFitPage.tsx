

/**
 * @description This file defines the SubmitFitPage component for NYUThrowingAFit.
 *              It provides a dedicated page for users to submit their outfit photos via an embedded Tally form.
 *              The component features a stylish title, a descriptive subtitle, and a centered, responsive form embed,
 *              all while maintaining the brand's bold, minimalist aesthetic.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const SubmitFitPage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-['Inter'] flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-center">
        <Link to="/" className="z-20">
          <img 
            src="https://heyboss.heeyo.ai/1759182119-d3f89767.png" 
            alt="NYUThrowingAFit Logo" 
            className="h-10 md:h-12 w-auto"
          />
        </Link>
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-24 md:py-32">
        <div className="text-center w-full max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-['Anton'] uppercase text-white mb-4 motion-preset-slide-up">
            Submit Your Fit ✨
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 motion-preset-fade-in motion-delay-300">
            Upload your outfit photo to join the NYU Throwing a Fit community giveaway.
          </p>

          <div className="w-full h-[70vh] md:h-[80vh] max-w-3xl mx-auto motion-preset-fade-in motion-delay-500">
            <iframe
              src="https://tally.so/r/dWqbzD?transparentBackground=1&amp;hideTitle=1"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Submit Your Fit"
              className="rounded-2xl shadow-2xl shadow-white/5"
            ></iframe>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-white/60">
          </p>
        </div>
      </footer>
    </div>
  );
};
  
