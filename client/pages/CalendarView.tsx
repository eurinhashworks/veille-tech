import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../types';

interface CalendarViewProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ reviews, onSelectReview }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const reviewsByDate = useMemo(() => {
    const map = new Map<string, Review>();
    reviews.forEach(review => {
      map.set(review.metadata.date, review);
    });
    return map;
  }, [reviews]);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const review = reviewsByDate.get(dateStr);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    days.push(
      <div
        key={day}
        onClick={() => review && onSelectReview(review)}
        className={`aspect-square p-2 border border-slate-700 rounded-lg transition-all ${
          review ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : 'bg-dark-800'
        } ${isToday ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="text-sm font-medium text-slate-300">{day}</div>
        {review && (
          <div className="mt-1">
            <div className="w-2 h-2 rounded-full bg-primary mx-auto" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <CalendarIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white">Calendrier</h1>
      </div>

      <div className="bg-dark-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-xl font-semibold text-white">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Revue disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-primary" />
            <span>Aujourd'hui</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
