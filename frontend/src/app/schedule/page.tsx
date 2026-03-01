'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Video, BookOpen, Building } from 'lucide-react';
import Skeleton from '@/components/Skeleton';

const SCHEDULE = [
    { id: 1, subject: 'Mathematics', type: 'Offline Class', time: '10:00 AM - 11:30 AM', teacher: 'R. K. Sharma', location: 'Center A, Room 102', color: 'from-blue-500 to-indigo-600', iconColor: 'text-blue-600', bgIcon: 'bg-blue-50 border border-blue-100' },
    { id: 2, subject: 'Physics', type: 'Online Live', time: '02:00 PM - 03:00 PM', teacher: 'Dr. Verma', location: 'Zoom Link', color: 'from-violet-500 to-purple-600', iconColor: 'text-violet-600', bgIcon: 'bg-violet-50 border border-violet-100' },
    { id: 3, subject: 'Chemistry', type: 'Offline Class', time: '04:00 PM - 05:30 PM', teacher: 'S. Patel', location: 'Center B, Lab 1', color: 'from-orange-400 to-rose-500', iconColor: 'text-orange-600', bgIcon: 'bg-orange-50 border border-orange-100' },
];

export default function SchedulePage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in pb-20">
            <header className="flex justify-between items-center mb-10 mt-6 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-md z-50 py-4 border-b border-transparent shadow-none">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        Weekly Schedule
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Your academic calendar planned ahead.</p>
                </div>

                <button className="w-14 h-14 bg-white rounded-[20px] shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                    <Calendar className="w-6 h-6 text-slate-700 group-hover:scale-110 group-hover:text-indigo-600 transition-transform" />
                </button>
            </header>

            {/* Weekly Days Scroller */}
            <div className="flex overflow-x-auto gap-4 md:gap-6 mb-12 pb-4 scrollbar-hide">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => {
                    const isActive = idx === 1;
                    return (
                        <div
                            key={idx}
                            className={`min-w-[140px] h-36 rounded-3xl flex flex-col items-center justify-center border transition-all cursor-pointer shadow-sm ${isActive
                                    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/30 text-white transform -translate-y-2 scale-105'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                                }`}
                        >
                            <span className={`text-sm font-bold mb-3 tracking-widest uppercase ${isActive ? 'text-indigo-200' : ''}`}>{day}</span>
                            <span className={`text-4xl font-black ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                {12 + idx}
                            </span>
                        </div>
                    );
                })}
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-6">Tuesday's Routine</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="w-full h-[380px] rounded-[36px]" />)
                ) : SCHEDULE.map((item) => (
                    <div key={item.id} className="bg-white rounded-[36px] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group flex flex-col h-full hover:-translate-y-2 duration-300">

                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ${item.bgIcon}`}>
                                <BookOpen className={`w-10 h-10 ${item.iconColor}`} />
                            </div>

                            <div className={`flex flex-col items-end gap-2`}>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${item.type === 'Online Live' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                    {item.type === 'Online Live' ? <Video className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                                    <span className="text-xs font-black uppercase tracking-wider">{item.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-700 transition-colors">{item.subject}</h3>
                            <p className="text-slate-500 font-bold text-lg mb-6">{item.teacher}</p>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600 font-medium">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    <span>{item.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium">
                                    <MapPin className="w-5 h-5 text-indigo-500" />
                                    <span>{item.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <button className={`w-full py-4 rounded-xl font-bold transition-transform hover:scale-[1.03] active:scale-95 text-center ${item.type === 'Online Live'
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                                    : 'bg-slate-100 hover:bg-slate-200 border-2 border-transparent hover:border-slate-300 text-slate-800'
                                }`}>
                                {item.type === 'Online Live' ? 'Join Stream' : 'Class Details'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
