import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Compass } from 'lucide-react';
import Button from './Button';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Profile info header */}
        <div className="flex items-start space-x-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base overflow-hidden border border-indigo-200 shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="truncate">
            <h4 className="font-bold text-slate-900 truncate hover:text-indigo-600 transition">
              <Link to={`/profile/${user._id}`}>{user.name}</Link>
            </h4>
            <p className="text-xs text-slate-500 flex items-center mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
              <span>{user.college || 'College Student'}</span>
            </p>
            {user.course && (
              <p className="text-[11px] text-slate-400 truncate">
                {user.course} {user.year ? `• ${user.year}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            "{user.bio}"
          </p>
        )}

        {/* Skills Offered */}
        <div className="mb-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center">
            <BookOpen className="w-3 h-3 mr-1 text-indigo-500" />
            Teaches ({user.skillsToTeach?.length || 0}):
          </p>
          <div className="flex flex-wrap gap-1">
            {user.skillsToTeach?.length > 0 ? (
              user.skillsToTeach.slice(0, 3).map((s) => (
                <span
                  key={s._id || s.name}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium"
                >
                  {s.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">None listed yet</span>
            )}
            {user.skillsToTeach?.length > 3 && (
              <span className="text-xs text-slate-400 px-1 py-0.5">
                +{user.skillsToTeach.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center">
            <Compass className="w-3 h-3 mr-1 text-purple-500" />
            Wants to Learn ({user.skillsToLearn?.length || 0}):
          </p>
          <div className="flex flex-wrap gap-1">
            {user.skillsToLearn?.length > 0 ? (
              user.skillsToLearn.slice(0, 3).map((s) => (
                <span
                  key={s._id || s.name}
                  className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium"
                >
                  {s.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">None listed yet</span>
            )}
            {user.skillsToLearn?.length > 3 && (
              <span className="text-xs text-slate-400 px-1 py-0.5">
                +{user.skillsToLearn.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <Link to={`/profile/${user._id}`} className="block w-full">
          <Button variant="outline" size="sm" className="w-full justify-between">
            <span>View Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
