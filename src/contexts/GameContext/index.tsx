import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export type Player = {
  id: string;
  name: string;
  cash: number;
  tokenOwnerships: {
    [tokenId: string]: {
      amount: number;
    };
  };
};

type Token = {
  id: string;
  name: string;
  price: number;
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
  PlayerUpdated = 'PLAYER_UPDATED',
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
  login: () => void;
  exchangeToken: (tokenId: string, amount: number) => void;
  calculatePlayerTokensProperty: (playerId: string) => number;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    player: null,
    tokens: [],
    players: [],
    transactions: [],
    login: () => {},
    exchangeToken: () => {},
    calculatePlayerTokensProperty: () => 0,
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
  const socketRef = useRef<Socket | null>(null);

  const playerMap: { [playerId: string]: Player } = {};
  players.forEach((p) => {
    playerMap[p.id] = p;
  });

  const tokenMap: { [tokenId: string]: Token } = {};
  tokens.forEach((t) => {
    tokenMap[t.id] = t;
  });

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

  const calculatePlayerTokensProperty = (playerId: string): number => {
    const p = playerMap[playerId];
    let property = 0;
    Object.keys(p.tokenOwnerships).forEach((tokenId) => {
      const ownership = p.tokenOwnerships[tokenId];
      const token = tokenMap[tokenId];
      property += ownership.amount * token.price;
    });
    return Math.round(property * 100) / 100;
  };

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
          transactions: Transaction[];
        }) => {
          setTokens(payload.tokens);
          setPlayers(payload.players);
          setTransactions(payload.transactions);
        }
      );
      socketRef.current.on(Events.PlayerUpdated, (p: Player) => {
        toast.success('hi', {
          position: 'bottom-left',
        });
        setPlayer(p);
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
      player,
      tokens,
      players,
      transactions,
      login,
      exchangeToken,
      calculatePlayerTokensProperty,
    }),
    [player, tokens, players, transactions]
  );

  return (
    <GameOfLibertyContext.Provider value={gameOfLibertyContextValue}>
      {children}
    </GameOfLibertyContext.Provider>
  );
}

export default GameOfLibertyContext;
export type {};
