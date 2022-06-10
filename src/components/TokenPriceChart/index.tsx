import { useCallback } from 'react';
import { Token } from '@/contexts/GameContext';
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine,
} from 'react-sparklines';

type Props = {
  token: Token;
};

function TokenPriceChart({ token }: Props) {
  const checkIfTokenPriceGoesUp = useCallback(
    (token: Token) => {
      const { historyPrices } = token;
      if (historyPrices.length < 2) {
        return true;
      }
      return token.price > token.historyPrices[0];
    },
    [token]
  );

  return (
    <div className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <Sparklines data={token.historyPrices}>
        {checkIfTokenPriceGoesUp(token) ? (
          <SparklinesLine
            color="green"
            style={{
              strokeWidth: 1,
            }}
          />
        ) : (
          <SparklinesLine
            color="red"
            style={{
              strokeWidth: 1,
            }}
          />
        )}

        <SparklinesReferenceLine
          type="avg"
          style={{ stroke: 'white', strokeWidth: 1, fill: 'none' }}
        />
      </Sparklines>
    </div>
  );
}

export default TokenPriceChart;
