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
    <form className="relative flex mt-8" onSubmit={handleSubmit}>
      <input
        type="search"
        id="search"
        className="h-12 flex p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="@username"
        required
        onChange={handleNameInput}
      />
      <button
        type="submit"
        className="h-12 ml-2 w-36 rounded text-white right-2.5 bottom-2.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate"
        disabled={!name}
        onClick={handleButtonClick}
      >
        Go
      </button>
    </form>
  );
}

export default NameInputForm;
