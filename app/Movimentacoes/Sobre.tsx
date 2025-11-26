import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function MinhaCarteiraSobre() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sobre a Minha Carteira</Text>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          A funcionalidade <Text style={{ fontWeight: "bold" }}>Minha Carteira</Text> foi criada para 
          oferecer uma forma simples, moderna e intuitiva de acompanhar seus investimentos dentro 
          do aplicativo. Seu desenvolvimento foi baseado em três pilares fundamentais: organização, 
          clareza e atualização automática.
        </Text>

        <Text style={styles.resultText}>
          Primeiramente, foram implementadas as estruturas de estado responsáveis por armazenar 
          o saldo total investido, o valor atual da carteira e a soma das operações registradas. 
          Cada ação simulada na página de compra altera esses valores, garantindo que o usuário 
          veja sua carteira evoluir em tempo real.
        </Text>

        <Text style={styles.resultText}>
          Além disso, toda a interface foi projetada com foco na usabilidade: fundo escuro para 
          reduzir fadiga visual, textos claros para melhor leitura, botões destacados para facilitar 
          ações rápidas e uma estrutura visual agradável e intuitiva.
        </Text>

        <Text style={styles.resultText}>
          Essa funcionalidade foi desenvolvida como parte da disciplina de Desenvolvimento Móvel, 
          aplicando conceitos como navegação com abas (Tabs), gerenciamento de estado, comunicação 
          entre componentes e construção de interfaces responsivas no React Native.
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2B2B2B"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#FFFFFF"
  },

  resultBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10
  },

  resultText: {
    fontSize: 17,
    marginBottom: 12,
    color: "#FFFFFF",
    lineHeight: 24
  }
});
