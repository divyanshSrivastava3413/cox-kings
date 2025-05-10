import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const InputField = ({ type, placeholder, icon, value, onChange }) => {
  // State to toggle password visibility
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? 'text' : type}
        placeholder={placeholder}
        className="input-field"
        value={value} // Ensure value is passed properly
        onChange={onChange}
        required
      />
      <i className="material-symbols-rounded">{icon}</i>
      {type === 'password' && (
        <i onClick={() => setIsPasswordShown(prevState => !prevState)} className="material-symbols-rounded eye-icon">
          {/* {isPasswordShown ? 'visibility' : 'visibility_off'} */}
        </i>
      )}
    </div>
  );
};

// Add PropTypes validation for the props
InputField.propTypes = {
  type: PropTypes.string.isRequired, // Type should be a string and is required
  placeholder: PropTypes.string.isRequired, // Placeholder should be a string and is required
  icon: PropTypes.string.isRequired, // Icon should be a string and is required
  value: PropTypes.string.isRequired, // Value should be a string and is required
  onChange: PropTypes.func.isRequired // onChange should be a function and is required
};

export default InputField;
