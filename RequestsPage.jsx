import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Inbox, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const [recRes, sentRes] = await Promise.all([
        API.get('/requests/received'),
        API.get('/requests/sent'),
      ]);
      setReceivedRequests(recRes.data);
      setSentRequests(sentRes.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Could not load exchange requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await API.put(`/requests/${requestId}`, { status });
      setFeedback(`Request marked as ${status}`);
      setTimeout(() => setFeedback(''), 4000);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  const displayedRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Exchange Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track skill barter proposals sent to you and requests you've sent to other students
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-8">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 transition border-b-2 cursor-pointer ${
            activeTab === 'received'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received ({receivedRequests.length})</span>
          {receivedRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {receivedRequests.filter((r) => r.status === 'pending').length} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 transition border-b-2 cursor-pointer ${
            activeTab === 'sent'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent by You ({sentRequests.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading requests..." />
      ) : displayedRequests.length > 0 ? (
        <div className="space-y-4">
          {displayedRequests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              type={activeTab}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'received' ? Inbox : Send}
          title={
            activeTab === 'received'
              ? 'No incoming requests yet'
              : 'No outgoing requests sent yet'
          }
          description={
            activeTab === 'received'
              ? 'When students discover your skills and want to learn from you, their proposals will show up here.'
              : 'Browse skills or check your matches to send an exchange proposal to a peer student!'
          }
          actionLabel={activeTab === 'sent' ? 'Discover Skills' : 'View Matches'}
          onAction={() =>
            window.location.assign(activeTab === 'sent' ? '/skills' : '/matches')
          }
        />
      )}
    </div>
  );
};

export default RequestsPage;
