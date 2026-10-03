import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeftRight, CheckCircle2, Send, GraduationCap } from 'lucide-react';
import Button from './Button';

const MatchCard = ({ match, onProposeExchange }) => {
  const { user, matchType, matchBadge, description, skillsTheyCanTeachMe, skillsICanTeachThem } = match;

  const isMutual = matchType === 'MUTUAL';

  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-xs transition duration-200 hover:shadow-md ${
        isMutual ? 'border-purple-200 ring-1 ring-purple-100' : 'border-slate-200'
      }`}
    >
      {/* Top Banner / Match Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base overflow-hidden border border-slate-200">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase() || 'S'
            )}
          </div>
          <div>
            <Link
              to={`/profile/${user._id}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition"
            >
              {user.name}
            </Link>
            <p className="text-xs text-slate-500 flex items-center">
              <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {user.college || 'Student'} • {user.course || 'Undergraduate'}
            </p>
          </div>
        </div>

        {/* Match Strength Badge */}
        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
              isMutual
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            {isMutual && <Sparkles className="w-3 h-3 mr-1 fill-purple-500" />}
            {matchBadge}
          </span>
          <span className="text-[11px] font-medium text-slate-400 mt-1">
            {match.matchScore}% Compatibility
          </span>
        </div>
      </div>

      {/* Matching Details Visualization */}
      <div className="py-4">
        <p className="text-xs text-slate-600 font-medium mb-3 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          {description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {/* What they can teach you */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              They Teach You:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skillsTheyCanTeachMe && skillsTheyCanTeachMe.length > 0 ? (
                skillsTheyCanTeachMe.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200"
                  >
                    {s.skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No specific skill matched</span>
              )}
            </div>
          </div>

          {/* What you can teach them */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1.5 flex items-center">
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              You Teach Them:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skillsICanTeachThem && skillsICanTeachThem.length > 0 ? (
                skillsICanTeachThem.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-white text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200"
                  >
                    {s.skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Explore other skills to teach</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link to={`/profile/${user._id}`} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
          View Profile
        </Link>
        <Button
          variant={isMutual ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onProposeExchange(match)}
          className="space-x-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Exchange Request</span>
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
