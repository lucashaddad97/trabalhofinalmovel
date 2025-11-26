// app/movimentacoes/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

// ======================= Depositar =======================
function Depositar() {
    const [saldo, setSaldo] = useState(0);
    const [valor, setValor] = useState('');
    const [metodo, setMetodo] = useState('pix');
    const navigation = useNavigation();

    async function carregarSaldo() {
        const s = await AsyncStorage.getItem('saldo');
        setSaldo(s ? Number(s) : 0);
    }

    useFocusEffect(
        useCallback(() => { carregarSaldo(); }, [])
    );

    // ⭐ AQUI ESTÁ A FUNÇÃO DO JEITO QUE VOCÊ PEDIU ⭐
    function confirmarDeposito() {
        const deposito = parseFloat(valor);

        if (isNaN(deposito) || deposito <= 0) {
            Alert.alert('Erro', 'Digite um valor válido.');
            return;
        }

        if (Platform.OS === 'web') {
            const ok = window.confirm(`Deseja realmente depositar R$${deposito.toFixed(2)} via ${metodo.toUpperCase()}?`);
            if (ok) executarDeposito(deposito);
            return;
        }

        Alert.alert(
            'Confirmar Depósito',
            `Deseja realmente depositar R$${deposito.toFixed(2)} via ${metodo.toUpperCase()}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Depositar', onPress: () => executarDeposito(deposito) },
            ]
        );
    }

    const executarDeposito = async (deposito: number) => {
        const novoSaldo = saldo + deposito;
        await AsyncStorage.setItem('saldo', novoSaldo.toString());
        setSaldo(novoSaldo);

        Alert.alert('Sucesso', `Depósito de R$${deposito.toFixed(2)} via ${metodo.toUpperCase()} realizado.`);
        setValor('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.saldo}>Saldo Atual: R$ {saldo.toFixed(2)}</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite o valor"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
            />

            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={[styles.radio, metodo === 'pix' && styles.radioSelected]}
                    onPress={() => setMetodo('pix')}
                >
                    <Text style={styles.radioText}>PIX</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.radio, metodo === 'cartao' && styles.radioSelected]}
                    onPress={() => setMetodo('cartao')}
                >
                    <Text style={styles.radioText}>Cartão de Crédito</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={confirmarDeposito}>
                <Text style={styles.buttonText}>Depositar</Text>
            </TouchableOpacity>
        </View>
    );
}

// ======================= Sacar =======================
function Sacar() {
    const [saldo, setSaldo] = useState(0);
    const [valor, setValor] = useState('');

    async function carregarSaldo() {
        const s = await AsyncStorage.getItem('saldo');
        setSaldo(s ? Number(s) : 0);
    }

    useFocusEffect(
        useCallback(() => { carregarSaldo(); }, [])
    );

    // ⭐ MESMO PADRÃO DO CONFIRMAR DEPÓSITO ⭐
    function confirmarSaque() {
        const saque = parseFloat(valor);

        // ❌ Valor inválido
        if (isNaN(saque) || saque <= 0) {
            Alert.alert('Erro', 'Digite um valor válido.');
            setValor('');
            return;
        }

        // ❌ Saque maior que saldo
        if (saque > saldo) {
            Alert.alert('Erro', 'Não é possível sacar mais do que o saldo disponível.');
            setValor('');
            return;
        }

        // 🌐 WEB — usa window.confirm
        if (Platform.OS === 'web') {
            const ok = window.confirm(`Deseja realmente sacar R$${saque.toFixed(2)}?`);
            if (ok) executarSaque(saque);
            return;
        }

        // 📱 MOBILE — usa Alert de confirmação
        Alert.alert(
            'Confirmar Saque',
            `Deseja realmente sacar R$${saque.toFixed(2)}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sacar', onPress: () => executarSaque(saque) },
            ]
        );
    }
    const executarSaque = async (saque: number) => {
        const novoSaldo = saldo - saque;
        await AsyncStorage.setItem('saldo', novoSaldo.toString());
        setSaldo(novoSaldo);

        Alert.alert('Sucesso', `Saque de R$${saque.toFixed(2)} realizado.`);
        setValor('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.saldo}>Saldo Atual: R$ {saldo.toFixed(2)}</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite o valor para sacar"
                placeholderTextColor="#AAAAAA"
                keyboardType="decimal-pad"
                value={valor}
                onChangeText={setValor}
            />

            <TouchableOpacity style={styles.button} onPress={confirmarSaque}>
                <Text style={styles.buttonText}>Sacar</Text>
            </TouchableOpacity>
        </View>
    );
}

// ======================= Tabs =======================
export default function Movimentacoes() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: { backgroundColor: '#2B2B2B' },
                tabBarActiveTintColor: '#FF9800',
                tabBarInactiveTintColor: '#FFFFFF',
                tabBarIcon: () => null,
            }}
        >
            <Tab.Screen name="Depositar" component={Depositar} />
            <Tab.Screen name="Sacar" component={Sacar} />
        </Tab.Navigator>
    );
}

// ======================= Styles =======================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B2B2B',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },

    saldo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 30,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#3A3A3A',
        borderRadius: 12,
        overflow: 'hidden',
    },

    input: {
        width: '85%',
        backgroundColor: '#3A3A3A',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#555555',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },

    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        marginBottom: 25,
    },

    radio: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 10,
        backgroundColor: '#2B2B2B',
        alignItems: 'center',
    },

    radioSelected: {
        backgroundColor: '#007AFF',
    },

    radioText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    button: {
        width: '85%',
        backgroundColor: '#FF9800',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },

    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 18,
    },
});