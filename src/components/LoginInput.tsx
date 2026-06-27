import "./LoginInput.css";
interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => {};
}

function InputText({
  label,
  type,
  name,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconClick,
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
