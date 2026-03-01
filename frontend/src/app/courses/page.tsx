'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, User, PlayCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';
import { fetchCourses } from "@/lib/api";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchCourses();
                if (data && data.length) {
                    setCourses(data);
                } else {
                    // Fallback
                    setCourses([
                        { id: 1, attributes: { title: "Next.js & React Native App Router", instructor: "Jane Doe" } },
                        { id: 2, attributes: { title: "Strapi Headless CMS", instructor: "John Smith" } },
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 mt-6 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-md z-50 py-4 border-b border-transparent shadow-none gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        My Courses
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Pick up where you left off</p>
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-[20px] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Enroll Course
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <Skeleton key={i} className="w-full h-[360px] rounded-[36px]" />
                    ))
                ) : courses.map((course: any, i: number) => {
                    const progress: number = i === 0 ? 85 : i === 1 ? 30 : 0;
                    return (
                        <Link href={`/courses/${course.id}`} key={course.id} className="block group">
                            <div className="bg-white rounded-[36px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 group-hover:-translate-y-2 flex flex-col h-full relative">

                                {/* Header / Cover */}
                                <div className={`h-40 bg-gradient-to-br ${i === 0 ? 'from-indigo-400 to-violet-600' : 'from-emerald-400 to-teal-600'} p-6 relative`}>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-white text-xs font-black shadow-sm">
                                        <BookOpen className="w-4 h-4" /> Enrolled
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-8 pb-10 flex-1 flex flex-col relative">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center absolute -top-8 group-hover:scale-110 transition-transform -rotate-3 group-hover:rotate-0">
                                        <PlayCircle className={`w-8 h-8 ${i === 0 ? 'text-indigo-600' : 'text-emerald-600'}`} />
                                    </div>

                                    <div className="mt-8 flex-1">
                                        <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors mb-2 leading-tight">
                                            {course.attributes.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold mb-8">
                                            <User className="w-4 h-4" /> {course.attributes.instructor}
                                        </div>
                                    </div>

                                    {/* Progress Footer */}
                                    <div className="mt-auto">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{progress}% Completed</span>
                                            <span className="text-sm font-black text-slate-900">{progress === 100 ? 'Done' : 'Continue'}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${i === 0 ? 'from-indigo-400 to-indigo-600' : 'from-emerald-400 to-emerald-600'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
