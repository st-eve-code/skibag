import { useEffect, useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSocket, useSession } from '@beta-gamer/react-native';

interface Props {
  sessionId: string;
  onLeave: () => void;
}

export function ChessRoom({ sessionId, onLeave }: Props) {
  const socket     = useSocket();
  const session    = useSession();
  const myPlayerId = session.players[0]?.id ?? '';

  const roomIdRef = useRef('');
  const [fen, setFen]               = useState('start');
  const [myColor, setMyColor]       = useState<'white' | 'black'>('white');
  const [currentTurn, setCurrentTurn] = useState(0);
  const [players, setPlayers]       = useState<any[]>([]);
  const [playerTimers, setPlayerTimers] = useState<Record<string, number>>({});
  const [gameResult, setGameResult] = useState<{ winner: string | null; reason: string } | null>(null);

  useEffect(() => {
    if (!socket) return;

    const join = () => socket.emit('matchmaking:join', {
      username:  session.players[0]?.displayName,
      playerId:  myPlayerId,
      sessionId,
    });
    if (socket.connected) join(); else socket.once('connect', join);

    socket.on('game:started', (d: any) => {
      roomIdRef.current = d.roomId;
      setMyColor(d.color);
      setFen(d.fen);
      setPlayers(d.players);
      setPlayerTimers(d.playerTimers);
      setCurrentTurn(d.currentTurn);
    });

    socket.on('game:move:made', (d: any) => {
      setFen(d.fen);
      setCurrentTurn(d.currentTurn);
      setPlayerTimers(d.playerTimers);
    });

    socket.on('game:over', (d: any) => {
      setGameResult({ winner: d.winner ?? null, reason: d.reason });
    });

    return () => {
      socket.off('connect', join);
      socket.off('game:started');
      socket.off('game:move:made');
      socket.off('game:over');
    };
  }, [socket]);

  const isMyTurn = players[currentTurn]?.id === myPlayerId;

  const makeMove = (move: string) => {
    if (!isMyTurn || gameResult) return;
    socket?.emit('game:move', { roomId: roomIdRef.current, playerId: myPlayerId, move });
  };

  return (
    <View>
      {/* Render your chess board here using fen, myColor, isMyTurn */}
      {/* Call makeMove('e4') when a piece is moved */}
      <Text>FEN: {fen}</Text>
      <Text>{isMyTurn ? 'Your turn' : "Opponent's turn"}</Text>
      {gameResult && (
        <Text>
          {gameResult.winner === myPlayerId ? 'You won' : gameResult.winner ? 'You lost' : 'Draw'}
          {' — '}{gameResult.reason}
        </Text>
      )}
      <Button title="Resign" onPress={() => socket?.emit('game:resign', { roomId: roomIdRef.current, playerId: myPlayerId })} />
      <Button title="Leave"  onPress={onLeave} />
    </View>
  );
}