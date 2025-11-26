// SimulacaoHoje.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function formatCurrency(value) {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

export default function SimulacaoHoje() {
  const [carteira, setCarteira] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [totalInvestido, setTotalInvestido] = useState(0);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const s = await AsyncStorage.getItem('saldo');
      setSaldo(Number(s) || 0);

      const data = await AsyncStorage.getItem('carteira');
      const carteiraSalva = data ? JSON.parse(data) : [];

      // atualizar cotações (opcional)
      const carteiraAtualizada = [];
      for (const item of carteiraSalva) {
        try {
          const response = await fetch(`https://brapi.dev/api/quote/${encodeURIComponent(item.ticker)}?token=3Xgmgj9aPpZTaP2GBajh2z`);
          const json = await response.json();
          const info = json?.results?.[0];
          if (info) {
            carteiraAtualizada.push({
              ...item,
              cotacaoAtual: info.regularMarketPrice ?? item.cotacaoAtual,
              maximoDia: info.regularMarketDayHigh ?? item.maximoDia,
              minimoDia: info.regularMarketDayLow ?? item.minimoDia,
              logoUrl: info.logoUrl || info.logourl || item.logoUrl,
              changePercent: info.regularMarketChangePercent ?? info.changePercent ?? null,
            });
          } else {
            carteiraAtualizada.push(item);
          }
        } catch {
          carteiraAtualizada.push(item);
        }
      }

      setCarteira(carteiraAtualizada);

      let soma = 0;
      carteiraAtualizada.forEach((item) => (soma += Number(item.investimento) || 0));
      setTotalInvestido(soma);
    } catch (error) {
      console.log('Erro ao carregar carteira:', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function executarVenda(index) {
    try {
      const item = carteira[index];
      const valorDevolvido = Number(item.investimento || 0);

      const novaCarteira = carteira.filter((_, i) => i !== index);
      await AsyncStorage.setItem('carteira', JSON.stringify(novaCarteira));

      const novoSaldo = (Number(await AsyncStorage.getItem('saldo')) || 0) + valorDevolvido;
      await AsyncStorage.setItem('saldo', novoSaldo.toString());
      setSaldo(novoSaldo);

      Alert.alert('Sucesso', 'Ação vendida com sucesso!');
      carregar();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível vender a ação.');
    }
  }

  function venderAcao(index) {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Deseja realmente vender esta ação?');
      if (ok) executarVenda(index);
      return;
    }
    Alert.alert('Confirmar venda', 'Deseja realmente vender esta ação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Vender', onPress: () => executarVenda(index) },
    ]);
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.saldoBox}>
        <Text style={styles.saldoTexto}>💰 {formatCurrency(saldo)}</Text>
        <Text style={styles.investidoTexto}>📊 Investido: {formatCurrency(totalInvestido)}</Text>
        <Text style={styles.investidoTexto}>💵 Disponível: {formatCurrency(saldo)}</Text>
      </View>

      <Text style={styles.titulo}>Minha Carteira</Text>

      {carteira.length === 0 && <Text style={styles.vazio}>Nenhuma ação comprada.</Text>}

      {carteira.map((item, i) => {
        const variacao = Number(item.changePercent || 0);
        const cor = variacao >= 0 ? '#4CAF50' : '#FF5252';
        return (
          <View key={`${item.ticker}-${i}`} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.logoUrl ? <Image source={{ uri: item.logoUrl }} style={styles.logo} /> : null}
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.texto}>Código: {item.ticker}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.priceText]}>{formatCurrency(item.cotacaoAtual)}</Text>
                <Text style={{ color: cor, fontWeight: '600' }}>{variacao >= 0 ? '▲' : '▼'} {variacao.toFixed(2)}%</Text>
              </View>
            </View>

            <Text style={styles.texto}>Quantidade: {Number(item.quantidade).toFixed(4)}</Text>
            <Text style={styles.texto}>Investido: {formatCurrency(item.investimento)}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <TouchableOpacity style={styles.botaoVender} onPress={() => venderAcao(i)} activeOpacity={0.8}>
                <Text style={styles.botaoVenderTexto}>Vender</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#2B2B2B',
    flex: 1,
  },

  saldoBox: {
    alignItems: 'flex-end',
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },

  saldoTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  investidoTexto: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },

  vazio: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },

  logo: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },

  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  texto: {
    color: '#E0E0E0',
    marginTop: 3,
    fontSize: 15,
  },

  total: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  botaoVender: {
    marginTop: 0,
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },

  botaoVenderTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  priceText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
