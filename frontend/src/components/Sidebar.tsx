'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Library, BookOpen, CalendarHeart, Settings, LogOut, GraduationCap } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState('Student');
    const [userInitials, setUserInitials] = useState('S');

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('user');
            const user = raw ? JSON.parse(raw) : null;
            if (user) {
                const name = user.username || user.email?.split('@')[0] || 'Student';
                setUserName(name);
                setUserInitials(name.slice(0, 2).toUpperCase());
            }
        } catch (_) { }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('jwt');
        sessionStorage.removeItem('user');
        router.push('/login');
    };

    const links = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'All Subjects', href: '/subjects', icon: Library },
        { name: 'Schedule', href: '/schedule', icon: CalendarHeart },
        { name: 'My Courses', href: '/courses', icon: BookOpen },
        { name: 'My Profile', href: '/profile', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white h-screen border-r border-slate-100 hidden md:flex flex-col shadow-[2px_0_16px_rgba(0,0,0,0.03)]">

            {/* Logo */}
            <div className="px-6 pt-7 pb-5 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#E6F9F1] rounded-xl flex items-center justify-center relative">
                    <GraduationCap className="w-5 h-5 text-[#2DC87A]" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2DC87A] rounded-[4px] border-2 border-white" />
                </div>
                <h1 className="text-lg font-bold text-[#1A1C2E] tracking-tight">EduApp</h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href ||
                        (link.href !== '/' && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all text-sm font-semibold ${isActive
                                    ? 'bg-[#E6F9F1] text-[#2DC87A]'
                                    : 'text-[#9096B2] hover:bg-[#F6F7FB] hover:text-[#1A1C2E]'
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#2DC87A] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1C2E] truncate">{userName}</p>
                        <p className="text-xs text-[#9096B2]">Student Account</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#9096B2] hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>

        </div>
    );
}
