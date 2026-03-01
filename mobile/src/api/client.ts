import axios from 'axios';

// ─── API URL ──────────────────────────────────────────────────────────────────
// STRAPI_BASE = base URL without /api  (e.g. http://localhost:1337)
// The client always appends /api internally — never put /api in the env var.
const rawBase =
    process.env.EXPO_PUBLIC_API_URL ||
    (typeof window !== 'undefined' && window.location?.hostname === 'localhost'
        ? 'http://localhost:1337'
        : 'http://192.168.18.1:1337');

// Strip trailing /api or /api/ from env var to prevent double /api/api/
export const STRAPI_BASE = rawBase.replace(/\/api\/?$/, '');
const API_URL = `${STRAPI_BASE}/api`;

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Token is set dynamically after login (see store.ts → setAuth)
export const setAuthToken = (token: string | null) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (identifier: string, password: string) => {
    const response = await apiClient.post('/auth/local', { identifier, password });
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (
    code: string,
    password: string,
    passwordConfirmation: string
) => {
    const response = await apiClient.post('/auth/reset-password', {
        code,
        password,
        passwordConfirmation,
    });
    return response.data;
};

// ── Courses ───────────────────────────────────────────────────────────────────
export const getCourses = async () => {
    const response = await apiClient.get('/courses?populate=*');
    return response.data.data;
};

export const getCourseDetails = (id: number) =>
    apiClient.get(`/courses/${id}?populate[modules][populate][0]=lectures&populate[lectures][populate][teacher]=true`);

export const getCourseById = async (id: number) => {
    const response = await apiClient.get(
        `/courses/${id}?populate[modules][populate][lectures][populate][teacher]=true&populate[lectures][populate][teacher]=true&populate[announcements]=true&populate[liveClasses]=true`
    );
    return response.data.data;
};

// Lectures directly by course (subject) — for student subject-wise view
export const getLecturesByCourse = async (courseId: number) => {
    const response = await apiClient.get(
        `/lectures?filters[course][id][$eq]=${courseId}&populate[teacher]=true&populate[module]=true&sort[0]=order:asc&sort[1]=createdAt:asc`
    );
    return response.data.data;
};

// ── Teacher APIs ──────────────────────────────────────────────────────────────
export const getTeacherCourses = (teacherId: number) =>
    apiClient.get(`/courses?filters[teacher][id][$eq]=${teacherId}&populate=*`);

export const getTeacherLectures = (teacherId: number) =>
    apiClient.get(`/lectures?filters[teacher][id][$eq]=${teacherId}&populate=*`);

export const getTeacherAnnouncements = (teacherId: number) =>
    apiClient.get(`/announcements?filters[teacher][id][$eq]=${teacherId}&populate=*`);

export const getTeacherLiveClasses = (teacherId: number) =>
    apiClient.get(`/live-classes?filters[teacher][id][$eq]=${teacherId}&populate=*`);

export const getModulesForCourse = (courseId: number) =>
    apiClient.get(`/modules?filters[course][id][$eq]=${courseId}`);

export const createLecture = (data: any) => apiClient.post('/lectures', { data });
export const createAnnouncement = (data: any) => apiClient.post('/announcements', { data });
export const createLiveClass = (data: any) => apiClient.post('/live-classes', { data });

// Update a lecture (e.g. re-assign course/module)
export const updateLecture = (id: number, data: any) => apiClient.put(`/lectures/${id}`, { data });

// ── Public APIs ───────────────────────────────────────────────────────────────
export const getLiveClasses = async () => {
    const response = await apiClient.get('/live-classes?populate=*');
    return response.data.data;
};

export const getAnnouncements = async () => {
    const response = await apiClient.get('/announcements?populate=*');
    return response.data.data;
};

export const getQuizzes = async () => {
    const response = await apiClient.get('/quizzes?populate=*');
    return response.data.data;
};

export const getTests = async () => {
    const response = await apiClient.get('/tests?populate=*');
    return response.data.data;
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const getStudents = async () => {
    const response = await apiClient.get('/users?filters[roleType][$eq]=student');
    return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

export default apiClient;
