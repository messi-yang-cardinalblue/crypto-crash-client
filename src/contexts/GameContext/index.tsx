import {
  createContext,
  useCallback,
  // useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';

enum Events {
  LoggedIn = 'LOGGED_IN',
  GameUpdated = 'GAME_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerLeft = 'PLAYER_LEFT',
}

type GameOfLibertyContextValue = {
  login: () => void;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    login: () => {},
  };
}

const GameOfLibertyContext = createContext<GameOfLibertyContextValue>(
  createInitialGameOfLibertyContextValue()
);

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  // const initialGameOfLibertyContextValue =
  //   createInitialGameOfLibertyContextValue();
  const socketRef = useRef<Socket | null>(null);

  const login = useCallback(() => {
    const newSocket = io(`localhost:8000/game`, {
      // auth: {
      //   authorization: sessionStorage.getItem('auth_token'),
      // },
    });
    socketRef.current = newSocket;

    // newSocket.onopen = () => {
    //   setStatus('ONLINE');
    // };

    // newSocket.onclose = () => {
    //   setStatus('OFFLINE');
    // };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Events.LoggedIn, () => {
        // console.log(msg);
      });
      socketRef.current.on(Events.GameUpdated, () => {
        // console.log(msg);
      });
      socketRef.current.on(Events.PlayerJoined, () => {
        // console.log(msg);
      });
      socketRef.current.on(Events.PlayerLeft, () => {
        // console.log(msg);
      });
    }
  }, [socketRef.current]);

  const gameOfLibertyContextValue = useMemo<GameOfLibertyContextValue>(
    () => ({
      login,
    }),
    []
  );

  return (
    <GameOfLibertyContext.Provider value={gameOfLibertyContextValue}>
      {children}
    </GameOfLibertyContext.Provider>
  );
}

export default GameOfLibertyContext;
export type {};
