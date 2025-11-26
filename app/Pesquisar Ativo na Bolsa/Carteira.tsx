import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SimulacaoHoje from './SimulacaoHoje';

const Tab = createBottomTabNavigator();

function ComprarTela() {
  const [ticker, setTicker] = useState('');
  const [investimento, setInvestimento] = useState('');
  const [preco, setPreco] = useState(null);
  const [quantidade, setQuantidade] = useState(null);
  const [nomeEmpresa, setNomeEmpresa] = useState('');

  const [saldo, setSaldo] = useState(0);
  const [totalInvestido, setTotalInvestido] = useState(0);


  useFocusEffect(
    useCallback(() => {
      async function carregarValores() {
        const s = await AsyncStorage.getItem("saldo");
        const c = await AsyncStorage.getItem("carteira");
        

        if (!s) {
          await AsyncStorage.setItem("saldo", "1000");
          setSaldo(1000);
        } else {
          setSaldo(Number(s));
        }

        if (c) {
          const lista = JSON.parse(c);
          let total = 0;
          lista.forEach(item => total += Number(item.investimento));
          setTotalInvestido(total);
        } else {
          setTotalInvestido(0);
        }
      }

      carregarValores();
    }, [])
  );


async function buscarAcao() {
  if (!ticker) return;

  const token = "3Xgmgj9aPpZTaP2GBajh2z";

  try {
    const response = await fetch(
      `https://brapi.dev/api/quote/${ticker}?token=${token}`
    );

    const data = await response.json();

    if (!data?.results?.length) {
      alert("Ticker não encontrado!");


      setTicker('');
      setInvestimento('');
      setPreco(null);
      setQuantidade(null);
      setNomeEmpresa('');

      return;
    }

    const info = data.results[0];
    const precoAtual = info.regularMarketPrice;

    setPreco(precoAtual);
    setNomeEmpresa(info.longName || info.shortName || ticker.toUpperCase());

    if (investimento) {
      const qtd = Number(investimento) / precoAtual;
      setQuantidade(qtd);
    }

  } catch (e) {
    alert("Erro ao consultar API");

   
    setTicker('');
    setInvestimento('');
    setPreco(null);
    setQuantidade(null);
    setNomeEmpresa('');
  }
}
  async function comprar() {
    if (!quantidade || !preco) {
      alert("Busque a ação antes de comprar");
      return;
    }

    const valorInvestido = Number(investimento);

    if (valorInvestido > saldo) {
      alert("Saldo insuficiente!");
      return;
    }

    const novaCompra = {
      nome: nomeEmpresa,
      ticker: ticker.toUpperCase(),
      quantidade: quantidade,
      precoPago: preco,
      investimento: valorInvestido,
      dataCompra: new Date().toISOString(),
      cotacaoAtual: preco,
    };

    const data = await AsyncStorage.getItem("carteira");
    const carteiraAtual = data ? JSON.parse(data) : [];
    carteiraAtual.push(novaCompra);

    await AsyncStorage.setItem("carteira", JSON.stringify(carteiraAtual));

    const novoSaldo = saldo - valorInvestido;
    await AsyncStorage.setItem("saldo", novoSaldo.toString());
    setSaldo(novoSaldo);

    setTotalInvestido(totalInvestido + valorInvestido);

    alert("Compra registrada!");

    setTicker('');
    setInvestimento('');
    setPreco(null);
    setQuantidade(null);
    setNomeEmpresa('');
  }

  return (
    <View style={styles.container}>

      <View style={styles.saldoBox}>
        <Text style={styles.saldoTexto}>Saldo: R$ {saldo.toFixed(2)}</Text>
        <Text style={styles.investidoTexto}>Investido: R$ {totalInvestido.toFixed(2)}</Text>
      </View>

      <Text style={styles.title}>Comprar Ação</Text>

      <Text style={styles.label}>Código da ação (ex: PETR4):</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o ticker"
        placeholderTextColor="#AAAAAA"
        value={ticker}
        onChangeText={setTicker}
      />

      <Text style={styles.label}>Valor para investir (R$):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 100"
        placeholderTextColor="#AAAAAA"
        keyboardType="numeric"
        value={investimento}
        onChangeText={setInvestimento}
      />

      <TouchableOpacity style={styles.button} onPress={buscarAcao}>
        <Text style={styles.buttonText}>Buscar Ação</Text>
      </TouchableOpacity>

      {preco && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Empresa: {nomeEmpresa}</Text>
          <Text style={styles.resultText}>Cotação atual: R$ {preco.toFixed(2)}</Text>
          <Text style={styles.resultText}>
            Quantidade possível: {quantidade.toFixed(4)}
          </Text>

          <TouchableOpacity style={styles.buyButton} onPress={comprar}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function ComprarAcao() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: () => null  
      }}
    >
      <Tab.Screen name="Comprar" component={ComprarTela} />
      <Tab.Screen name="Minha Carteira" component={SimulacaoHoje} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2B2B2B"
  },

  saldoBox: {
    position: "absolute",
    right: 20,
    top: 10,
    alignItems: "flex-end"
  },
  saldoTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  investidoTexto: {
    fontSize: 14,
    color: "#FFFFFF"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#FFFFFF"
  },

  label: {
    fontSize: 16,
    marginTop: 10,
    color: "#FFFFFF"
  },

  input: {
    borderWidth: 1,
    borderColor: "#BBBBBB",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    color: "#FFFFFF"
  },

  button: {
    backgroundColor: "#FF9800",
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16
  },

  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10
  },
  resultText: {
    fontSize: 18,
    marginBottom: 5,
    color: "#FFFFFF"
  },

  buyButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16
  }
});
