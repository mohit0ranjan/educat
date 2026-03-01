const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';

export async function fetchCourses() {
    try {
        const res = await fetch(`${API_URL}/courses?populate=*`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return [];
    }
}

export async function fetchCourseBySlug(id: string) {
    try {
        const res = await fetch(`${API_URL}/courses/${id}?populate[modules][populate][lectures]=true`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch course details');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return null;
    }
}

export async function fetchLiveClasses() {
    try {
        const res = await fetch(`${API_URL}/live-classes?populate=*`, { cache: 'no-store' });
        const data = await res.json();
        return data.data;
    } catch (error) {
        return [];
    }
}

export async function fetchAnnouncements() {
    try {
        const res = await fetch(`${API_URL}/announcements?populate=*`, { cache: 'no-store' });
        const data = await res.json();
        return data.data;
    } catch (error) {
        return [];
    }
}

export async function apiLogin(identifier: string, password: string) {
    const res = await fetch(`${API_URL}/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
}
