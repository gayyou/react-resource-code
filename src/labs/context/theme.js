import React from 'react';
export const ThemeContext = React.createContext({
  theme: 'red',
  triggerTheme: () => {console.log(ThemeContext)}
});
