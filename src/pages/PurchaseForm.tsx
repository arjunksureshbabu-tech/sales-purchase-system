import TransactionForm from "../core/components/TransactionForm";
type Props = {};

export default function PurchaseForm({}: Props) {
  return (
    <TransactionForm
      title={"Purchase Transaction"}
      type={"purchase"}
      bgColor={"#FFA78A"}
      titileColor={"#FF855C"}
    />
  );
}
