'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

const PUBLIC_ROUTES = ['/login'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    // ── Auth Guard ───────────────────────────────────────────────
    useEffect(() => {
        if (isPublic) return;
        const jwt = sessionStorage.getItem('jwt');
        if (!jwt) {
            router.replace('/login');
        }
    }, [pathname]);

    return (
        <div className="flex min-h-screen">
            {!isPublic && <Sidebar />}
            <main className={`flex-1 overflow-y-auto h-screen ${!isPublic ? 'bg-[#F6F7FB]' : ''}`}>
                {children}
            </main>
        </div>
    );
}
