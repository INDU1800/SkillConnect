import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const DiscoverSkillsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProficiency, setSelectedProficiency] = useState('All');

  const { user, isAuthenticated } = useAuth();

  // Exchange proposal modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSkill, setTargetSkill] = useState(null);
  const [skillOffered, setSkillOffered] = useState('');
  const [message, setMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/skills/discover', {
        params: {
          search,
          category: selectedCategory,
          proficiency: selectedProficiency,
        },
      });
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [search, selectedCategory, selectedProficiency]);

  const handleOpenRequest = (skill) => {
    if (!isAuthenticated) {
      window.location.assign('/login');
      return;
    }
    if (skill.student._id === user?._id) {
      alert('This is your own skill listing.');
      return;
    }

    setTargetSkill(skill);
    // Suggest first skill from current user's teach list as default offer
    setSkillOffered(user?.skillsToTeach?.[0]?.name || '');
    setMessage(`Hi ${skill.student.name.split(' ')[0]}! I would love to learn ${skill.name} from you.`);
    setIsModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!targetSkill) return;

    try {
      setSendingRequest(true);
      await API.post('/requests', {
        receiverId: targetSkill.student._id,
        skillOffered,
        skillRequested: targetSkill.name,
        message,
      });

      setIsModalOpen(false);
      setSuccessBanner(`Exchange request for "${targetSkill.name}" sent to ${targetSkill.student.name}!`);
      setTimeout(() => setSuccessBanner(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send exchange request');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Discover Student Skills
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse skills offered by peers on campus and find someone to learn from
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search skill (e.g. Python, UI/UX)..."
          />
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchParams(cat !== 'All' ? { category: cat } : {});
        }}
        selectedProficiency={selectedProficiency}
        onSelectProficiency={setSelectedProficiency}
      />

      {/* Success notification */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Searching skills..." />
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skills.map((skill) => (
            <SkillCard
              key={`${skill.student._id}-${skill._id}`}
              skill={skill}
              onRequest={handleOpenRequest}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No skills found"
          description={`No skills matched "${search || selectedCategory}". Try adjusting your filters or search keywords.`}
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('All');
            setSelectedProficiency('All');
          }}
        />
      )}

      {/* Propose Exchange Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Request Skill from ${targetSkill?.student?.name}`}
      >
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
              Skill You Want to Learn:
            </span>
            <span className="text-sm font-bold text-indigo-700 block mt-0.5">
              {targetSkill?.name} ({targetSkill?.category})
            </span>
          </div>

          <Input
            label="Skill You Will Teach in Return"
            value={skillOffered}
            onChange={(e) => setSkillOffered(e.target.value)}
            placeholder="e.g. JavaScript, Public Speaking, Guitar..."
            required
            helperText="What can you teach them in exchange?"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Introductory Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Introduce yourself and propose how you'd like to do the exchange..."
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
              loading={sendingRequest}
            >
              Send Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DiscoverSkillsPage;
