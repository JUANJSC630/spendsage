export type CheckBoxUpdatePaymentItemProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
};
