import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Heart, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand info */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Repeat className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">SkillConnect</span>
            <span className="text-xs text-slate-400">| Peer-to-Peer Student Exchange</span>
          </div>

          {/* Quick links */}
          <div className="flex items-center space-x-6 text-xs font-medium text-slate-500">
            <Link to="/skills" className="hover:text-indigo-600 transition">Discover</Link>
            <Link to="/matches" className="hover:text-indigo-600 transition">Skill Matching</Link>
            <Link to="/about" className="hover:text-indigo-600 transition">Project Architecture</Link>
          </div>

          {/* Project disclaimer */}
          <div className="flex items-center text-xs text-slate-400 space-x-1">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Built as a 3rd-Year College Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
