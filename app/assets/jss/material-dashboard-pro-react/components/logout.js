import { cardTitle } from '../../material-dashboard-pro-react';

const LogoutButtonStyle = {
  toolTip: {
    whiteSpace: 'nowrap'
  },
  iconButton: {
    position: 'absolute',
    bottom: '5px',
    width: '32px',
    height: '38px',
    margin: '5px 12px 20px 18px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  logoutIcon: {
    width: '32px',
    height: '38px'
  },
  cardTitleWhite: {
    ...cardTitle,
    color: '#FFFFFF',
    marginTop: '0'
  },
  cardCategoryWhite: {
    margin: '0',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '.875rem'
  },
  cardCategory: {
    color: '#999999',
    marginTop: '10px'
  }
};

export default LogoutButtonStyle;
