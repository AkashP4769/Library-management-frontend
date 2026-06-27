import "./LoginInput.css";
function InputText({ label, type, name, placeholder }) {
  return (
    <>
      <label className="login-label">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="login-input"
        required
      />
    </>
  );
}

export default InputText;
