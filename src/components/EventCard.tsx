import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import type { EventItem } from '../types';

interface EventCardProps { event: EventItem; }

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <article className="flex gap-2.5 border-b border-navy-100 py-2 last:border-b-0">
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${event.id === 'evt_2' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-600'}`}><CalendarDays className="h-4 w-4" /></span>
    <div className="min-w-0"><h4 className="truncate text-[12px] font-extrabold text-navy-950">{event.title}</h4><p className="mt-0.5 text-[11px] font-semibold text-navy-600">{event.date}</p><p className="mt-0.5 flex items-center gap-1 text-[12px] text-navy-400"><Clock className="h-2.5 w-2.5" />{event.time}</p></div>
  </article>
);
