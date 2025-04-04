import { ReactNode } from 'react';
import { inputClass, labelClass } from './FormInput';

type Props = {
  labelName: string;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
};

export function PasswordInput({ labelName, onInput, icon }: Props) {
  return (
    <label className={labelClass}>
      {labelName}
      <input
        required
        name={'password'}
        type={'password'}
        onChange={(e) => onInput && onInput(e)}
        className={inputClass}
      />
      {icon}
    </label>
  );
}
