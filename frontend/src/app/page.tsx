'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, BookOpen, Award, CalendarDays, Video, Bell, Users, FileText, Activity, LayoutDashboard, Calendar, FilePlus2, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';
import { fetchCourses, fetchLiveClasses, fetchAnnouncements } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Session check
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setRole(user?.roleType || 'student');
      setUserName(user?.username || 'User');
    } catch (e) {
      setRole('student');
    }

    const loadDashboardData = async () => {
      try {
        const [courseData, liveData, annData] = await Promise.all([
          fetchCourses(),
          fetchLiveClasses(),
          fetchAnnouncements()
        ]);
        setCourses(courseData || []);
        setLiveClasses(liveData || []);
        setAnnouncements(annData || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [router]);

  // Loading State
  if (role === null && loading) {
    return <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>;
  }

  // --- STUDENT DASHBOARD VIEW ---
  const StudentDashboardContent = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Col (2-span) */}
      <div className="xl:col-span-2 space-y-8">
        {/* Progress Glass Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[32px] p-8 shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-100" />
                <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Academic Year 2026</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Your Progress</h3>
              <p className="text-indigo-200 font-medium">Synced with your latest classroom performance.</p>
            </div>
            <div className="relative w-28 h-28 hidden md:block">
              <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
                <path className="text-indigo-900/40" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-white" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-white">85%</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center gap-4">
              <Award className="w-6 h-6 text-white" />
              <div>
                <p className="text-3xl font-black text-white mb-1">A+</p>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Grade</p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center gap-4">
              <CalendarDays className="w-6 h-6 text-white" />
              <div>
                <p className="text-3xl font-black text-white mb-1">92%</p>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Attendance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule Live From Strapi */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900">Today's Live Sessions</h3>
            <Link href="/schedule" className="text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
              View Full Calendar
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-32 rounded-3xl" />
              <Skeleton className="w-full h-32 rounded-3xl" />
            </div>
          ) : liveClasses.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
              <Video className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold">No live classes scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-4 font-inter">
              {liveClasses.map((cls: any) => (
                <div key={cls.id} className="bg-white rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Scheduled At</span>
                      <span className="text-2xl font-black text-slate-900 leading-none">{new Date(cls.attributes.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="h-10 w-[2px] bg-slate-100 hidden md:block" />
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Video className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold text-slate-900 mb-1">{cls.attributes.title}</h4>
                        <p className="text-sm font-bold text-indigo-600">Click to join streaming portal</p>
                      </div>
                    </div>
                  </div>
                  <a href={cls.attributes.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-6 md:mt-0 px-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all scale-100 active:scale-95 group-hover:shadow-lg group-hover:shadow-indigo-600/20">
                    Join Stream
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Col */}
      <div className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6 px-2">Your Subjects</h3>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-36 rounded-2xl" />)
            ) : (
              courses.map((course: any) => (
                <Link href={`/courses/${course.id}`} key={course.id} className="group">
                  <div className="flex flex-col items-center justify-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-6 h-full transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500 shadow-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-extrabold text-slate-700 text-sm text-center line-clamp-1">{course.attributes.title}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-extrabold text-slate-900">Notice Board</h3>
          </div>
          <div className="space-y-4">
            {loading ? (
              <Skeleton className="w-full h-40 rounded-2xl" />
            ) : announcements.length === 0 ? (
              <p className="text-slate-400 text-center font-bold text-sm py-4 italic">No new broadcast messages.</p>
            ) : (
              announcements.map((ann: any) => (
                <div key={ann.id} className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                  <h4 className="font-black text-amber-900 mb-1">{ann.attributes.title}</h4>
                  <p className="text-sm font-medium text-amber-800 leading-relaxed mb-3">{ann.attributes.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // --- TEACHER DASHBOARD VIEW ---
  const TeacherDashboardContent = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

      {/* Quick Stats overview */}
      <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Students</p>
            <p className="text-3xl font-black text-slate-900">482</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Attendance</p>
            <p className="text-3xl font-black text-slate-900">88%</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Assignments</p>
            <p className="text-3xl font-black text-slate-900">14</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#5B4EFA] to-[#4035D6] rounded-3xl p-6 shadow-lg shadow-indigo-200 flex items-center gap-5 hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm z-10 border border-white/20">
            <Video className="w-7 h-7" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-1">Live Action</p>
            <p className="text-2xl font-black text-white">Start Class</p>
          </div>
        </div>
      </div>

      <div className="xl:col-span-3 space-y-8">
        {/* Course Performance or Overview */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900">Assigned Courses</h3>
            <button className="text-indigo-600 font-bold hover:underline">Manage All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [1, 2].map(i => <Skeleton key={i} className="w-full h-40 rounded-2xl" />)
            ) : courses.length === 0 ? (
              <div className="col-span-2 text-center text-slate-500 font-bold py-10">No courses assigned to you yet.</div>
            ) : (
              courses.map((course: any) => (
                <div key={course.id} className="border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all rounded-[24px] p-6">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-800 line-clamp-1">{course.attributes.title}</h4>
                      <p className="text-sm font-semibold text-slate-500 mt-1">{course.attributes.description?.slice(0, 50) || 'Course curriculum and syllabus'}...</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600">Grade 10</span>
                    <span className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600">Active</span>
                  </div>
                </div>
              ))
            )}
            <div className="border-2 border-dashed border-slate-200 bg-transparent hover:bg-slate-50 transition-colors cursor-pointer rounded-[24px] flex flex-col items-center justify-center min-h-[160px] group">
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                <FilePlus2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <span className="font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Create New Course</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-6">Upcoming Teaching Hours</h3>
          {loading ? (
            <Skeleton className="w-full h-32 rounded-3xl" />
          ) : liveClasses.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mb-4 mx-auto" />
              <p className="text-slate-500 font-bold">No classes on schedule today. Enjoy your break!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {liveClasses.map((cls: any) => (
                <div key={cls.id} className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-6">
                    <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-indigo-600 border border-indigo-100">
                      <span className="text-xl font-black leading-none mb-1">{new Date(cls.attributes.scheduledAt).getHours()}</span>
                      <span className="text-xs font-black uppercase">{new Date(cls.attributes.scheduledAt).getHours() >= 12 ? 'PM' : 'AM'}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{cls.attributes.title}</h4>
                      <p className="text-slate-500 font-semibold text-sm flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4" /> Batch A & B
                      </p>
                    </div>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95 w-full md:w-auto">
                    Host Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="xl:col-span-1 space-y-8">
        {/* Homework Approval / Tasks */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-700 blur-[40px] opacity-50 rounded-full" />
          <h3 className="text-xl font-extrabold mb-6 relative z-10">To-Do List</h3>
          <div className="space-y-4 relative z-10">
            {[
              { title: "Grade Math Quizzes", type: "Urgent", color: "bg-rose-500" },
              { title: "Upload Lecture Notes", type: "Standard", color: "bg-blue-500" },
              { title: "Review New Syllabus", type: "Standard", color: "bg-blue-500" },
            ].map((task, i) => (
              <div key={i} className="flex items-start gap-4">
                <button className="mt-1 w-6 h-6 rounded-full border-2 border-slate-600 flex-shrink-0 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 group transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                </button>
                <div>
                  <p className="font-bold text-slate-100 text-sm">{task.title}</p>
                  <span className="text-[10px] font-black uppercase text-slate-400">{task.type}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 rounded-xl border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-colors">
            View All Tasks
          </button>
        </div>

        {/* Global Broadcasts */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-extrabold text-slate-900">Teacher Notices</h3>
          </div>
          <div className="space-y-4">
            {loading ? (
              <Skeleton className="w-full h-32 rounded-2xl" />
            ) : announcements.length === 0 ? (
              <p className="text-slate-400 text-center font-bold text-sm">No new notices.</p>
            ) : (
              announcements.slice(0, 2).map((ann: any) => (
                <div key={ann.id} className="border-l-4 border-amber-400 pl-4 py-2">
                  <h4 className="font-black text-slate-800 text-sm mb-1">{ann.attributes.title}</h4>
                  <p className="text-xs font-semibold text-slate-500 line-clamp-2">{ann.attributes.content}</p>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-6 bg-amber-50 text-amber-700 font-bold py-3 rounded-xl hover:bg-amber-100 transition-colors text-sm">Create Notice</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20 px-4">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between lg:items-center mt-6 mb-12 gap-8 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-50 py-4">
        <div className="flex items-center gap-5">
          {loading ? (
            <Skeleton className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center relative">
              <User className="w-8 h-8 text-indigo-500" />
            </div>
          )}
          <div>
            {loading ? (
              <Skeleton className="w-48 h-8" />
            ) : (
              <>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Welcome Back 👋</h2>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {role === 'teacher' ? 'Teacher Portal' : 'Student Dashboard'}
                </h1>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80 group">
            <input
              type="text"
              placeholder="Search subjects, lectures..."
              className="w-full bg-white border border-slate-200 text-slate-900 pl-12 pr-4 py-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
          </div>
        </div>
      </header>

      {/* Dynamic Content */}
      <div className="relative">
        <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {role === 'teacher' ? <TeacherDashboardContent /> : <StudentDashboardContent />}
        </div>
      </div>
    </div>
  );
}
