// app/index.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Aplicativo de Simulação Financeira</Text>

        <Text style={styles.description}>
          Este aplicativo foi desenvolvido como parte da disciplina de Desenvolvimento Móvel.
          Aqui você encontrará funcionalidades de navegação com Drawer, Tabs e Stack, além de
          ferramentas para simular compras, acompanhar sua carteira e analisar operações em tempo real.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',        // fundo cinza escuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2A2A2A',        // cinza médio (contraste)
    padding: 25,
    borderRadius: 16,
    width: '95%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#D6D6D6',
    textAlign: 'center',
    lineHeight: 22,
  },
});
