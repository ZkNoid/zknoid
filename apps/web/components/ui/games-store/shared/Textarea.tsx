import { ReactNode } from 'react';

export const Textarea = ({
  value,
  setValue,
  startContent,
  placeholder,
  className,
}: {
  value: string;
  setValue: (value: string) => void;
  startContent?: ReactNode;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div
      className={`group flex flex-row gap-2 rounded-[5px] border bg-bg-dark p-2 hover:border-left-accent ${className}`}
    >
      {startContent}
      <textarea
        className={
          'w-full appearance-none bg-bg-dark placeholder:font-plexsans placeholder:text-main placeholder:opacity-50 focus:border-none focus:outline-none group-hover:focus:text-left-accent group-hover:focus:placeholder:text-left-accent/80'
        }
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </div>
  );
};
