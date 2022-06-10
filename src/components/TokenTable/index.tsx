import { useCallback, useContext, useState } from 'react';
import accounting from 'accounting';
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine,
} from 'react-sparklines';
import toast from 'react-hot-toast';
import GameContext, { Token } from '@/contexts/GameContext';
import { getLastItemsFromArray } from '@/utils/common';
import QuantityInput from './QuantityInput';

type TokenAmountMap = {
  [tokenId: string]: number;
};

type Props = {
  onTokenChartClick: (tokenId: string) => any;
};

const initialAmount = 1;

function Table({ onTokenChartClick }: Props) {
  const { player, tokens, exchangeToken } = useContext(GameContext);
  const [tokenAmountMap, setTokenAmountMap] = useState<TokenAmountMap>({});

  const getTokenPriceMarginPercentIn10Cycles = useCallback(
    (token: Token) => {
      const { historyPrices } = token;
      if (historyPrices.length < 2) {
        return 100;
      }
      const margin =
        historyPrices[historyPrices.length - 1] -
        historyPrices[
          historyPrices.length > 10 ? historyPrices.length - 10 : 0
        ];
      return Math.round((margin / token.price) * 10000) / 100;
    },
    [tokenAmountMap]
  );

  const handleQuantityInput = useCallback(
    (tokenId: string, amount: number) => {
      setTokenAmountMap({ ...tokenAmountMap, [tokenId]: amount });
    },
    [tokenAmountMap]
  );

  const handleChartClick = useCallback((tokenId: string) => {
    onTokenChartClick(tokenId);
  }, []);

  const handleBuyClick = useCallback(
    (token: Token) => {
      if (!player) {
        return;
      }
      const amount = tokenAmountMap[token.id] || initialAmount;
      const price = amount * token.price;
      const playerCash = Math.round(player.cash * 100) / 100;
      if (playerCash < price) {
        toast.error(
          `You don't have enough cash, current cash: ${playerCash}, transaction amount: ${price}`
        );
        return;
      }
      exchangeToken(token.id, amount);
    },
    [player, tokenAmountMap]
  );

  const getEstimatedPrice = useCallback(
    (token: Token): string => {
      const amount = tokenAmountMap[token.id] || initialAmount;
      return accounting.formatMoney(
        Math.round(amount * token.price * 100) / 100,
        '$',
        2
      );
    },
    [player, tokenAmountMap]
  );

  const handleSellClick = useCallback(
    (token: Token) => {
      if (!player) {
        return;
      }
      const amount = tokenAmountMap[token.id] || initialAmount;
      if (player.tokenOwnerships[token.id].amount < amount) {
        toast.error(
          `You don't have ${amount} ${
            token.name
          } to sell, the amount you have: ${
            player.tokenOwnerships[token.id].amount
          }`
        );
        return;
      }
      exchangeToken(token.id, -amount);
    },
    [player, tokenAmountMap]
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token
            </th>
            <th scope="col" className="px-6 py-3">
              Energy (Debug)
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Trend
            </th>
            <th scope="col" className="px-6 py-3">
              Recent change
            </th>
            <th scope="col" className="px-6 py-3">
              You Own
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity to buy/sell
            </th>
            <th scope="col" className="px-6 py-3">
              Transaction amount
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                {token.name}
              </th>
              <td className="px-6 py-4">
                {token._energy}
              </td>
              <td className="px-6 py-4">
                {accounting.formatMoney(token.price, '$', 2)}
              </td>
              <td
                className="px-1 py-1"
                onClick={() => handleChartClick(token.id)}
              >
                <Sparklines
                  data={getLastItemsFromArray(token.historyPrices, 10)}
                >
                  {getTokenPriceMarginPercentIn10Cycles(token) > 0 ? (
                    <SparklinesLine
                      color="green"
                      style={{
                        strokeWidth: 3,
                      }}
                    />
                  ) : (
                    <SparklinesLine
                      color="red"
                      style={{
                        strokeWidth: 3,
                      }}
                    />
                  )}

                  <SparklinesReferenceLine
                    type="avg"
                    style={{ stroke: 'white', strokeWidth: 1, fill: 'none' }}
                  />
                </Sparklines>
              </td>

              {getTokenPriceMarginPercentIn10Cycles(token) > 0 ? (
                <td className="px-6 py-4 text-green-500">
                  {`▲${getTokenPriceMarginPercentIn10Cycles(token)}%`}
                </td>
              ) : (
                <td className="px-6 py-4 text-red-500">
                  {`▼${-getTokenPriceMarginPercentIn10Cycles(token)}%`}
                </td>
              )}

              <td className="px-6 py-4">
                {player?.tokenOwnerships[token.id].amount}
              </td>
              <td className="px-6 py-4">
                <QuantityInput
                  onMoneyChange={(amount: number) => {
                    handleQuantityInput(token.id, amount);
                  }}
                />
              </td>
              <td className="px-6 py-4">{getEstimatedPrice(token)}</td>
              <td className="px-6 py-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                    onClick={() => {
                      handleBuyClick(token);
                    }}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                    onClick={() => {
                      handleSellClick(token);
                    }}
                  >
                    Sell
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
