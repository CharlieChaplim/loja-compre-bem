import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TelaCadastroProduto } from '../screens/TelaCadastroProduto';
import { TelaDetalheProduto } from '../screens/TelaDetalheProduto';
import { TelaListaProdutos } from '../screens/TelaListaProdutos';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaProdutos">
        <Stack.Screen
          name="ListaProdutos"
          component={TelaListaProdutos}
          options={{ title: 'Produtos' }}
        />
        <Stack.Screen
          name="DetalheProduto"
          component={TelaDetalheProduto}
          options={{ title: 'Detalhe do produto' }}
        />
        <Stack.Screen
          name="CadastroProduto"
          component={TelaCadastroProduto}
          options={{ title: 'Cadastrar produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
