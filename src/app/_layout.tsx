import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This tells the app to load your Splash Screen first without a top navigation bar */}
      <Stack.Screen name="index" />
    </Stack>
  );
}