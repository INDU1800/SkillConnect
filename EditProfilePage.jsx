import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const EditProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    course: user?.course || '',
    year: user?.year || '3rd Year',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    linkedin: user?.linkedin || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const res = await API.put(`/users/${user._id}`, formData);
      updateUserData(res.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate(`/profile/${user._id}`);
      }, 1200);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = [
    { label: '1st Year (Freshman)', value: '1st Year' },
    { label: '2nd Year (Sophomore)', value: '2nd Year' },
    { label: '3rd Year (Junior)', value: '3rd Year' },
    { label: '4th Year (Senior)', value: '4th Year' },
    { label: 'Postgraduate / Masters', value: 'Postgraduate' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep your student academic and bio information up to date
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College / University"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. City Engineering College"
            />
            <Input
              label="Course / Branch"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
          </div>

          <Select
            label="Year of Study"
            name="year"
            value={formData.year}
            onChange={handleChange}
            options={yearOptions}
          />

          <Input
            label="Avatar Image URL (Optional)"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            helperText="Provide a direct link to an online picture or avatar"
          />

          <Input
            label="LinkedIn Profile URL (Optional)"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            helperText="Provide your public LinkedIn profile link"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Student Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
              placeholder="Write a brief intro about yourself..."
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
