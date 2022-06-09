import { useState, ChangeEvent } from 'react';

type Props = {
  onMoneyChange: (amount: number) => any;
};

function QuantityInput({ onMoneyChange }: Props) {
  const [money, setMoney] = useState<number>(1);
  const handleInput = (e: ChangeEvent) => {
    // @ts-ignore
    const newValue = e.target?.value || '';
    const fixedMoney = Math.round(newValue * 100) / 100;
    /* eslint-disable no-param-reassign */
    // @ts-ignore
    e.target.value = fixedMoney;
    setMoney(fixedMoney);
    onMoneyChange(fixedMoney);
  };
  return (
    <input
      className="shadow appearance-none border rounded w-28 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      type="number"
      step="1"
      min={0}
      value={money}
      onChange={handleInput}
    />
  );
}

export default QuantityInput;
