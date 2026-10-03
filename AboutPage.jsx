import React from 'react';
import { Repeat, Code, Database, Lock, Server, Sparkles, GraduationCap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>3rd-Year College Project</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          About SkillConnect
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          A peer-to-peer student skill-sharing platform engineered to eliminate commercial barriers to learning through reciprocal student barter.
        </p>
      </div>

      {/* Core Mission */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-3">The Problem & Solution</h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          College students frequently encounter situations where they excel in specific practical skills (e.g. web programming, UI design, musical instruments, data analysis) but struggle with others (e.g. Photoshop editing, mobile app development, presentation skills). Traditional learning platforms either charge high fees or offer generic pre-recorded content without hands-on feedback.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>SkillConnect</strong> solves this through direct peer exchange: Student A teaches what Student B wants, and Student B teaches what Student A wants. No money is exchanged—only practical knowledge and collaboration.
        </p>
      </div>

      {/* System Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Technology Stack & Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <Code className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Frontend</h3>
              <p className="text-slate-500 mt-1">
                React.js with Vite, JavaScript (ES6+), React Router v6, Tailwind CSS, Lucide React icons, and Axios.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <Server className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Backend</h3>
              <p className="text-slate-500 mt-1">
                Node.js and Express.js REST API with modular controllers, routes, and middleware.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Database & ODM</h3>
              <p className="text-slate-500 mt-1">
                MongoDB and Mongoose schemas with indexed user skills and referenced exchange requests.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Authentication</h3>
              <p className="text-slate-500 mt-1">
                JSON Web Tokens (JWT) for stateless session verification and bcryptjs for salted password hashing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matching Algorithm Explanation */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-indigo-900 font-bold mb-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold">The Reciprocal Matching Algorithm</h2>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mb-3">
          SkillConnect purposefully avoids black-box machine learning to maintain full transparency and predictability:
        </p>
        <div className="bg-white/80 p-4 rounded-xl border border-indigo-100 space-y-2 text-xs font-mono text-slate-800">
          <p>1. Compare User A (skillsToLearn) against User B (skillsToTeach)</p>
          <p>2. Compare User A (skillsToTeach) against User B (skillsToLearn)</p>
          <p>3. If both pairings exist $\rightarrow$ <strong>MUTUAL RECIPROCAL MATCH (Rank #1, Score: 95%)</strong></p>
          <p>4. If only pairing 1 exists $\rightarrow$ <strong>ONE-WAY LEARN MATCH (Rank #2, Score: 70%)</strong></p>
          <p>5. If only pairing 2 exists $\rightarrow$ <strong>ONE-WAY TEACH MATCH (Rank #3, Score: 50%)</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
