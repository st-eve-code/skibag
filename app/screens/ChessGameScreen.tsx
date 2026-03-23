import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BetaGamerProvider } from '@beta-gamer/react-native';
import { ChessRoom } from '../components/chess/ChessRoom';

export function ChessGameScreen() {
  const route      = useRoute<any>();
  const navigation = useNavigation();
  const { sessionToken, sessionId } = route.params;

  const [status, setStatus] = useState<'checking' | 'ok' | 'ended'>('checking');

  useEffect(() => {
    fetch(`https://api.beta-gamer.com/v1/sessions/validate?token=${sessionToken}`)
      .then(r => r.json())
      .then(d => setStatus(d.status === 'ended' ? 'ended' : 'ok'))
      .catch(() => setStatus('ok'));
  }, [sessionToken]);

  if (status === 'checking') return <ActivityIndicator />;

  if (status === 'ended') return (
    <View>
      <Text>This session has already ended.</Text>
      <Text onPress={() => navigation.navigate('ChessLobby' as never)}>Play again</Text>
    </View>
  );

  return (
    <BetaGamerProvider token={sessionToken} serverUrl="https://api.beta-gamer.com">
      <ChessRoom
        sessionId={sessionId}
        onLeave={() => navigation.navigate('ChessLobby' as never)}
      />
    </BetaGamerProvider>
  );
}