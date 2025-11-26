// app/moedas/_layout.tsx
import { Stack } from 'expo-router';

export default function MoedasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Depositar" />
      
    </Stack>
  );
}
