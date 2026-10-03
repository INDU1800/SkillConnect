import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Repeat, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async () => {
    setEmail('demo@skillconnect.com');
    setPassword('Demo@123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-3">
            <Repeat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Log in to manage your student skill exchanges
          </p>
        </div>

        {/* Demo Fast-Login Box */}
        <div className="mb-6 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-900 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Demo Account
            </p>
            <p className="text-[11px] text-indigo-700">demo@skillconnect.com / Demo@123</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDemoFill}
            className="text-xs py-1 px-2.5"
          >
            Auto-fill
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@college.edu"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create student profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
