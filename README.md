# 🎓 EdTech Platform - Teacher & Class Management Guide

This guide explains how to manage user roles, assign subjects to teachers, and ensure teachers only see their respective classes (e.g., a Class 9 teacher only manages Class 9).

---

## 🚀 1. Role-Based Teacher Management (Super Admin)

As a Super Admin, you manage everything via the **Strapi Admin Panel** (`http://localhost:1337/admin`).

### Step 1: Assign a Subject to a Teacher
Teachers can only "see" and "upload" to classes/subjects they are assigned to.
1.  Go to **Content Manager** > **Course**.
2.  Select a course (e.g., "Maths Class 9").
3.  In the **Teacher** field (right sidebar or bottom), click **Add an entry**.
4.  Select the **Teacher's User Account** from the list.
5.  **Save & Publish**.
    *   *Result: When this teacher logs into the mobile app, they will only see "Maths Class 9" in their upload dashboard.*

### Step 2: Create a New Teacher
1.  Go to **Content Manager** > **User (from users-permissions)**.
2.  Click **Create New Entry**.
3.  Set Username, Email, and Password.
4.  Set **Role** to `Teacher`.
5.  **Save**.

---

## 🛠️ 2. Testing Features on Mobile

### Test 1: Teacher Class Restriction
1.  Login as **Teacher A** (assigned to Class 9).
2.  Tap on **Upload Lecture**.
3.  Check the **"My Assigned Classes"** list.
    *   *Expected: Only Class 9 subjects appear.*
4.  Try to publish a lecture.
    *   *Expected: The lecture is linked to the Class 9 module in the database.*

### Test 2: Global Admin Control
1.  In Strapi, remove Teacher A from Class 9 and assign them to Class 10.
2.  Refresh the Mobile App (or re-login).
3.  Check the **"My Assigned Classes"** list.
    *   *Expected: The list now shows Class 10 subjects only.*

---

## 📦 3. Developer Summary (Backend Logic)

*   **Schema Update**: I added a `teacher` relation (Many-to-One with User) to `Course`, `Lecture`, `Announcement`, and `Live Class`.
*   **Filtering**: The Mobile App uses standard Strapi filtering:
    *   `GET /courses?filters[teacher][id][$eq]=ID`
*   **Ownership**: When a Teacher uploads a lecture, their User ID is automatically saved in the `teacher` field of the new lecture entry.

---

## ❓ FAQ

**Q: Can a teacher belong to multiple classes?**  
A: Yes. In Strapi, simply link the Teacher to multiple **Course** entries. They will see all of them in the app.

**Q: How do I change which students see which course?**  
A: Students see courses based on the `class` attribute in their User Profile. Ensure the Course title or a custom field matches the student's class.

**Q: Where can I see teacher activity?**  
A: The **Recent Activity** section on the Teacher Dashboard shows the last 5 entries filtered by `teacher.id`.
