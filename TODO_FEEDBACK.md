# Feedback System Implementation TODO

## Task: Implement feedback system using Supabase table

### Steps:

1. [x] Understand existing codebase and schema
2. [x] Update lib/firestoreService.ts - Enhance submitFeedback to accept category and rating parameters
3. [x] Update app/(tabs)/profile.tsx - Connect handleFeedbackSubmit to use submitFeedback
4. [x] Create FEEDBACK_TABLE_UPDATE.sql - SQL to add rating column to feedback table

### Notes:

- Feedback table already exists in Supabase (SUPABASE_SCHEMA.sql)
- Store feedback in Supabase (not Firestore)
- Connect profile screen UI to backend
- Category is auto-determined based on rating: 4-5 stars = "feature", 1-2 stars = "bug", 3 stars = "general"

### Required Action:

- Run FEEDBACK_TABLE_UPDATE.sql in Supabase SQL Editor to add rating column to feedback table
