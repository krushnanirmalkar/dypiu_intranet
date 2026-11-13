import React, { useState } from 'react';
import {
  X,
  Search,
  Send,
  MessageSquare,
  Users,
  CheckCheck,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  isGroup?: boolean;
  unreadCount?: number;
  lastMessage: string;
  lastTime: string;
}

const DEFAULT_CONTACTS: ChatContact[] = [
  {
    id: 'grp_cse_core',
    name: 'B.Tech CSE Official 2026',
    role: '124 members · Academic Group',
    department: 'School of Computer Science',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    isGroup: true,
    unreadCount: 2,
    lastMessage: 'Prof. Deshmukh: Please review the lab submission guidelines by 5 PM.',
    lastTime: '11:42 AM',
  },
  {
    id: 'fac_deshmukh',
    name: 'Prof. Rahul Deshmukh',
    role: 'Faculty Coordinator (CSE)',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 1,
    lastMessage: 'Your capstone abstract draft looks good. Bring physical copy tomorrow.',
    lastTime: '10:15 AM',
  },
  {
    id: 'fac_ananya',
    name: 'Dr. Ananya Sharma',
    role: 'Dean of Academics',
    department: 'Academic Office',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    status: 'away',
    unreadCount: 0,
    lastMessage: 'The syllabus revision committee will convene this Thursday at 3:00 PM.',
    lastTime: 'Yesterday',
  },
  {
    id: 'grp_innovatex',
    name: 'InnovateX Hackathon Core Team',
    role: '18 members · Student Council',
    department: 'Innovation Cell',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 0,
    lastMessage: 'Team: Mentor registration link is now active on UniSync.',
    lastTime: 'Yesterday',
  },
  {
    id: 'reg_office',
    name: 'Registrar & Helpdesk',
    role: 'Administrative Office',
    department: 'Registrar Wing',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    status: 'busy',
    unreadCount: 0,
    lastMessage: 'Your bonafide certificate request has been approved and issued.',
    lastTime: 'Monday',
  },
  {
    id: 'std_priya',
    name: 'Priya Verma',
    role: 'Student · CSE 3rd Year',
    department: 'B.Tech CSE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 0,
    lastMessage: 'Hey! Did you finish question 4 of cloud computing assignment?',
    lastTime: 'Sunday',
  },
];

