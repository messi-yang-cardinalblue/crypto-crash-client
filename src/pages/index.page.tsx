import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { AppState } from '@/stores';
import TokenCard from '@/components/TokenCard';
import TokenTable from '@/components/TokenTable';

const Home: NextPage = function Home() {
  const {
    game: { tokens },
  } = useSelector<AppState, AppState>((state) => state);

  return (
    <main className="m-5">
      <TokenTable />
      {tokens.map((token) => (
        <div key={token.id} className="mb-5">
          <TokenCard
            tokenId={token.id}
            tokenName={token.name}
            tokenPrice={token.price}
          />
        </div>
      ))}
    </main>
  );
};

export default Home;
