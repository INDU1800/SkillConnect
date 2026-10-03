import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Clock, Check, X, CheckCircle, Ban, MessageSquare } from 'lucide-react';
import Button from './Button';

const RequestCard = ({
  request,
  type = 'received', // 'received' or 'sent'
  onStatusUpdate,
}) => {
  const statusStyles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const otherStudent = type === 'received' ? request.sender : request.receiver;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm overflow-hidden border border-slate-200">
            {otherStudent?.avatar ? (
              <img
                src={otherStudent.avatar}
                alt={otherStudent.name}
                className="w-full h-full object-cover"
              />
            ) : (
              otherStudent?.name?.charAt(0).toUpperCase() || 'S'
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              {type === 'received' ? 'Request from' : 'Request sent to'}
            </p>
            {otherStudent ? (
              <Link
                to={`/profile/${otherStudent._id}`}
                className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                {otherStudent.name}
              </Link>
            ) : (
              <span className="text-sm font-bold text-slate-900">Former Student</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
              statusStyles[request.status] || statusStyles.pending
            }`}
          >
            {request.status}
          </span>
          <span className="text-[11px] text-slate-400">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Exchange Details */}
      <div className="py-4">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
              {type === 'received' ? 'They Offer to Teach' : 'You Offer to Teach'}
            </span>
            <span className="font-bold text-indigo-700 text-sm mt-0.5 block">
              {request.skillOffered}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
              {type === 'received' ? 'They Want to Learn' : 'You Want to Learn'}
            </span>
            <span className="font-bold text-purple-700 text-sm mt-0.5 block">
              {request.skillRequested}
            </span>
          </div>
        </div>

        {request.message && (
          <div className="mt-3 flex items-start space-x-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p className="italic">"{request.message}"</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
        {type === 'received' && request.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(request._id, 'rejected')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reject
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusUpdate(request._id, 'accepted')}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Accept Exchange
            </Button>
          </>
        )}

        {type === 'sent' && request.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusUpdate(request._id, 'cancelled')}
            className="text-slate-600 hover:text-red-600 border-slate-200"
          >
            <Ban className="w-3.5 h-3.5 mr-1" />
            Cancel Request
          </Button>
        )}

        {request.status === 'accepted' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStatusUpdate(request._id, 'completed')}
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Mark as Completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
