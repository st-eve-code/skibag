import { Redirect } from "expo-router";

// Entry point — go straight to splash screen which handles auth routing
export default function Index() {
  return <Redirect href="/splashscreen" />;
}
