import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, ArrowRight } from 'lucide-react';
import Button from './Button';

const SkillCard = ({
  skill,
  onRequest,
  isOwner = false,
  onDelete,
  type = 'teach', // 'teach' or 'learn'
}) => {
  const proficiencyColors = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
    Expert: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const categoryColors = {
    Programming: 'bg-sky-50 text-sky-700',
    'Web Development': 'bg-indigo-50 text-indigo-700',
    'Mobile Development': 'bg-cyan-50 text-cyan-700',
    'UI/UX Design': 'bg-pink-50 text-pink-700',
    'Graphic Design': 'bg-purple-50 text-purple-700',
    Languages: 'bg-amber-50 text-amber-700',
    Music: 'bg-teal-50 text-teal-700',
    Photography: 'bg-lime-50 text-lime-700',
    'Video Editing': 'bg-violet-50 text-violet-700',
    Business: 'bg-emerald-50 text-emerald-700',
    Academic: 'bg-orange-50 text-orange-700',
    Communication: 'bg-blue-50 text-blue-700',
    Other: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Category & Proficiency */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              categoryColors[skill.category] || categoryColors.Other
            }`}
          >
            {skill.category || 'General'}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              proficiencyColors[skill.proficiency] || proficiencyColors.Intermediate
            }`}
          >
            {skill.proficiency || 'Intermediate'}
          </span>
        </div>

        {/* Skill Title */}
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
          {skill.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-3 min-h-[36px]">
          {skill.description || 'No detailed description provided by the student.'}
        </p>

        {/* Student Offering Info */}
        {skill.student && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/profile/${skill.student._id}`}
              className="flex items-center space-x-2 text-xs text-slate-600 hover:text-indigo-600 group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold overflow-hidden">
                {skill.student.avatar ? (
                  <img
                    src={skill.student.avatar}
                    alt={skill.student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  skill.student.name?.charAt(0).toUpperCase() || 'S'
                )}
              </div>
              <div className="truncate max-w-[140px]">
                <p className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                  {skill.student.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {skill.student.college || 'Student'}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Card Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {isOwner ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(skill._id, type)}
            className="w-full"
          >
            Remove Skill
          </Button>
        ) : (
          onRequest && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRequest(skill)}
              className="w-full space-x-1.5"
            >
              <span>Exchange Skill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default SkillCard;
