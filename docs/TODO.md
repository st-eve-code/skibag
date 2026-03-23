# Remove Profile Upload & Fix Referral Code - TODO

## Plan Steps (Approved)

1. **[x]** Create & run SQL migration `GENERATE_REFERRAL_CODES.sql`: Generate unique referral_code for all users with NULL/short codes (confirmed: 8/8 users have codes).
2. **[x]** Delete `lib/storageService.ts` (unused upload).
3. **[x]** Update `lib/supabaseAuthService.ts`: Add `ensureReferralCode(userId: string)`.
4. **[x]** Update `app/(tabs)/profile.tsx`: Auto-call ensure on mount if no code.
5. **[x]** Clean `lib/firestoreService.ts`: Remove duplicate referral code.
6. **[x]** Test: Login old/new users, verify code shows/copies (after `npx expo start --clear` + logout/login).
7. **[x]** Complete: attempt_completion.

**Done! SQL run ✓. Avatar saves/updates per user. Referral always shows unique code. Cache clear command run.**
