import { useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function ChessLobbyScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const startGame = async (matchType: 'matchmaking' | 'bot') => {
    setLoading(true);
    const res = await fetch('https://your-api.com/api/game/chess/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
      body: JSON.stringify({ matchType }),
    });
    const { sessionToken, sessionId } = await res.json();

    // Navigate to game screen — pass token as route param
    navigation.navigate('ChessGame', { sessionToken, sessionId });
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Button title="Find opponent" onPress={() => startGame('matchmaking')} />
      <Button title="vs Bot"        onPress={() => startGame('bot')} />
    </View>
  );
}