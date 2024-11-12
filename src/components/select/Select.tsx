import React from 'react';
import './Select.scss';
import { ChevronDown } from 'react-feather';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  selectStyle?: 'regular' | 'action' | 'alert' | 'flush';
}

export function Select({
  options,
  value,
  placeholder = 'select...',
  onChange,
  selectStyle = 'regular',
  ...rest
}: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div data-component="Select" className={`select-style-${selectStyle}`}>
      <select 
        value={value} 
        onChange={handleChange}
        {...rest}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="icon">
        <ChevronDown />
      </span>
    </div>
  );
} 