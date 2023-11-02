export interface UnselectButtonProps {
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon: React.ReactNode;
  className?: string;
}

export const UnselectButton = ({
  onKeyDown,
  onMouseDown,
  onClick,
  icon,
  className,
}: UnselectButtonProps) => {
  return (
    <button className={className} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onClick={onClick}>
      {icon}
    </button>
  );
};