interface ChatMessage {
  id: string;
  senderId: 'me' | 'them';
  senderName: string;
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  grp_cse_core: [
    {
      id: 'm1',
      senderId: 'them',
      senderName: 'Prof. Rahul Deshmukh',
      text: 'Good morning everyone. Please note that the cloud computing practical batch 2 session is rescheduled to 2:30 PM.',
      time: '09:30 AM',
    },
    {
      id: 'm2',
      senderId: 'them',
      senderName: 'CR - Tanmay',
      text: 'Noted Sir! We have informed all students in Hall 4.',
      time: '09:45 AM',
    },
    {
      id: 'm3',
      senderId: 'them',
      senderName: 'Prof. Rahul Deshmukh',
      text: 'Please review the lab submission guidelines by 5 PM.',
      time: '11:42 AM',
    },
  ],
  fac_deshmukh: [
    {
      id: 'm1',
      senderId: 'me',
      senderName: 'You',
      text: 'Respected Sir, I have uploaded the updated capstone architecture diagram on Juno for review.',
      time: '09:12 AM',
    },
    {
      id: 'm2',
      senderId: 'them',
      senderName: 'Prof. Rahul Deshmukh',
      text: 'Your capstone abstract draft looks good. Bring physical copy tomorrow.',
      time: '10:15 AM',
    },
  ],
};

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({ isOpen, onClose }) => {
  const [contacts, setContacts] = useState<ChatContact[]>(DEFAULT_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string>('grp_cse_core');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'groups' | 'people'>('all');
  const [messagesState, setMessagesState] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const activeContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'groups') return Boolean(contact.isGroup);
    if (filterType === 'people') return !contact.isGroup;
    return true;
  });

  const currentMessages = messagesState[selectedContactId] || [
    {
      id: 'm_def',
      senderId: 'them',
      senderName: activeContact.name,
      text: `Hello! This is the official channel for ${activeContact.name}. How can we assist you today?`,
      time: 'Just now',
    },
  ];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesState((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMsg],
    }));

    // Update last message in contact list
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContactId
          ? { ...c, lastMessage: `You: ${inputText.trim()}`, lastTime: 'Just now' }
          : c
      )
    );

    setInputText('');
  };

  const getStatusBadge = (status: ChatContact['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500 ring-2 ring-white';
      case 'busy':
        return 'bg-rose-500 ring-2 ring-white';
      case 'away':
        return 'bg-amber-500 ring-2 ring-white';
      default:
        return 'bg-slate-300 ring-2 ring-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Outer Window (WhatsApp Web / MS Teams container) */}
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[86vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden">
        
        {/* Top App Header */}
        <div className="bg-[#0E0F8C] px-4 py-3 sm:py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#00AFEF] border border-white/15">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base tracking-tight leading-tight">
                  Campus Connect Messenger
                </h3>
                <span className="text-[10px] font-medium bg-[#00AFEF]/25 text-[#73d7ff] px-2 py-0.5 rounded-full border border-[#00AFEF]/30">
                  MS Teams & UniSync
                </span>
              </div>
              <p className="text-[11px] text-blue-100/80 leading-none mt-0.5">
                Real-time messaging for students, faculty & university departments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://teams.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-all"
            >
              <span>Open in Teams</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Close Messenger"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messenger Body: Left List + Right Conversation Pane */}
        <div className="flex-1 min-h-0 flex overflow-hidden bg-slate-50">
          
          {/* Left Column: Search & Contact/Group List */}
          <div className="w-full sm:w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
            {/* Search Input Bar */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/70">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search people, staff, groups..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#00AFEF] focus:ring-2 focus:ring-[#00AFEF]/15 transition-all text-slate-800 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Segmented Filter Pills */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                    filterType === 'all'
                      ? 'bg-[#0E0F8C] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  All chats
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('groups')}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    filterType === 'groups'
                      ? 'bg-[#0E0F8C] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Groups</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('people')}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                    filterType === 'people'
                      ? 'bg-[#0E0F8C] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  Direct
                </button>
              </div>
            </div>

            {/* Contacts & Groups Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No matching chats or people found
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = contact.id === selectedContactId;
                  return (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContactId(contact.id)}
                      className={`w-full text-left p-3 flex items-start gap-3 transition-colors cursor-pointer relative ${
                        isSelected
                          ? 'bg-blue-50/90 border-l-4 border-[#0E0F8C]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusBadge(
                            contact.status
                          )}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {contact.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {contact.lastTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {contact.role}
                        </p>
                        <p className="text-[11px] text-slate-600 truncate mt-1">
                          {contact.lastMessage}
                        </p>
                      </div>

                      {Boolean(contact.unreadCount && contact.unreadCount > 0) && (
                        <span className="self-center ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#00AFEF] text-white">
                          {contact.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat Conversation Thread (WhatsApp / Teams style) */}
          <div className="hidden sm:flex flex-1 flex-col bg-[#F9FAFC] relative">
            
            {/* Conversation Header Bar */}
            <div className="h-14 px-4 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${getStatusBadge(
                      activeContact.status
                    )}`}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
                    {activeContact.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {activeContact.role} · <span className="capitalize text-emerald-600 font-medium">{activeContact.status}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <button
                  type="button"
                  title="Voice call"
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Video meeting"
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="More actions"
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Message Scroll Area (WhatsApp Web feel) */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
            >
              {/* Security info disclaimer */}
              <div className="text-center my-2">
                <span className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                  🔒 Messages are protected by university campus directory SSO policy
                </span>
              </div>

              {currentMessages.map((msg) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && (
                      <span className="text-[10px] font-semibold text-slate-500 mb-1 ml-1">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`max-w-md sm:max-w-lg px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#0E0F8C] text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[9px] flex items-center justify-end gap-1 mt-1 font-medium ${
                          isMe ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#00AFEF]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Bottom Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeContact.name}...`}
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00AFEF] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#0E0F8C] text-white hover:bg-[#070868] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
