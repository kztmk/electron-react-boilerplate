// @flow
import { createMuiTheme } from 'material-ui/styles/';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffa040',
      main: '#ff6f00',
      dark: '#c43e00',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#ffff89',
      main: '#d4e157',
      dark: '#a0af22',
      contrastText: '#ffffff'
    }
  }
});

export default theme;
