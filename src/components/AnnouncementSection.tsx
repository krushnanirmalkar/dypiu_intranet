import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, ExternalLink, FileText, Megaphone, Paperclip, X } from 'lucide-react';
import type { UserRole } from '../types';
import { adminApi } from '../admin/services/adminApi';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Academic' | 'Administrative' | 'Campus' | 'Urgent';
  date: string;
  content: string;
  author: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentSize?: string | null;
}

const defaultAnnouncements: AnnouncementItem[] = [
  { id: 'ann_1', title: 'Mid-Term Semester Registration & Fee Payment Portal Open', category: 'Urgent', date: 'Today', author: 'Registrar Office', content: 'Students are advised to complete mid-term registration and clear pending tuition dues before the deadline.' },
  { id: 'ann_2', title: 'Central Library Operating Hours Extended Until Midnight', category: 'Academic', date: 'Yesterday', author: 'Library Administration', content: 'Library reading halls will remain open until midnight for the upcoming mid-semester examinations.' },
  { id: 'ann_3', title: 'Scheduled Campus Network Maintenance', category: 'Administrative', date: '18 Feb 2026', author: 'IT Helpdesk', content: 'Routine network maintenance will take place Saturday from 02:00 AM to 04:00 AM.' },
];

interface AnnouncementSectionProps {
  currentRole: UserRole;
  onViewAll?: () => void;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ onViewAll }) => {
  const [items, setItems] = useState<AnnouncementItem[]>(defaultAnnouncements);
  const [selected, setSelected] = useState<AnnouncementItem | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const fetchedNotices = await adminApi.fetchNotices({ status: 'published' });
        if (Array.isArray(fetchedNotices) && fetchedNotices.length > 0) {
          const mapped: AnnouncementItem[] = fetchedNotices.map((n) => ({
            id: n.id,
            title: n.title,
            category: (['Urgent', 'Academic', 'Administrative', 'Campus'].includes(n.category) ? n.category : 'Academic') as AnnouncementItem['category'],
            date: new Date(n.createdAt).toLocaleDateString(),
            content: n.content,
            author: n.author || 'University Administration',
            attachmentUrl: n.attachmentUrl,
            attachmentName: n.attachmentName,
            attachmentSize: n.attachmentSize,
          }));
          setItems(mapped);
        }
      } catch {
        // Fallback to defaults if fetch fails
      }
    };
    void fetchNotices();
  }, []);

  const tag = (category: AnnouncementItem['category']) =>
    category === 'Urgent' ? 'bg-red-50 text-red-600' : category === 'Academic' ? 'bg-blue-50 text-blue-600' : category === 'Administrative' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';

  return (
    <section className="rounded-[14px] border border-[#e5ebf5] bg-white p-3 shadow-[0_3px_12px_rgba(15,35,75,0.03)]">
      <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Megaphone className="h-4 w-4 text-navy-800" />
          <h3 className="text-[12px] font-extrabold text-navy-950">Notice Board</h3>
        </div>
        <button onClick={onViewAll} className="flex items-center gap-1 text-[12px] font-bold text-blue-600">
          View all <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      <div>
        {items.map((item) => (
          <button key={item.id} onClick={() => setSelected(item)} className="group flex w-full items-center gap-2 border-b border-navy-100 py-2.5 text-left last:border-0">
            <span className={`h-10 w-[3px] shrink-0 rounded-full ${item.category === 'Urgent' ? 'bg-red-500' : item.category === 'Academic' ? 'bg-blue-500' : 'bg-amber-500'}`} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className={`inline-flex rounded px-1.5 py-px text-[7px] font-bold ${tag(item.category)}`}>{item.category}</span>
                {item.attachmentUrl && (
                  <span className="flex items-center gap-0.5 rounded bg-blue-50 px-1 py-px text-[7px] font-bold text-blue-700">
                    <Paperclip className="h-2.5 w-2.5" /> {item.attachmentSize ? `Attachment (${item.attachmentSize})` : 'Attachment'}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-[11px] font-extrabold leading-3.5 text-navy-950">{item.title}</span>
            </span>
            <span className="shrink-0 text-[7px] font-medium text-navy-400">{item.date}</span>
            <ChevronRight className="h-3 w-3 text-navy-300 group-hover:text-navy-700" />
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/55 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4">
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-lg p-1.5 text-navy-400 hover:bg-navy-50">
              <X className="h-4 w-4" />
            </button>
            <span className={`inline-flex rounded-md px-2 py-1 text-[12px] font-bold ${tag(selected.category)}`}>{selected.category}</span>
            <h3 className="pr-8 text-lg font-black text-navy-950">{selected.title}</h3>
            <p className="text-xs font-semibold text-navy-500">Issued by {selected.author} · {selected.date}</p>
            <p className="rounded-xl bg-navy-50 p-4 text-sm leading-6 text-navy-700 whitespace-pre-wrap">{selected.content}</p>

            {/* Document Attachment Box */}
            {selected.attachmentUrl && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {selected.attachmentName || 'Attached Document'}
                    </p>
                    {selected.attachmentSize && (
                      <p className="text-[10px] font-medium text-navy-500">
                        File Size: {selected.attachmentSize}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={selected.attachmentUrl}
                  download={selected.attachmentName || 'notice-document'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  View / Download <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
