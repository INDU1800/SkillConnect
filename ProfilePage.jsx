import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Compass,
  Edit3,
  Send,
  CheckCircle2,
  Calendar,
  Mail,
  ExternalLink,
} from 'lucide-react';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Input from '../components/Input';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Exchange proposal modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [message, setMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/users/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Student profile not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const isOwner = currentUser?._id === id;

  const handleOpenPropose = (requestedSkillName = '') => {
    if (!isAuthenticated) {
      window.location.assign('/login');
      return;
    }
    setSkillOffered(currentUser?.skillsToTeach?.[0]?.name || '');
    setSkillRequested(requestedSkillName || student?.skillsToTeach?.[0]?.name || '');
    setMessage(`Hi ${student.name.split(' ')[0]}! I'd like to collaborate with you.`);
    setIsModalOpen(true);
  };

  const handleSendExchange = async (e) => {
    e.preventDefault();
    try {
      setSendingRequest(true);
      await API.post('/requests', {
        receiverId: student._id,
        skillOffered,
        skillRequested,
        message,
      });

      setIsModalOpen(false);
      setSuccessBanner(`Exchange proposal sent to ${student.name}!`);
      setTimeout(() => setSuccessBanner(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading student profile..." />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Profile Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || 'This student profile does not exist.'}</p>
        <Link to="/skills">
          <Button variant="primary" size="sm">
            Back to Skills Discovery
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-3xl overflow-hidden border-2 border-indigo-200 shrink-0">
            {student.avatar ? (
              <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              student.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{student.name}</h1>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start mt-1">
                  <GraduationCap className="w-4 h-4 mr-1 text-slate-400" />
                  <span>{student.college || 'College Student'}</span>
                </p>
                {student.course && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {student.course} {student.year ? `• ${student.year}` : ''}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div>
                {isOwner ? (
                  <Link to="/profile/edit">
                    <Button variant="outline" size="sm" className="space-x-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit My Profile</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenPropose()}
                    className="space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Propose Exchange</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Bio */}
            {student.bio ? (
              <p className="mt-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                "{student.bio}"
              </p>
            ) : (
              <p className="mt-4 text-xs text-slate-400 italic">No biography provided yet.</p>
            )}

            {/* Contact Information */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                Contact:
              </span>

              {/* Email Address */}
              {student.email && (
                <a
                  href={`mailto:${student.email}`}
                  className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-indigo-600 transition font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200"
                  title="Send email"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{student.email}</span>
                </a>
              )}

              {/* LinkedIn Profile */}
              {student.linkedin ? (
                <a
                  href={
                    student.linkedin.startsWith('http')
                      ? student.linkedin
                      : `https://${student.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-blue-600 transition font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200"
                  title="View LinkedIn Profile"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
                  <span>LinkedIn Profile</span>
                </a>
              ) : isOwner ? (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-indigo-600 transition text-[11px]"
                  title="Add LinkedIn URL"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="italic">Add LinkedIn URL</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills They Teach */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Skills Offered to Teach ({student.skillsToTeach?.length || 0})
            </h2>
          </div>

          {student.skillsToTeach?.length > 0 ? (
            <div className="space-y-3">
              {student.skillsToTeach.map((skill) => (
                <div
                  key={skill._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                      <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                        {skill.proficiency}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{skill.category}</span>
                    {skill.description && (
                      <p className="text-xs text-slate-600 mt-1.5">{skill.description}</p>
                    )}
                  </div>

                  {!isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPropose(skill.name)}
                      className="shrink-0 text-xs py-1 px-2.5"
                    >
                      Request
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              No teaching skills listed.
            </p>
          )}
        </div>

        {/* Skills They Want to Learn */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100">
            <Compass className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">
              Skills Seeking to Learn ({student.skillsToLearn?.length || 0})
            </h2>
          </div>

          {student.skillsToLearn?.length > 0 ? (
            <div className="space-y-3">
              {student.skillsToLearn.map((skill) => (
                <div
                  key={skill._id}
                  className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                      <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {skill.proficiency || 'Target'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{skill.category}</span>
                    {skill.description && (
                      <p className="text-xs text-slate-600 mt-1.5">{skill.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              No learning desires listed.
            </p>
          )}
        </div>
      </div>

      {/* Propose Exchange Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Exchange Request for ${student.name}`}
      >
        <form onSubmit={handleSendExchange} className="space-y-4">
          <Input
            label="Skill You Will Teach"
            value={skillOffered}
            onChange={(e) => setSkillOffered(e.target.value)}
            placeholder="Skill you will teach"
            required
          />

          <Input
            label="Skill You Want to Learn"
            value={skillRequested}
            onChange={(e) => setSkillRequested(e.target.value)}
            placeholder="Skill you want from them"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Proposal Note
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Introduce your idea or suggest a study plan..."
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

export default ProfilePage;
