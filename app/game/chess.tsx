import { BetaGamerProvider, ChessBoard, ChessMoveHistory, PlayerCard, Timer } from '@beta-gamer/react-native';
import { View, StyleSheet } from 'react-native';

export default function ChessScreen({ sessionToken }: { sessionToken: string }) {
  return (
    <BetaGamerProvider token={sessionToken}>
      <View style={styles.container}>
        <PlayerCard player="opponent" style={styles.card} nameStyle={styles.name} />
        <Timer player="opponent" style={styles.timer} textStyle={styles.clock} />
        <ChessBoard style={styles.board} />
        <ChessMoveHistory style={styles.history} textStyle={styles.move} rowStyle={styles.row} />
        <Timer player="self" style={styles.timer} textStyle={styles.clock} />
        <PlayerCard player="self" style={styles.card} nameStyle={styles.name} />
      </View>
    </BetaGamerProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  board:     { width: '100%', aspectRatio: 1 },
  card:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  name:      { color: '#fff', fontWeight: '600' },
  timer:     { alignSelf: 'flex-end' },
  clock:     { color: '#fff', fontFamily: 'monospace', fontSize: 18 },
  history:   { maxHeight: 200, marginTop: 12 },
  move:      { color: '#94a3b8', fontSize: 12 },
  row:       { flexDirection: 'row', gap: 8 },
});