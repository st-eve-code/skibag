import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChessLobbyScreen } from './ChessLobbyScreen';
import { ChessGameScreen }  from './ChessGameScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChessLobby" component={ChessLobbyScreen} />
      <Stack.Screen name="ChessGame"  component={ChessGameScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}