import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Compass, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { CATEGORIES, PROFICIENCIES } from '../components/FilterBar';

const AddSkillPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'learn' ? 'learn' : 'teach';

  const [skillType, setSkillType] = useState(initialType); // 'teach' or 'learn'
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Skill name is required');
      return;
    }

    try {
      setLoading(true);
      const endpoint =
        skillType === 'teach' ? '/users/skills/teach' : '/users/skills/learn';

      await API.post(endpoint, {
        name: name.trim(),
        category,
        proficiency,
        description: description.trim(),
      });

      await refreshUser();
      setSuccess(`Skill "${name}" added successfully to your ${skillType} list!`);
      setTimeout(() => {
        navigate('/my-skills');
      }, 1200);
    } catch (err) {
      console.error('Error adding skill:', err);
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.filter((c) => c !== 'All').map((c) => ({
    label: c,
    value: c,
  }));

  const proficiencyOptions = PROFICIENCIES.filter((p) => p !== 'All').map((p) => ({
    label: p,
    value: p,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Add a New Skill</h1>
          <p className="text-xs text-slate-500 mt-1">
            Expand your profile by offering or requesting a skill
          </p>
        </div>

        {/* Skill Type Switcher */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setSkillType('teach')}
            className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
              skillType === 'teach'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>I Can Teach This</span>
          </button>
          <button
            type="button"
            onClick={() => setSkillType('learn')}
            className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
              skillType === 'learn'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>I Want to Learn This</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              skillType === 'teach'
                ? 'e.g. JavaScript, React, Photoshop, Python'
                : 'e.g. Flutter, UI/UX, Spanish, Video Editing'
            }
            required
            helperText="Be specific with the technology, tool, or subject name"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Skill Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
              required
            />

            <Select
              label={
                skillType === 'teach'
                  ? 'Your Proficiency Level'
                  : 'Desired Learning Level'
              }
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              options={proficiencyOptions}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {skillType === 'teach'
                ? 'What can you teach or help with?'
                : 'What specifically do you want to learn?'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
              placeholder={
                skillType === 'teach'
                  ? 'e.g. Can cover basics, project architecture, debugging, or build a small project together...'
                  : 'e.g. Looking for help with state management, setting up dev environment, and building portfolio apps...'
              }
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/my-skills')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={skillType === 'teach' ? 'primary' : 'secondary'}
              loading={loading}
            >
              Save {skillType === 'teach' ? 'Teaching' : 'Learning'} Skill
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillPage;
