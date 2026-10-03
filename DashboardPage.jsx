import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  BookOpen,
  Compass,
  Clock,
  Repeat,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Inbox,
  CheckCircle,
  Activity,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Propose exchange modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [message, setMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dashRes, matchRes] = await Promise.all([
        API.get('/requests/dashboard'),
        API.get('/matches'),
      ]);

      setDashboardData(dashRes.data);
      setTopMatches(matchRes.data.matches?.slice(0, 3) || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load dashboard data. Please make sure the server is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenProposeModal = (match) => {
    setSelectedMatch(match);
    setSkillOffered(match.skillsICanTeachThem?.[0]?.skill || user?.skillsToTeach?.[0]?.name || '');
    setSkillRequested(match.skillsTheyCanTeachMe?.[0]?.skill || match.user?.skillsToTeach?.[0]?.name || '');
    setMessage(`Hi ${match.user.name.split(' ')[0]}! I would love to exchange skills with you.`);
    setIsModalOpen(true);
  };

  const handleSendExchange = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;

    try {
      setSubmittingRequest(true);
      await API.post('/requests', {
        receiverId: selectedMatch.user._id,
        skillOffered,
        skillRequested,
        message,
      });

      setIsModalOpen(false);
      setActionSuccess('Exchange request sent successfully!');
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send exchange request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    skillsTeachingCount: user?.skillsToTeach?.length || 0,
    skillsLearningCount: user?.skillsToLearn?.length || 0,
    pendingRequestsCount: 0,
    activeExchangesCount: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Student Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            {user?.college ? `${user.college} • ` : ''}
            {user?.course ? `${user.course} • ` : ''}
            {user?.year || 'Student'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link to="/skills/add">
            <Button variant="secondary" size="md" className="space-x-1.5 shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Skill</span>
            </Button>
          </Link>
          <Link to="/matches">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Matches</span>
            </Button>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Skills I Teach"
          value={stats.skillsTeachingCount}
          icon={BookOpen}
          color="indigo"
          subtitle="Skills offered to peers"
        />
        <DashboardCard
          title="Skills I Want"
          value={stats.skillsLearningCount}
          icon={Compass}
          color="purple"
          subtitle="Skills seeking to learn"
        />
        <DashboardCard
          title="Pending Requests"
          value={stats.pendingRequestsCount}
          icon={Clock}
          color="amber"
          subtitle="Awaiting response"
        />
        <DashboardCard
          title="Active Exchanges"
          value={stats.activeExchangesCount}
          icon={Repeat}
          color="emerald"
          subtitle="Collaborations in progress"
        />
      </div>

      {/* Main Grid: My Skills & Top Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Skills Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                Skills I Can Teach
              </h3>
              <Link to="/skills/add?type=teach" className="text-xs text-indigo-600 font-semibold hover:underline">
                + Add
              </Link>
            </div>

            {user?.skillsToTeach?.length > 0 ? (
              <div className="space-y-2">
                {user.skillsToTeach.map((skill) => (
                  <div
                    key={skill._id || skill.name}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{skill.name}</p>
                      <p className="text-[11px] text-slate-500">{skill.category} • {skill.proficiency}</p>
                    </div>
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      Teaching
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No teaching skills added yet. Add one to start matching!</p>
            )}

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <Compass className="w-4 h-4 mr-2 text-purple-600" />
                Skills I Want to Learn
              </h3>
              <Link to="/skills/add?type=learn" className="text-xs text-purple-600 font-semibold hover:underline">
                + Add
              </Link>
            </div>

            {user?.skillsToLearn?.length > 0 ? (
              <div className="space-y-2">
                {user.skillsToLearn.map((skill) => (
                  <div
                    key={skill._id || skill.name}
                    className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{skill.name}</p>
                      <p className="text-[11px] text-slate-500">{skill.category}</p>
                    </div>
                    <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      Learning
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No learning skills added yet.</p>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link to="/my-skills" className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Manage All My Skills &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Columns: Potential Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  Potential Skill Matches
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Peers matching your teaching and learning interests
                </p>
              </div>
              <Link to="/matches">
                <Button variant="outline" size="sm" className="space-x-1">
                  <span>View All Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {topMatches.length > 0 ? (
              <div className="space-y-4">
                {topMatches.map((match) => (
                  <MatchCard
                    key={match.user._id}
                    match={match}
                    onProposeExchange={handleOpenProposeModal}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No Matches Yet"
                description="Add more skills to teach and skills to learn to allow our matching algorithm to pair you with students!"
                actionLabel="Add Skills Now"
                onAction={() => window.location.assign('/skills/add')}
              />
            )}
          </div>

          {/* Recent Activity / Requests Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <Activity className="w-4 h-4 mr-2 text-indigo-600" />
                Recent Activity & Requests
              </h3>
              <Link to="/requests" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all requests &rarr;
              </Link>
            </div>

            {dashboardData?.recentReceived?.length > 0 || dashboardData?.recentSent?.length > 0 ? (
              <div className="space-y-2">
                {dashboardData?.recentReceived?.map((req) => (
                  <div
                    key={req._id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{req.sender?.name}</span> offered{' '}
                      <span className="font-semibold text-indigo-600">{req.skillOffered}</span> in
                      exchange for <span className="font-semibold text-purple-600">{req.skillRequested}</span>
                    </div>
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200">
                      {req.status}
                    </span>
                  </div>
                ))}
                {dashboardData?.recentSent?.map((req) => (
                  <div
                    key={req._id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      You requested an exchange with{' '}
                      <span className="font-bold text-slate-800">{req.receiver?.name}</span> (
                      {req.skillRequested})
                    </div>
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No recent exchange activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Propose Exchange Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Propose Skill Exchange with ${selectedMatch?.user?.name}`}
      >
        <form onSubmit={handleSendExchange} className="space-y-4">
          <Input
            label="Skill You Will Teach"
            value={skillOffered}
            onChange={(e) => setSkillOffered(e.target.value)}
            placeholder="e.g. JavaScript, Python, Photoshop..."
            required
            helperText="The skill you are offering to teach them"
          />

          <Input
            label="Skill You Want to Learn"
            value={skillRequested}
            onChange={(e) => setSkillRequested(e.target.value)}
            placeholder="e.g. React.js, UI/UX Design, Flutter..."
            required
            helperText="The skill you want them to teach you"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Personalized Note / Proposal
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Suggest when and how you'd like to collaborate..."
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submittingRequest}
            >
              Send Exchange Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
