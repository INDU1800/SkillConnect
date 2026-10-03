import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Repeat, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    course: '',
    year: '3rd Year',
    bio: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details.'
      );
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-3">
            <Repeat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Student Registration</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create your account to start peer skill bartering
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@college.edu"
              required
            />
          </div>

          <Input
            label="Password (min 6 chars)"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College / University"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. National Tech Institute"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Short Student Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Tell other students what you are studying, your interests, or what projects you are building..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            ></textarea>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
          >
            Create My Account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
