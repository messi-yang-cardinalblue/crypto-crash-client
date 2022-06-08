type Props = {
  tokenId: string;
  tokenName: string;
  tokenPrice: number;
};

export default function TokenCard(props: Props) {
  return (
    <div className="p-5 border-2 rounded-xl">
      {props.tokenId},{props.tokenName},{props.tokenPrice}
    </div>
  );
}
