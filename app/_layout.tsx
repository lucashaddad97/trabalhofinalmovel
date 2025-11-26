// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import React from 'react';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="index" // app/index.tsx
        options={{ title: 'Página Principal' }}
      />

      <Drawer.Screen
        name="Moedas" // app/moedas/index.tsx → corresponde à pasta "moedas"
        options={{ title: 'Moedas' }}
      />

      <Drawer.Screen
        name="sobre" // app/sobre.tsx
        options={{ title: 'Sobre' }}
      />
      <Drawer.Screen
        name="Minhacarteira" // app/sobre.tsx
        options={{ title: 'Minha Carteira' }}
      />
    </Drawer>

  );
}
