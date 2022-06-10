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
import { hashFnv32a } from '@/utils/common';
import elonMuskTalk from './elonMuskTalk';

export type Player = {
  id: string;
  name: string;
  cash: number;
  tokenOwnerships: {
    [tokenId: string]: {
      amount: number;
    };
  };
  transactions: Transaction[];
};

export type Token = {
  id: string;
  name: string;
  price: number;
  historyPrices: number[];
  _energy: number;
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
  MessageAnnounced = 'MESSAGE_ANNOUNCED',
  TokenDataReturned = 'TOKEN_DATA_RETURNED',
}

enum Actions {
  ExchangeToken = 'EXCHANGE_TOKEN',
  StopGame = 'STOP_GAME',
  StartGame = 'START_GAME',
  AnnounceMessage = 'ANNOUNCE_MESSAGE',
  ResetGame = 'RESET_GAME',
  RequestTokenDataData = 'REQUEST_TOKEN_DATA',
}

type GameOfLibertyContextValue = {
  player: Player | null;
  tokens: Token[];
  requestedToken: Token | null;
  players: Player[];
  playerMap: { [playerId: string]: Player };
  transactions: Transaction[];
  login: (name: string) => void;
  requestTokenData: (tokenId: string) => void;
  exchangeToken: (tokenId: string, amount: number) => void;
  calculatePlayerPortfolioValue: (playerId: string) => number;
  calculateRank: (playerId: string) => number;
  calculatePlayerAvatarNumber: (playerId: string) => number;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    player: null,
    tokens: [],
    requestedToken: null,
    players: [],
    playerMap: {},
    transactions: [],
    login: () => {},
    exchangeToken: () => {},
    requestTokenData: () => {},
    calculatePlayerPortfolioValue: () => 0,
    calculateRank: () => 0,
    calculatePlayerAvatarNumber: () => 0,
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
  const [requestedToken, setRequestedToken] = useState<Token | null>(null);
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
      if (!socketRef.current && serverUrl && !connected) {
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

        toast('Welcome to CRYPTO CRA$H!  Starting with $1,000 dollars, how much can you increase your portfolio value by buying and selling crypto tokens?', {
          icon: '📢',
          position: 'top-left',
          duration: 10000,
          style: {
            width: '280px',
          },
        });
      }
    },
    [socketRef.current, serverUrl, connected]
  );

  const requestTokenData = useCallback(
    (tokenId: string) => {
      if (socketRef.current) {
        setRequestedToken(null);
        socketRef.current.emit(Actions.RequestTokenDataData, tokenId);
      }
    },
    [socketRef.current]
  );

  const exchangeToken = useCallback((tokenId: string, amount: number) => {
    if (socketRef.current) {
      socketRef.current.emit(Actions.ExchangeToken, tokenId, amount);
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      // @ts-ignore
      window.ccStart = () => {
        // @ts-ignore
        socketRef.current.emit(Actions.StartGame);
      };
      // @ts-ignore
      window.ccStop = () => {
        // @ts-ignore
        socketRef.current.emit(Actions.StopGame);
      };
      // @ts-ignore
      window.ccReset = () => {
        // @ts-ignore
        socketRef.current.emit(Actions.ResetGame);
      };
      // @ts-ignore
      window.ccElonMuskSpeak = (msg: string) => {
        // @ts-ignore
        socketRef.current.emit(Actions.AnnounceMessage, 1, msg);
      };
      // @ts-ignore
      window.ccSpeak = (msg: string) => {
        // @ts-ignore
        socketRef.current.emit(Actions.AnnounceMessage, 0, msg);
      };
    }
  }, [socketRef.current]);

  const calculatePlayerAvatarNumber = (playerId: string): number => {
    const p = playerMap[playerId];
    if (!p) {
      return 0;
    }

    return hashFnv32a(p?.id);
  };

  const calculatePlayerPortfolioValue = (playerId: string): number => {
    const p = playerMap[playerId];
    if (!p) {
      return 0;
    }
    let property = 0;
    Object.keys(p.tokenOwnerships).forEach((tokenId) => {
      const ownership = p.tokenOwnerships[tokenId];
      const token = tokenMap[tokenId];
      property += ownership.amount * token.price;
    });
    return Math.round(property * 1000) / 1000;
  };

  const calculateRank = (playerId: string): number => {
    const p = playerMap[playerId];
    if (!p) {
      return 0;
    }

    return (
      players
        .sort((pA, pB) => {
          const totalValueA = pA.cash + calculatePlayerPortfolioValue(pA.id);
          const totalValueB = pB.cash + calculatePlayerPortfolioValue(pB.id);
          return totalValueB - totalValueA;
        })
        .findIndex((pFinal) => pFinal.id === playerId) + 1
    );
  };

  const handlePlayerUpdated = (p: Player) => {
    setPlayer(p);
  };

  const handlePlayerJoined = (p: Player) => {
    toast.success(`${p.name} joined the game`, {
      position: 'bottom-left',
      duration: 3000,
      style: {
        width: '280px',
      },
    });
  };

  const handlePlayerLeft = (p: Player) => {
    toast.success(`${p.name} left the game`, {
      position: 'bottom-left',
      duration: 3000,
      style: {
        width: '280px',
      },
    });
  };

  const handleMessageAnnounced = (type: number, msg: string) => {
    if (type === 0) {
      toast(msg, {
        icon: '📢',
        position: 'top-left',
        duration: 10000,
        style: {
          width: '280px',
        },
      });
    } else if (type === 1) {
      elonMuskTalk(msg);
    }
  };

  const handleTokenDataReturned = (token: Token) => {
    setRequestedToken(token);
  };

  // const handleTokenExchanged = (transaction: Transaction) => {
  //   const p = playerMap[transaction.playerId];
  //   const t = tokenMap[transaction.tokenId];
  //   if (!p || !t) {
  //     return;
  //   }
  //   let msg = '';
  //   if (transaction.amount > 0) {
  //     msg = `${p.name} bought "${transaction.amount} ${t.name}" at "$${transaction.price}"`;
  //   } else {
  //     msg = `${p.name} sold "${-transaction.amount} ${t.name}" at "$${
  //       transaction.price
  //     }"`;
  //   }
  //   toast.success(msg, {
  //     position: 'bottom-left',
  //     duration: 3000,
  //   });
  // };

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
      socketRef.current.on(Events.MessageAnnounced, handleMessageAnnounced);
      socketRef.current.on(Events.TokenDataReturned, handleTokenDataReturned);
      // socketRef.current.on(Events.TokenExchanged, handleTokenExchanged);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(Events.GameUpdated, handleGameUpdated);
        socketRef.current.off(Events.PlayerUpdated, handlePlayerUpdated);
        socketRef.current.off(Events.PlayerJoined, handlePlayerJoined);
        socketRef.current.off(Events.MessageAnnounced, handleMessageAnnounced);
        socketRef.current.on(Events.TokenDataReturned, handleTokenDataReturned);
        // socketRef.current.off(Events.TokenExchanged, handleTokenExchanged);
      }
    };
  });

  const gameOfLibertyContextValue = useMemo<GameOfLibertyContextValue>(
    () => ({
      player,
      tokens,
      requestedToken,
      players,
      playerMap,
      transactions,
      login,
      exchangeToken,
      requestTokenData,
      calculatePlayerPortfolioValue,
      calculateRank,
      calculatePlayerAvatarNumber,
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
