import { clsx } from 'clsx';
import { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react';

export const Input = ({
  value,
  setValue,
  placeholder,
  startContent,
  isClearable = true,
  type = 'text',
  inputMode = 'text',
  isBordered = true,
}: {
  value: any;
  setValue: (value: any) => void;
  placeholder?: string;
  startContent?: ReactNode;
  isClearable?: boolean;
  type?: HTMLInputTypeAttribute;
  inputMode?:
    | 'email'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;
  isBordered?: boolean;
}) => {
  return (
    <div
      className={clsx(
        'group flex flex-row gap-2 rounded-[5px] bg-bg-dark p-2',
        { 'border hover:border-left-accent': isBordered }
      )}
    >
      {startContent}
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        className={
          'w-full appearance-none bg-bg-dark placeholder:font-plexsans placeholder:text-main placeholder:opacity-50 focus:border-none focus:outline-none group-hover:focus:text-left-accent group-hover:focus:placeholder:text-left-accent/80'
        }
        value={value}
        onChange={(event) => {
          setValue(
            type === 'number'
              ? parseInt(event.target.value)
                ? parseInt(event.target.value)
                : value
              : event.target.value
          );
        }}
      />
      {isClearable && (
        <div
          className={clsx('flex items-center justify-center', {
            'visible cursor-pointer opacity-60 transition-opacity ease-in-out hover:opacity-100':
              value.length !== 0,
            invisible: value.length === 0,
          })}
          onClick={() => setValue(type === 'number' ? 0 : '')}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            role="presentation"
            viewBox="0 0 24 24"
            width={24}
            height={24}
          >
            <path
              d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
              fill="#F9F8F4"
              className={'group-hover:fill-left-accent'}
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};
