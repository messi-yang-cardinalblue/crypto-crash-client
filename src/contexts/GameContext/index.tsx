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

export type Token = {
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
  GameUpdated = 'GAME_UPDATED',
  PlayerUpdated = 'PLAYER_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerLeft = 'PLAYER_LEFT',
  TokenExchanged = 'TOKEN_EXCHANGED',
}

enum Actions {
  ExchangeToken = 'EXCHANGE_TOKEN',
}

type GameOfLibertyContextValue = {
  player: Player | null;
  tokens: Token[];
  players: Player[];
  transactions: Transaction[];
  login: (name: string) => void;
  exchangeToken: (tokenId: string, amount: number) => void;
  calculatePlayerPortfolioValue: (playerId: string) => number;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    player: null,
    tokens: [],
    players: [],
    transactions: [],
    login: () => {},
    exchangeToken: () => {},
    calculatePlayerPortfolioValue: () => 0,
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
  const [connected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  const playerMap: { [playerId: string]: Player } = {};
  players.forEach((p) => {
    playerMap[p.id] = p;
  });

  const tokenMap: { [tokenId: string]: Token } = {};
  tokens.forEach((t) => {
    tokenMap[t.id] = t;
  });

  const login = useCallback(
    (name: string) => {
      if (serverUrl) {
        const newSocket = io(`${serverUrl}/game`, {
          auth: {
            authorization: sessionStorage.getItem('auth_token'),
          },
          query: {
            name,
          },
        });
        socketRef.current = newSocket;
        setConnected(true);
      }
    },
    [serverUrl]
  );

  const exchangeToken = useCallback((tokenId: string, amount: number) => {
    if (socketRef.current) {
      socketRef.current.emit(Actions.ExchangeToken, tokenId, amount);
    }
  }, []);

  const calculatePlayerPortfolioValue = (playerId: string): number => {
    const p = playerMap[playerId];
    let property = 0;
    Object.keys(p.tokenOwnerships).forEach((tokenId) => {
      const ownership = p.tokenOwnerships[tokenId];
      const token = tokenMap[tokenId];
      property += ownership.amount * token.price;
    });
    return Math.round(property * 100) / 100;
  };

  const handlePlayerUpdated = (p: Player) => {
    setPlayer(p);
  };

  const handlePlayerJoined = (p: Player) => {
    toast.success(`${p.name} joined the game`, {
      position: 'bottom-left',
      duration: 3000,
    });
  };

  const handlePlayerLeft = (p: Player) => {
    toast.success(`${p.name} left the game`, {
      position: 'bottom-left',
      duration: 3000,
    });
  };

  const handleTokenExchanged = (transaction: Transaction) => {
    const p = playerMap[transaction.playerId];
    const t = tokenMap[transaction.tokenId];
    let msg = '';
    if (transaction.amount > 0) {
      msg = `${p.name} bought "${transaction.amount} ${t.name}" at "$${transaction.price}"`;
    } else {
      msg = `${p.name} sold "${-transaction.amount} ${t.name}" at "$${
        transaction.price
      }"`;
    }
    toast.success(msg, {
      position: 'bottom-left',
      duration: 3000,
    });
  };

  const handleGameUpdated = (payload: {
    tokens: Token[];
    players: Player[];
    transactions: Transaction[];
  }) => {
    setTokens(payload.tokens);
    setPlayers(payload.players);
    setTransactions(payload.transactions);
  };

  useEffect(() => {
    if (connected && socketRef.current) {
      socketRef.current.on(Events.GameUpdated, handleGameUpdated);
      socketRef.current.on(Events.PlayerUpdated, handlePlayerUpdated);
      socketRef.current.on(Events.PlayerJoined, handlePlayerJoined);
      socketRef.current.on(Events.PlayerLeft, handlePlayerLeft);
      socketRef.current.on(Events.TokenExchanged, handleTokenExchanged);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(Events.GameUpdated, handleGameUpdated);
        socketRef.current.off(Events.PlayerUpdated, handlePlayerUpdated);
        socketRef.current.off(Events.PlayerJoined, handlePlayerJoined);
        socketRef.current.off(Events.PlayerLeft, handlePlayerLeft);
        socketRef.current.off(Events.TokenExchanged, handleTokenExchanged);
      }
    };
  });

  const gameOfLibertyContextValue = useMemo<GameOfLibertyContextValue>(
    () => ({
      player,
      tokens,
      players,
      transactions,
      login,
      exchangeToken,
      calculatePlayerPortfolioValue,
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
