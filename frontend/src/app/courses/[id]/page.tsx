'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { fetchCourseBySlug } from "@/lib/api";
import { BookOpen, Video, FileText, Download, ArrowLeft, PlayCircle, Lock, LayoutGrid, CheckCircle2 } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import { use } from 'react';

export default function CourseDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourse() {
            setLoading(true);
            try {
                let data = await fetchCourseBySlug(resolvedParams.id);
                if (!data) {
                    // Fallback mock
                    data = {
                        attributes: {
                            title: "Next.js & React Native Fullstack Masterclass",
                            instructor: "Jane Doe",
                            description: "Learn how to build modern scalable applications from scratch with deep dives into server actions and app router.",
                            modules: {
                                data: [
                                    {
                                        id: 1,
                                        attributes: {
                                            title: "Getting Started with Next.js",
                                            lectures: {
                                                data: [
                                                    { id: 101, attributes: { title: "App Router Deep Dive", duration: 15, videoUrl: "https://youtube.com/..." } },
                                                    { id: 102, attributes: { title: "Server Actions & API Routes", duration: 25, videoUrl: "https://youtube.com/..." } }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        id: 2,
                                        attributes: {
                                            title: "React Native Essentials",
                                            lectures: {
                                                data: [
                                                    { id: 201, attributes: { title: "Expo Setup", duration: 10, videoUrl: "https://youtube.com/..." } },
                                                    { id: 202, attributes: { title: "Native UI Components", duration: 30, videoUrl: "https://youtube.com/..." } }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    };
                }
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadCourse();
    }, [resolvedParams.id]);

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* Nav */}
            <header className="mb-6 mt-6 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-md z-50 py-4 border-b border-transparent shadow-none">
                <Link href="/courses">
                    <button className="text-slate-500 hover:text-indigo-600 uppercase tracking-widest text-xs font-black flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to My Courses
                    </button>
                </Link>
            </header>

            {/* Hero Card */}
            {loading ? (
                <Skeleton className="w-full h-[340px] rounded-[36px] mb-12" />
            ) : (
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 md:p-14 rounded-[40px] shadow-2xl shadow-indigo-600/20 mb-12 border border-indigo-500/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:opacity-10 transition-opacity duration-1000" />

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 mb-6">
                            <BookOpen className="w-4 h-4 text-indigo-100" />
                            <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Premium Course</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">{course?.attributes?.title}</h1>
                        <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-medium">{course?.attributes?.description}</p>

                        <div className="flex items-center gap-6 bg-black/20 backdrop-blur-md rounded-2xl p-4 w-fit border border-white/10 shadow-inner">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-xl border border-white/20">
                                {course?.attributes?.instructor?.split(' ').map((n: string) => n[0]).join('') || 'JD'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-1">Lead Instructor</p>
                                <p className="font-extrabold text-white text-lg tracking-wide">{course?.attributes?.instructor}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left: Modules */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <LayoutGrid className="w-8 h-8 text-indigo-600" />
                            Course Content
                        </h2>
                    </div>

                    {loading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="w-full h-24 rounded-[24px] mb-4" />)
                    ) : course?.attributes?.modules?.data?.map((module: any, index: number) => (
                        <div key={module.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-200 transition-all hover:border-indigo-300 hover:shadow-xl group mb-6">

                            <div className="bg-slate-50 p-6 md:p-8 flex justify-between items-center cursor-pointer border-b border-slate-100">
                                <div>
                                    <span className="text-sm font-black text-indigo-600 uppercase tracking-widest block mb-2">Section {index + 1}</span>
                                    <h3 className="font-black text-2xl text-slate-900 group-hover:text-indigo-700 transition-colors">{module.attributes.title}</h3>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                                    <Video className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-600">{module.attributes.lectures?.data?.length || 0} Lectures</span>
                                </div>
                            </div>

                            <ul className="divide-y divide-slate-100">
                                {module.attributes.lectures?.data?.map((lecture: any, lIdx: number) => (
                                    <li key={lecture.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group/item">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors shadow-inner">
                                                <PlayCircle className="w-5 h-5" fill="currentColor" />
                                            </div>
                                            <div>
                                                <span className="text-lg font-bold text-slate-700 group-hover/item:text-indigo-700 transition-colors block mb-1">
                                                    {lIdx + 1}. {lecture.attributes.title}
                                                </span>
                                                <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                                    <BookOpen className="w-3 h-3" /> Video Lesson
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                                            <span className="text-sm font-black text-slate-600">{lecture.attributes.duration}m</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Right: Resources & Downloads */}
                <div>
                    {loading ? (
                        <Skeleton className="w-full h-96 rounded-[36px]" />
                    ) : (
                        <div className="bg-white rounded-[36px] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 h-fit sticky top-32">
                            <h3 className="font-black text-2xl mb-8 text-slate-900 flex items-center gap-3">
                                <FileText className="w-7 h-7 text-rose-500" />
                                Materials & PDFs
                            </h3>

                            <ul className="space-y-4">
                                <li>
                                    <Link href="/pdf?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&title=Syllabus" className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer w-full text-left">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Course Syllabus.pdf</span>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">PDF Document • 1.2 MB</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                            <Download className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pdf?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&title=Chapter%201%20Notes" className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer w-full text-left">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Chapter 1 Notes.pdf</span>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Handouts • 4.5 MB</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                                            <Download className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
