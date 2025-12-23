'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data: dates with reviews
const reviewsData = ['2025-12-03', '2025-12-08', '2025-12-09', '2025-12-15', '2025-12-23'];

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 23)); // Set to December 23, 2025

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysInMonth = endOfMonth.getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if(reviewsData.includes(dateStr)){
        router.push(`/review/${dateStr}`);
    }
  }

  const today = new Date(2025, 11, 23);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-dark-800 border border-slate-700 rounded-lg p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-slate-400 text-sm mb-2">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasReview = reviewsData.includes(dateStr);
            const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            
            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`h-24 p-2 border border-transparent rounded-lg flex flex-col justify-between transition-colors ${hasReview ? 'cursor-pointer hover:bg-slate-700' : ''} ${isToday ? 'bg-primary/20 border-primary/50' : ''}`}
              >
                <span className={`font-semibold ${isToday ? 'text-primary' : 'text-white'}`}>{day}</span>
                {hasReview && <Dot className="self-center text-primary w-8 h-8" />}
              </div>
            );
          })}
        </div>
      </div>
      
       <div className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <Dot className="text-primary w-6 h-6"/>
                <span>Jour avec une revue de presse</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/50"></div>
                <span>Jour actuel</span>
            </div>
        </div>
    </div>
  );
}