'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, FlaskConical, Magnet, Beaker, Book, SlidersHorizontal, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';

const SUBJECTS = [
    { id: '1', name: 'Mathematics', desc: 'Algebra, Geometry, Trigonometry', icon: Calculator, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20', progress: 65, chapters: 14 },
    { id: '2', name: 'Science', desc: 'Physics, Chemistry, Biology', icon: FlaskConical, color: 'from-emerald-400 to-teal-600', shadow: 'shadow-teal-500/20', progress: 42, chapters: 16 },
    { id: '3', name: 'Physics', desc: 'Mechanics & Thermodynamics', icon: Magnet, color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20', progress: 80, chapters: 10 },
    { id: '4', name: 'Chemistry', desc: 'Organic & Inorganic', icon: Beaker, color: 'from-orange-400 to-rose-500', shadow: 'shadow-orange-500/20', progress: 20, chapters: 12 },
    { id: '5', name: 'English', desc: 'Grammar & Literature', icon: Book, color: 'from-sky-400 to-cyan-600', shadow: 'shadow-sky-500/20', progress: 50, chapters: 8 },
];

export default function SubjectsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in pb-20">
            <header className="flex justify-between items-center mb-10 mt-6 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-md z-50 py-4 border-b border-transparent shadow-none">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        Course Catalog
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Master your high school curriculum</p>
                </div>

                <button className="w-14 h-14 bg-white rounded-[20px] shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                    <SlidersHorizontal className="w-6 h-6 text-slate-700 group-hover:scale-110 group-hover:text-indigo-600 transition-transform" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <Skeleton className="w-full h-[320px] rounded-[32px]" />
                        </div>
                    ))
                ) : SUBJECTS.map((sub, idx) => {
                    const Icon = sub.icon;
                    return (
                        <Link href={`/courses/${sub.id}`} key={sub.id} className="block group">
                            <div className={`relative overflow-hidden rounded-[36px] bg-gradient-to-br ${sub.color} p-8 flex flex-col h-full shadow-xl ${sub.shadow} transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl`}>

                                {/* Background Web Design Artifacts */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-1000" />
                                <div className="absolute -right-6 -bottom-6 opacity-[0.08] transform -rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-6 pointer-events-none">
                                    <Icon size={240} color="white" strokeWidth={1} />
                                </div>

                                {/* Top Bar */}
                                <div className="relative z-10 flex justify-between items-start mb-auto pb-12">
                                    <div className="w-20 h-20 rounded-[24px] bg-white/20 border-2 border-white/40 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <Icon className="w-10 h-10 text-white drop-shadow-md" />
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transform transition-transform group-hover:scale-105">
                                        <CheckCircle2 className={`w-4 h-4 text-emerald-500`} />
                                        <span className={`text-sm font-black text-slate-900`}>
                                            {sub.progress}% Done
                                        </span>
                                    </div>
                                </div>

                                {/* Title & Text */}
                                <div className="relative z-10 mb-8 pt-8">
                                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight group-hover:text-amber-100 transition-colors">
                                        {sub.name}
                                    </h2>
                                    <p className="text-white/80 text-lg font-medium">
                                        {sub.desc}
                                    </p>
                                </div>

                                {/* Footer Progress */}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <FileText className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-white font-extrabold">{sub.chapters} Chapters</span>
                                        </div>
                                    </div>

                                    <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                        <div
                                            className="h-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-1000 ease-out relative"
                                            style={{ width: `${sub.progress}%` }}
                                        >
                                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-black/10" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
