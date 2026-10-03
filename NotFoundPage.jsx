import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Repeat className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full space-x-1.5">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link to="/skills" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full">
              Discover Skills
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
