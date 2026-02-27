import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { createUserProfile } from '@/lib/firestoreService';

// ─── Configure Google (call this once when app starts) ────────────────────────
export const configureGoogle = () => {
  GoogleSignin.configure({
    webClientId: '503844014288-4d8b1jdakebhcdmtl8rehulu3k7tlq0p.apps.googleusercontent.com',
  });
};

// ─── Google Sign-In ───────────────────────────────────────────────────────────
export const signInWithGoogle = async (referralCode?: string) => {
  await GoogleSignin.hasPlayServices();
  const signInResult = await GoogleSignin.signIn();

  const idToken = signInResult.data?.idToken ?? signInResult.idToken;

  if (!idToken) {
    throw new Error('No ID token returned from Google');
  }

  const credential = auth.GoogleAuthProvider.credential(idToken);
  const { user } = await auth().signInWithCredential(credential);

  // Create Firestore profile if first time signing in
  await createUserProfile(referralCode);

  return user;
};

// ─── Apple Sign-In (iOS only) ─────────────────────────────────────────────────
export const signInWithApple = async (referralCode?: string) => {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple Sign-In is only available on iOS');
  }

  const appleAuth = await import('@invertase/react-native-apple-authentication');

  const appleAuthResponse = await appleAuth.default.performRequest({
    requestedOperation: appleAuth.default.Operation.LOGIN,
    requestedScopes: [appleAuth.default.Scope.EMAIL, appleAuth.default.Scope.FULL_NAME],
  });

  if (!appleAuthResponse.identityToken) {
    throw new Error('Apple sign-in failed: no identity token');
  }

  const { identityToken, nonce } = appleAuthResponse;
  const credential = auth.AppleAuthProvider.credential(identityToken, nonce);
  const { user } = await auth().signInWithCredential(credential);

  // Create Firestore profile if first time signing in
  await createUserProfile(referralCode);

  return user;
};

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export const signOut = async () => {
  await auth().signOut();
  const isSignedInGoogle = await GoogleSignin.isSignedIn();
  if (isSignedInGoogle) await GoogleSignin.signOut();
};