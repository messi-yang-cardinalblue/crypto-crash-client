type Props = {
  tokenId: string;
  tokenName: string;
  tokenPrice: number;
};

export default function TokenCard({ tokenId, tokenName, tokenPrice }: Props) {
  return (
    <div className="p-5 border-2 rounded-xl">
      {tokenId},{tokenName},{tokenPrice}
    </div>
  );
}
