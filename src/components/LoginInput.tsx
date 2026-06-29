import "./LoginInput.css";
interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => {};
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputText({
  label,
  type,
  name,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconClick,
  value,
  onChange
}: InputProps) {
  return (
    <>
      <label className="login-label">{label}</label>
      <div className="input-container">
        {leftIcon && <span className="left-icon">{leftIcon}</span>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="login-input"
          required
        />
        {rightIcon && (
          <button
            type="button"
            className="right-icon"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
    </>
  );
}

export default InputText;
