import React, { useState } from 'react';

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  initial: string;
  color: string;
  type: 'people' | 'groups';
}

export interface ChatMessage {
  from: 'them' | 'me';
  text: string;
  time: string;
}

const ALL_CONTACTS: ChatContact[] = [
  { id: 'ananya', name: 'Dr. Ananya Sharma', role: 'Dean Academics', initial: 'A', color: '#D9531E', type: 'people' },
  { id: 'rahul', name: 'Prof. Rahul Deshmukh', role: 'Computer Science faculty', initial: 'R', color: '#0074B8', type: 'people' },
  { id: 'priya', name: 'Ms. Priya Nair', role: 'Registrar and transcripts office', initial: 'P', color: '#23803A', type: 'people' },
  { id: 'vikram', name: 'Dr. Vikram Patil', role: 'Research and innovation cell', initial: 'V', color: '#6B4FBB', type: 'people' },
  { id: 'sneha', name: 'Prof. Sneha Kulkarni', role: 'Student welfare and hostel cell', initial: 'S', color: '#B0185A', type: 'people' },
  { id: 'cs3', name: 'Computer Science, Year 3', role: 'Group · 48 members', initial: 'C', color: '#0B2559', type: 'groups' },
  { id: 'hostel', name: 'Hostel announcements', role: 'Group · 220 members', initial: 'H', color: '#B45F06', type: 'groups' }
];

const INITIAL_MSGS: Record<string, ChatMessage[]> = {
  ananya: [
    { from: 'them', text: 'Hi Krushna, the end semester schedule is out. Do check the notice board.', time: '10:12 am' },
    { from: 'me', text: 'Thank you! I will go through it today.', time: '10:20 am' }
  ],
  rahul: [{ from: 'them', text: 'Please submit your lab record before Friday.', time: '9:41 am' }],
  priya: [{ from: 'them', text: 'Your transcript request is ready for pickup.', time: 'Yesterday' }],
  vikram: [{ from: 'them', text: 'Interested in the research internship? Drop by my cabin.', time: 'Monday' }],
  sneha: [
    { from: 'them', text: 'Your hostel room change has been approved.', time: 'Sunday' },
    { from: 'me', text: 'That is great news, thank you!', time: 'Sunday' }
  ],
  cs3: [
    { from: 'them', text: 'Anyone have the notes from yesterday’s lecture?', time: '11:05 am' },
    { from: 'them', text: 'I can share mine in a bit.', time: '11:08 am' },
    { from: 'them', text: 'Thanks, that would help a lot.', time: '11:09 am' }
  ],
  hostel: [
    { from: 'them', text: 'Mess timings will change during exam week.', time: '8:30 am' },
    { from: 'them', text: 'Details are on the notice board.', time: '8:31 am' }
  ]
};

interface UniOneChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInitial?: string;
  onUnreadChange?: (total: number) => void;
}

