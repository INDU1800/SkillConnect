import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Repeat,
  GraduationCap,
  ShieldCheck,
  Zap,
  Code,
  Palette,
  Camera,
  Layers,
} from 'lucide-react';
import Button from '../components/Button';
import { CATEGORIES } from '../components/FilterBar';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const steps = [
    {
      number: '01',
      title: 'List Your Skills',
      description: 'Add skills you can teach to fellow students and skills you are eager to learn.',
      icon: Layers,
    },
    {
      number: '02',
      title: 'Discover Reciprocal Matches',
      description: 'Our matching engine pairs you with peers who teach what you want and want what you teach.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Propose an Exchange',
      description: 'Send a direct request detailing your skill swap proposal and get accepted.',
      icon: Repeat,
    },
    {
      number: '04',
      title: 'Learn & Upskill Together',
      description: 'Schedule peer study sessions, share resources, and level up your college career.',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-20 lg:py-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peer-to-Peer Student Skill Exchange</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Exchange Knowledge. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Learn Free from College Peers.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillConnect connects students who want to barter practical skills.
            Teach Python, learn Photoshop. Teach Guitar, learn Web Development. Zero money, 100% peer learning.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto space-x-2">
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto space-x-2">
                    <span>Create Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/skills">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Skills
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick value badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Direct Skill Barter</h4>
                <p className="text-xs text-slate-500">No fees or credits required</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mutual Matching</h4>
                <p className="text-xs text-slate-500">Reciprocal algorithm</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Campus Community</h4>
                <p className="text-xs text-slate-500">Verified student profiles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              How SkillConnect Works
            </h3>
            <p className="mt-3 text-slate-600 text-sm">
              A straightforward peer exchange system designed specifically for collegiate skill sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative hover:border-indigo-300 transition group"
                >
                  <span className="text-3xl font-extrabold text-slate-200 group-hover:text-indigo-200 transition">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center my-4 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore Popular Categories */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Popular Skill Categories</h3>
              <p className="text-xs text-slate-500 mt-1">
                Browse student mentors in high-demand technical and creative domains
              </p>
            </div>
            <Link
              to="/skills"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center mt-3 sm:mt-0"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <Link
                key={cat}
                to={`/skills?category=${encodeURIComponent(cat)}`}
                className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition text-center group cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition">
                  {cat}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* College Project Banner */}
      <section className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold">
            Ready to exchange skills with fellow students?
          </h3>
          <p className="mt-2 text-indigo-200 text-sm max-w-xl mx-auto">
            Join the SkillConnect network today and start learning peer-to-peer.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/register">
              <Button variant="secondary" size="md">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
