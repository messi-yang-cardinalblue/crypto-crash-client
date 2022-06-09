import { ChangeEvent, FormEventHandler, useState } from 'react';

type Props = {
  onSubmit: (name: string) => any;
};

function NameInputForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(name);
  };
  const handleButtonClick = () => {
    onSubmit(name);
  };
  const handleNameInput = (e: ChangeEvent) => {
    // @ts-ignore
    const newName = e.target?.value || '';
    setName(newName);
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <span className="block text-gray-700 text-sm font-bold mb-2">
          Enter your name
        </span>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
          onChange={handleNameInput}
        />
        <div className="mt-5 flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            disabled={!name}
            onClick={handleButtonClick}
          >
            Join Game
          </button>
        </div>
      </div>
    </form>
  );
}

export default NameInputForm;
