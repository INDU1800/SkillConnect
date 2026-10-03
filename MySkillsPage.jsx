import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { BookOpen, Compass, PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const MySkillsPage = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('teach'); // 'teach' or 'learn'
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleDeleteSkill = async (id, type) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;

    try {
      setDeletingId(id);
      const endpoint =
        type === 'teach'
          ? `/users/skills/teach/${id}`
          : `/users/skills/learn/${id}`;

      await API.delete(endpoint);
      await refreshUser();
      setFeedback('Skill removed successfully');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove skill');
    } finally {
      setDeletingId(null);
    }
  };

  const teachingSkills = user?.skillsToTeach || [];
  const learningSkills = user?.skillsToLearn || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Skills Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the skills you offer to teach and the skills you are looking to learn
          </p>
        </div>

        <Link to={`/skills/add?type=${activeTab}`}>
          <Button variant="primary" size="sm" className="space-x-1.5">
            <PlusCircle className="w-4 h-4" />
            <span>Add New Skill</span>
          </Button>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-8">
        <button
          onClick={() => setActiveTab('teach')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 transition border-b-2 cursor-pointer ${
            activeTab === 'teach'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Skills I Can Teach ({teachingSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 transition border-b-2 cursor-pointer ${
            activeTab === 'learn'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Skills I Want to Learn ({learningSkills.length})</span>
        </button>
      </div>

      {/* Skills Tab Content */}
      {activeTab === 'teach' ? (
        teachingSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachingSkills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                      {skill.category}
                    </span>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {skill.proficiency}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{skill.name}</h4>
                  <p className="text-xs text-slate-500 mt-2">
                    {skill.description || 'No description added.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    loading={deletingId === skill._id}
                    onClick={() => handleDeleteSkill(skill._id, 'teach')}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border-slate-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No teaching skills added yet"
            description="Add skills you are proficient in so other students can discover and learn from you."
            actionLabel="Add a Skill to Teach"
            onAction={() => window.location.assign('/skills/add?type=teach')}
          />
        )
      ) : learningSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {learningSkills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full">
                    {skill.category}
                  </span>
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {skill.proficiency || 'Target'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-2">{skill.name}</h4>
                <p className="text-xs text-slate-500 mt-2">
                  {skill.description || 'No description added.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  loading={deletingId === skill._id}
                  onClick={() => handleDeleteSkill(skill._id, 'learn')}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border-slate-200"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No learning desires added yet"
          description="List skills you want to learn so our matching algorithm can connect you with peer mentors."
          actionLabel="Add a Skill to Learn"
          onAction={() => window.location.assign('/skills/add?type=learn')}
        />
      )}
    </div>
  );
};

export default MySkillsPage;
