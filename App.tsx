import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LojaProvider } from './src/context/LojaContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LojaProvider>
        <AppNavigator />
      </LojaProvider>
    </SafeAreaProvider>
  );
}
