import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

interface CalendarEvent {
  dateStr: string; // YYYY-MM-DD
  title: string;
  category: string;
  time?: string;
  location?: string;
}

export const MiniCalendar: React.FC = () => {
  // Current calendar view date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 21)); // Feb 21, 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 1, 21));

  const eventsMap: Record<string, CalendarEvent[]> = {
    '2026-02-28': [
      { dateStr: '2026-02-28', title: 'Tech Symposium 2026: AI & Beyond', category: 'Symposium', time: '09:30 AM - 04:30 PM', location: 'Main Auditorium' }
    ],
    '2026-03-05': [
      { dateStr: '2026-03-05', title: 'Annual Hackathon: Code-a-Thon 5.0', category: 'Competition', time: '24 Hours', location: 'Incubation Lab' }
    ],
    '2026-03-10': [
      { dateStr: '2026-03-10', title: 'Placement Workshop by Microsoft Engineers', category: 'Career', time: '02:00 PM - 05:00 PM', location: 'MS Teams Virtual Room' }
    ],
    '2026-03-15': [
      { dateStr: '2026-03-15', title: 'Mid-Semester Examinations Commence', category: 'Exam', time: '10:00 AM Onwards', location: 'Examination Halls' }
    ]
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 1, 21);
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const formatDateKey = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const todayKey = '2026-02-21';
  const selectedKey = formatDateKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  const selectedEvents = eventsMap[selectedKey] || [];

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-2.5 shadow-sm space-y-2 flex flex-col">
      <div>
        {/* Calendar Header */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-navy-100">
          <div className="flex items-center space-x-1.5">
            <div className="p-1 rounded-lg bg-navy-800 text-white">
              <CalendarIcon className="w-3 h-3" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-navy-900 leading-none">
                {monthNames[month]} {year}
              </h3>
              <span className="text-[9px] text-navy-400 font-medium">Academic Calendar</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleToday}
              className="px-1.5 py-0.5 text-[9px] font-bold text-navy-700 hover:text-navy-900 bg-navy-50 hover:bg-navy-100 rounded border border-navy-200 transition-colors mr-0.5"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-0.5 rounded hover:bg-navy-50 text-navy-600 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-0.5 rounded hover:bg-navy-50 text-navy-600 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-0.5 text-center mb-0.5">
          {dayNames.map((day, idx) => (
            <div key={idx} className="text-[9px] font-bold text-navy-400 py-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
          {/* Previous Month Days */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
            const dayNum = daysInPrevMonth - firstDayOfMonth + idx + 1;
            return (
              <div
                key={`prev-${idx}`}
                className="py-0.5 text-navy-300 pointer-events-none select-none"
              >
                {dayNum}
              </div>
            );
          })}

          {/* Current Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateKey = formatDateKey(year, month, dayNum);
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedKey;
            const hasEvents = !!eventsMap[dateKey];

            return (
              <button
                key={`curr-${dayNum}`}
                onClick={() => setSelectedDate(new Date(year, month, dayNum))}
                className={`py-0.5 rounded font-bold transition-all relative flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-navy-800 text-white shadow-xs'
                    : isToday
                    ? 'bg-navy-100 text-navy-900 border border-navy-300'
                    : 'hover:bg-navy-50 text-navy-800'
                }`}
              >
                <span>{dayNum}</span>

                {/* Event Indicator Dot */}
                {hasEvents && (
                  <span
                    className={`w-1 h-1 rounded-full absolute bottom-0 ${
                      isSelected ? 'bg-amber-400' : 'bg-amber-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Event Box */}
      <div className="pt-1.5 border-t border-navy-100 mt-1">
        <div className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-1">
          Events on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {selectedEvents.length > 0 ? (
          <div className="space-y-1">
            {selectedEvents.map((evt, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-navy-50 border border-navy-100">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-white text-navy-800 border border-navy-200 uppercase">
                    {evt.category}
                  </span>
                  {evt.time && (
                    <span className="text-[8px] text-navy-500 font-medium flex items-center">
                      <Clock className="w-2.5 h-2.5 mr-0.5" />
                      {evt.time}
                    </span>
                  )}
                </div>
                <h5 className="text-[10px] font-bold text-navy-900 leading-tight">{evt.title}</h5>
                {evt.location && (
                  <p className="text-[8px] text-navy-500 flex items-center mt-0.5">
                    <MapPin className="w-2.5 h-2.5 mr-0.5 shrink-0" />
                    {evt.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-1.5 text-center bg-navy-50/50 rounded-lg border border-navy-100 text-[9px] text-navy-400 font-medium">
            No events scheduled for this date.
          </div>
        )}
      </div>
    </div>
  );
};
