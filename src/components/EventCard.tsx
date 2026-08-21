import React from 'react';
import type { EventItem } from '../types';
import { Calendar, MapPin, Clock, Globe } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm hover:border-navy-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-navy-50 text-navy-800 border border-navy-200">
            {event.category}
          </span>
          {event.isOnline && (
            <span className="text-[10px] font-semibold text-navy-700 bg-navy-100/50 px-2 py-0.5 rounded flex items-center">
              <Globe className="w-3 h-3 mr-1 text-navy-800" />
              Online Event
            </span>
          )}
        </div>

        <h4 className="font-bold text-navy-900 text-sm mb-2 line-clamp-1">
          {event.title}
        </h4>

        <div className="space-y-1 text-xs text-navy-500 font-medium mb-3">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-navy-500" />
            <span className="font-semibold text-navy-800">{event.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-navy-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-navy-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>

      <button className="w-full py-1.5 rounded-lg bg-navy-50 text-navy-800 font-bold text-xs hover:bg-navy-800 hover:text-white transition-colors border border-navy-200">
        RSVP / View Event
      </button>
    </div>
  );
};
