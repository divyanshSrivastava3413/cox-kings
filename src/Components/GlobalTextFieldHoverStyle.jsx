import { Global } from '@emotion/react';

const GlobalTextFieldHoverStyle = () => (
  <Global
    styles={{
      '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#005899 !important', // ⬅️ Change to your desired hover border color
      },
    }}
  />
);

export default GlobalTextFieldHoverStyle;
