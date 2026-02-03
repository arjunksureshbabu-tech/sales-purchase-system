import TransactionForm from "../core/components/TransactionForm";

type Props = {};

export default function SalesForm({}: Props) {
  return (
    <TransactionForm
      title={"Sales Transaction"}
      type={"sales"}
      bgColor={"#f0fdfa"}
      titileColor={"#55c1ee"}
    />
  );
}
