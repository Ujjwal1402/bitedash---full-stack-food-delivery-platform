import React, { useState, useEffect } from 'react';
import { SupportTicket } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import { HelpCircle, Sparkles, Send, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const SupportPage: React.FC<{ initialOrderId?: number }> = ({ initialOrderId }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [subject, setSubject] = useState(initialOrderId ? `Issue with Order #${initialOrderId}` : '');
  const [category, setCategory] = useState<'ORDER_ISSUE' | 'PAYMENT' | 'DELIVERY' | 'REFUND' | 'OTHER'>('ORDER_ISSUE');
  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState<any>(null);

  const fetchTickets = async () => {
    try {
      const res: any = await api.get('/support/my-tickets');
      if (res.data?.tickets) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    setLastAiResponse(null);
    try {
      const res: any = await api.post('/support', {
        order_id: initialOrderId,
        subject,
        category,
        priority,
        message,
      });

      showToast('Support ticket logged successfully!', 'success');
      if (res.data?.aiAssistance) {
        setLastAiResponse(res.data.aiAssistance);
      }

      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          <span>Customer Help & AI Support Desk</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Have an issue with your order, payment, or delivery? Our 24/7 team and Gemini AI Assistant are here to help.
        </p>
      </div>

      {/* AI Instant Assistant Feedback Banner */}
      {lastAiResponse && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-200 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-900">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Automated AI Support Response:</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/80 p-4 rounded-2xl border border-orange-100">
            "{lastAiResponse.customerResponse}"
          </p>
        </div>
      )}

      {/* Ticket Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4"
      >
        <h3 className="font-extrabold text-slate-900 text-base">Submit a Support Request</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white font-medium text-slate-800"
            >
              <option value="ORDER_ISSUE">Order Issue / Missing Items</option>
              <option value="DELIVERY">Delivery Partner / Delay</option>
              <option value="PAYMENT">Payment Failure / Charges</option>
              <option value="REFUND">Refund Status</option>
              <option value="OTHER">General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white font-medium text-slate-800"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High (Urgent)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of your issue..."
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide specifics (e.g. order details, delay duration, temperature of food, etc.)..."
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden leading-relaxed"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={submitting}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Submit Ticket to Support
        </Button>
      </form>

      {/* Existing Tickets */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Your Tickets ({tickets.length})</h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-xs text-slate-500">No support tickets found.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {ticket.ticket_number}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{ticket.subject}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      ticket.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                    {ticket.category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{ticket.message}</p>

              {ticket.resolution && (
                <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Resolution:
                  </span>
                  <p className="text-slate-600 leading-relaxed">{ticket.resolution}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