export const UniOneChatModal: React.FC<UniOneChatModalProps> = ({
  isOpen,
  onClose,
  userInitial = 'K',
}) => {
  const [showPane, setShowPane] = useState(false);
  const [activeId, setActiveId] = useState<string>('ananya');
  const [filter, setFilter] = useState<'all' | 'people' | 'groups'>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [unread, setUnread] = useState<Record<string, number>>({
    ananya: 0,
    rahul: 1,
    priya: 0,
    vikram: 0,
    sneha: 0,
    cs3: 3,
    hostel: 2
  });
  const [msgs, setMsgs] = useState<Record<string, ChatMessage[]>>(INITIAL_MSGS);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const contacts = ALL_CONTACTS
    .filter((c) => (filter === 'all' || c.type === filter) && (!q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)))
    .map((c) => {
      const m = msgs[c.id] || [{ from: 'them', text: 'Hello', time: 'Just now' }];
      const last = m[m.length - 1];
      const u = unread[c.id] || 0;
      return {
        ...c,
        preview: (last.from === 'me' ? 'You: ' : '') + last.text,
        time: last.time,
        unread: u,
        hasUnread: u > 0,
        bg: c.id === activeId ? '#E8F3FB' : '#FFFFFF',
        pick: () => {
          setActiveId(c.id);
          setShowPane(true);
          setUnread((prev) => ({ ...prev, [c.id]: 0 }));
        }
      };
    });

  const chips = [
    { id: 'all' as const, label: 'All' },
    { id: 'people' as const, label: 'People' },
    { id: 'groups' as const, label: 'Groups' }
  ];

  const active = ALL_CONTACTS.find((c) => c.id === activeId) || ALL_CONTACTS[0];
  const activeThread = (msgs[activeId] || []).slice().reverse().map((m) => ({
    text: m.text,
    time: m.time,
    align: m.from === 'me' ? 'flex-end' : 'flex-start',
    bg: m.from === 'me' ? '#CFEAFB' : '#FFFFFF',
    radius: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px'
  }));

  const stamp = () =>
    new Date()
      .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
      .toLowerCase();

  const handleSend = () => {
    const t = draft.trim();
    if (!t) return;
    const currentId = activeId;
    setDraft('');
    setMsgs((prev) => ({
      ...prev,
      [currentId]: [...(prev[currentId] || []), { from: 'me', text: t, time: stamp() }]
    }));

    setTimeout(() => {
      setMsgs((prev) => ({
        ...prev,
        [currentId]: [
          ...(prev[currentId] || []),
          { from: 'them', text: 'Thanks, noted. I will get back to you shortly.', time: stamp() }
        ]
      }));
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className={`chat-win ${showPane ? 'pane' : ''}`} aria-label="Messages">
      {/* Left List Pane */}
      <aside className="chat-list">
        <div style={{ background: '#0B2559', color: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FDB515', color: '#0B2559', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '19px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {userInitial}
          </span>
          <span style={{ flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '22px' }}>
            Messages
          </span>
          <button
            onClick={onClose}
            aria-label="Close messages"
            style={{ width: '40px', height: '40px', border: 0, borderRadius: '50%', background: 'rgba(255,255,255,.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"></path>
            </svg>
          </button>
        </div>

        <div style={{ padding: '12px 14px 8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ height: '44px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', background: '#F3F6FB', borderRadius: '999px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6785" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M20 20l-3.5-3.5"></path>
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search people and groups"
              placeholder="Search people and groups"
              style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', fontFamily: 'inherit', fontSize: '15px', color: '#14213D', outline: 'none' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '8px' }}>
            {chips.map((chip) => {
              const isSelected = filter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setFilter(chip.id)}
                  style={{
                    height: '34px',
                    padding: '0 16px',
                    border: 0,
                    borderRadius: '999px',
                    background: isSelected ? '#0074B8' : '#E8F3FB',
                    color: isSelected ? '#FFFFFF' : '#0B5E94',
                    fontFamily: 'inherit',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
          {contacts.map((c) => (
            <button
              key={c.id}
              className="chat-row"
              onClick={c.pick}
              style={{ background: c.bg }}
            >
              <span style={{ flex: '0 0 46px', width: '46px', height: '46px', borderRadius: '50%', background: c.color, color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.initial}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: '#0B2559', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </span>
                <span style={{ fontSize: '14px', color: '#5B6785', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.preview}
                </span>
              </span>
              <span style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#5B6785' }}>{c.time}</span>
                {c.hasUnread && (
                  <span style={{ minWidth: '22px', height: '22px', borderRadius: '11px', background: '#0074B8', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
                    {c.unread}
                  </span>
                )}
              </span>
            </button>
          ))}
          {contacts.length === 0 && (
            <p style={{ margin: 0, padding: '28px 20px', textAlign: 'center', fontSize: '15px', color: '#5B6785' }}>
              No one found. Try another name.
            </p>
          )}
        </div>
        <p style={{ margin: 0, padding: '10px 16px', borderTop: '1px solid #EEF2F8', fontSize: '13px', color: '#5B6785', textAlign: 'center' }}>
          Chats sync with Microsoft Teams
        </p>
      </aside>

      {/* Right Conversation Pane */}
      <div className="chat-pane">
        <div style={{ background: '#fff', borderBottom: '1px solid #E3E9F3', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="back-btn"
            onClick={() => setShowPane(false)}
            aria-label="Back to chats"
            style={{ width: '40px', height: '40px', border: 0, borderRadius: '50%', background: '#F3F6FB', color: '#0B2559', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6"></path>
            </svg>
          </button>
          <span style={{ flex: '0 0 44px', width: '44px', height: '44px', borderRadius: '50%', background: active.color, color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '19px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {active.initial}
          </span>
          <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#0B2559', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {active.name}
            </span>
            <span style={{ fontSize: '13px', color: '#5B6785', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {active.role}
            </span>
          </span>
        </div>

        <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column-reverse', gap: '6px' }}>
          {activeThread.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.align as any,
                maxWidth: '78%',
                background: m.bg,
                padding: '8px 12px 6px',
                borderRadius: m.radius,
                boxShadow: '0 1px 1px rgba(11,37,89,.12)'
              }}
            >
              <div style={{ fontSize: '15px', lineHeight: 1.45, color: '#14213D' }}>{m.text}</div>
              <div style={{ marginTop: '2px', fontSize: '11px', color: '#5B6785', textAlign: 'right' }}>{m.time}</div>
            </div>
          ))}
          <div style={{ alignSelf: 'center', marginBottom: '6px', padding: '4px 14px', borderRadius: '999px', background: '#fff', fontSize: '13px', fontWeight: 700, color: '#5B6785', boxShadow: '0 1px 1px rgba(11,37,89,.1)' }}>
            Today
          </div>
        </div>

        <div style={{ background: '#F3F6FB', borderTop: '1px solid #E3E9F3', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Type a message"
            placeholder="Type a message"
            style={{ flex: 1, minWidth: 0, height: '46px', padding: '0 20px', border: '1px solid #D5DEEC', borderRadius: '999px', background: '#fff', fontFamily: 'inherit', fontSize: '15px', color: '#14213D', outline: 'none' }}
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            style={{ flex: '0 0 46px', width: '46px', height: '46px', border: 0, borderRadius: '50%', background: '#0074B8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
