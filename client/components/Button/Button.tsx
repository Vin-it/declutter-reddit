import './Button.css';

interface ButtonProps {
  text: string;
  onClick: () => void;
  width: number;
  height: number;
}

export const Button = ({ text, onClick, width, height }: ButtonProps) => {
  return (
    <button
      className="Button"
      style={{ width, height }}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
};
