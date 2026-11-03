import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F7FB' },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="detail" />
      </Stack>
    </SafeAreaProvider>
  );
}
