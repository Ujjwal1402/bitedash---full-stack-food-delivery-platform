import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { api } from '../../services/api.ts';
import { showToast } from '../common/Toast.tsx';
import { Send, HelpCircle } from 'lucide-react';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: number;
  onTicketCreated?: () => void;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onTicketCreated,
}) => {
  const [subject, setSubject] = useState(orderId ? `Issue with Order #${orderId}` : '');
  const [category, setCategory] = useState('ORDER_ISSUE');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setLoading(true);
    try {
      await api.post('/support', {
        order_id: orderId,
        subject: subject.trim(),
        category,
        priority: 'MEDIUM',
        message: message.trim(),
      });
      showToast('Support ticket submitted successfully', 'success');
      onClose();
      if (onTicketCreated) onTicketCreated();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Customer Support"
      description="Tell us about the issue and our team will resolve it promptly."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 font-medium"
          >
            <option value="ORDER_ISSUE">Order Issue / Missing Item</option>
            <option value="DELIVERY">Delivery Delay</option>
            <option value="PAYMENT">Payment Inquiry</option>
            <option value="REFUND">Refund Status</option>
            <option value="OTHER">Other Questions</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary..."
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please describe what happened..."
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="flex-1"
            isLoading={loading}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
