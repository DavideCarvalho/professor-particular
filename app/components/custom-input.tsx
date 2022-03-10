import { useField } from 'remix-validated-form';
import { ReactElement } from 'react';

type MyInputProps = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  inputClassName?: string;
  labelClassname?: string;
};

export const CustomInput = ({
  name,
  label,
  type,
  placeholder,
  inputClassName,
  labelClassname,
}: MyInputProps): ReactElement => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label className={labelClassname} htmlFor={name}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={inputClassName}
        {...getInputProps({ id: name })}
      />
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
};
