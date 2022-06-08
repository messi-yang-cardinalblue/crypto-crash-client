import {
  createContext,
  useCallback,
  useState,
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

type Token = {
  id: string;
  name: string;
  price: number;
};

type Ownership = {
  id: string;
  playerId: string;
  tokenId: string;
  amount: number;
};

type Transaction = {
  id: string;
  playerId: string;
  tokenId: string;
  timestamp: number;
  amount: number;
  price: number;
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
  player: Player | null;
  tokens: Token[];
  players: Player[];
  transactions: Transaction[];
  ownerships: Ownership[];
  login: () => void;
  exchangeToken: (tokenId: string, amount: number) => void;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    player: null,
    tokens: [],
    players: [],
    transactions: [],
    ownerships: [],
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

const serverUrl = process.env.SERVER_URL;

export function Provider({ children }: Props) {
  // const initialGameOfLibertyContextValue =
  //   createInitialGameOfLibertyContextValue();
  const [player, setPlayer] = useState<Player | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ownerships, setOwnerships] = useState<Ownership[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const login = useCallback(() => {
    if (serverUrl) {
      const newSocket = io(`${serverUrl}/game`, {
        auth: {
          authorization: sessionStorage.getItem('auth_token'),
        },
      });
      socketRef.current = newSocket;
    }
  }, [serverUrl]);

  const exchangeToken = useCallback((tokenId: string, amount: number) => {
    if (socketRef.current) {
      socketRef.current.emit(Actions.ExchangeToken, tokenId, amount);
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Events.LoggedIn, (p: Player, token: string) => {
        setPlayer(p);
        sessionStorage.setItem('auth_token', token);
      });
      socketRef.current.on(
        Events.GameUpdated,
        (payload: {
          tokens: Token[];
          players: Player[];
          ownerships: Ownership[];
          transactions: Transaction[];
        }) => {
          setTokens(payload.tokens);
          setPlayers(payload.players);
          setOwnerships(payload.ownerships);
          setTransactions(payload.transactions);
        }
      );
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
      player,
      tokens,
      players,
      transactions,
      ownerships,
      login,
      exchangeToken,
    }),
    [player, tokens, transactions, ownerships]
  );

  return (
    <GameOfLibertyContext.Provider value={gameOfLibertyContextValue}>
      {children}
    </GameOfLibertyContext.Provider>
  );
}

export default GameOfLibertyContext;
export type {};
