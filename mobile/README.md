# Smart Coaching Platform - React Native App

This repository contains the mobile-only coaching platform built with **React Native (Expo)**, focusing on students taking classes across multiple cities.

## Design Highlights
- **Unique Gamified UI**: Deep integration of pastel gradients and pill-shaped navigation, specifically avoiding stock layouts.
- **Micro-Interactions**: Use of `TouchableOpacity`, active states, drop shadows, and soft corner radii.
- **Component Breakdown**:
  - `OnboardingScreen`: Engaging illustration-driven splash entry.
  - `LoginScreen`: Soft interactive authentication with vector iconography.
  - `CityClassScreen`: Tappable grid selectors for hyper-local student personalization.
  - `HomeScreen`: Deep dashboard featuring live progress trackers, actionable class routing, and horizontal subject scrollviews.
  - `SubjectsScreen`: Organized masonry-style category layouts with completion percentages.
  - `CourseDetailScreen`: Deep dive tabs with rich description, module checklists, and quick-actions.
  - `QuizScreen`: MCQ testing environment simulating an exam environment.
  - `ScheduleScreen`: Interactive daily agenda distinguishing live vs upcoming classes.
  - `MaterialsScreen`: Downloadable node list representing PDF attachments.
  - `ProfileScreen`: Settings mapping to secure student metadata.

## Backend Integration Guide (Strapi + Neon PostgreSQL)

The mobile application is structured to decouple from the media payload and operate seamlessly with a Strapi V4 Headless API. 

### Data Collections Model:

1. **Users** (Native `Users-Permissions` Plugin)
  - Extends standard: `class` (String), `city` (String)
2. **Subjects / Courses** (Collection)
  - `title` (String), `class` (Text), `city` (Text), `teacher_name` (Text), `thumbnail` (Media)
3. **Lectures / Classes** (Collection)
  - `subject` (Relation -> Subject), `date` (Date), `time` (Time), `meeting_link` (UID/String)
4. **Materials** (Collection)
  - `subject` (Relation -> Subject), `title` (String), `file_url` (String - linking directly to S3, bypassing Strapi Node instances for high throughput)
5. **Quizzes** (Collection)
  - `subject` (Relation -> Subject), `question` (Text), `options` (JSON Array), `correct_answer` (Integer Index)
6. **Announcements** (Collection)
  - `message` (Rich Text), `date` (DateTime), `class` (String), `city` (String)

All fetching handles JWT authentication via `src/api/client.ts` using `axios`. Variables point to `%NODE_ENV%` EXPO_PUBLIC_API_URL routing directly to standard Strapi REST `/api/` endpoints.
