import { type ReactElement } from 'react';

export default function NodeHeaderButton({
  children,
  onClick,
}: {
  children: ReactElement;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
}
