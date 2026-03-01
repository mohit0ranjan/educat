'use client';

import React, { useState, useEffect } from 'react';
import { User, LogOut, Award, CheckCircle2, MapPin, ChevronRight, Settings, BookOpen, TrendingUp, Hexagon } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in pb-20">
            <header className="flex justify-between items-center mb-10 mt-6 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-md z-50 py-4 border-b border-transparent shadow-none">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        Account Overview
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Manage your personal details and settings.</p>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Col - Identity */}
                <div className="lg:w-1/3">
                    {loading ? (
                        <Skeleton className="w-full h-[380px] rounded-[36px]" />
                    ) : (
                        <div className="bg-white rounded-[36px] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />

                            <div className="relative z-10">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[32px] flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-8 border-4 border-white transform transition-transform group-hover:scale-105 group-hover:rotate-3 duration-500">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                                    Raj Sharma
                                </h2>
                                <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-black border border-indigo-200 mb-8">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm uppercase tracking-wider">Class 10 &bull; New Delhi</span>
                                </div>
                            </div>

                            <button className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-600 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors uppercase tracking-widest text-sm shadow-sm">
                                <LogOut className="w-5 h-5" />
                                Logout Context
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Col - Stats & Links */}
                <div className="lg:w-2/3 flex flex-col gap-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        {loading ? (
                            <>
                                <Skeleton className="w-full h-[140px] rounded-[24px]" />
                                <Skeleton className="w-full h-[140px] rounded-[24px]" />
                            </>
                        ) : (
                            <>
                                <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-[20px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-slate-900 mb-1">85%</p>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Overall Attendance</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all flex flex-col sm:flex-row sm:items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-[20px] bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-slate-900 mb-1">12</p>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Mock Tests Done</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Settings Lists */}
                    <div className="flex-1 bg-white rounded-[36px] p-8 border border-slate-200 shadow-sm flex flex-col gap-4">
                        <h3 className="text-2xl font-black text-slate-900 mb-4 px-2">Account Modules</h3>

                        {loading ? (
                            [1, 2, 3].map(i => <Skeleton key={i} className="w-full h-24 rounded-[24px]" />)
                        ) : (
                            <>
                                <Link href="/reports">
                                    <div className="group rounded-[24px] p-5 border border-transparent hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[20px] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                                <TrendingUp className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <span className="block text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">My Progress Report</span>
                                                <span className="block text-slate-500 font-medium text-sm">Detailed academic analytics</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1" />
                                    </div>
                                </Link>

                                <div className="h-px bg-slate-100 mx-6 my-2" />

                                <Link href="/subjects">
                                    <div className="group rounded-[24px] p-5 border border-transparent hover:border-violet-100 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[20px] bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-sm">
                                                <BookOpen className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <span className="block text-xl font-bold text-slate-900 mb-1 group-hover:text-violet-700 transition-colors">Course & Materials</span>
                                                <span className="block text-slate-500 font-medium text-sm">Notes, Lectures, PDFs</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-violet-600 transition-colors group-hover:translate-x-1" />
                                    </div>
                                </Link>

                                <div className="h-px bg-slate-100 mx-6 my-2" />

                                <Link href="/settings">
                                    <div className="group rounded-[24px] p-5 border border-transparent hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[20px] bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors shadow-sm">
                                                <Settings className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <span className="block text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">Account Settings</span>
                                                <span className="block text-slate-500 font-medium text-sm">Passwords, Notifications, App</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-800 transition-colors group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
