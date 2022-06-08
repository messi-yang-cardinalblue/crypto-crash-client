import {
  createContext,
  useCallback,
  // useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';

type Player = {
  id: string;
  name: string;
  cash: number;
};

enum Events {
  LoggedIn = 'LOGGED_IN',
  GameUpdated = 'GAME_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerLeft = 'PLAYER_LEFT',
}

enum Actions {
  ExchangeToken = 'EXCHANGE_TOKEN',
}

type GameOfLibertyContextValue = {
  login: () => void;
  exchangeToken: (tokenId: string, amount: number) => void;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    login: () => {},
    exchangeToken: () => {},
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
      auth: {
        authorization: sessionStorage.getItem('auth_token'),
      },
    });
    socketRef.current = newSocket;

    // newSocket.onopen = () => {
    //   setStatus('ONLINE');
    // };

    // newSocket.onclose = () => {
    //   setStatus('OFFLINE');
    // };
  }, []);

  const exchangeToken = useCallback((tokenId: string, amount: number) => {
    if (socketRef.current) {
      socketRef.current.emit(Actions.ExchangeToken, tokenId, amount);
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Events.LoggedIn, (player: Player, token: string) => {
        sessionStorage.setItem('auth_token', token);
        // console.log(player, token);
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
      exchangeToken,
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
