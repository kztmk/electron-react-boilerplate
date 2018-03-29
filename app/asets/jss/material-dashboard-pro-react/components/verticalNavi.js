import {
  boxShadow,
  defaultFont,
  primaryColor,
  primaryBoxShadow
} from '../../material-dashboard-pro-react';


const verticalNaviStyle = {
  verticalNavi: {
    border: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1',
    ...boxShadow,
    backgroundColor: '#333333',
    width: '70px',
    height: '100vh',
    margin: '0'
  },
  logo: {
    position: 'relative',
    padding: '15px 11px',
    zIndex: '4',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      height: '1px',
      right: '15px',
      width: 'calc(100% - 30px)',
      backgroundColor: 'rgba(180, 180, 180, 0.3)'
    }
  },
  logoImage: {
    width: '48px',
    display: 'inline-block',
    maxHeight: '48px'
  },
  list: {
    marginTop: '20px',
    paddingLeft: '0',
    paddingTop: '0',
    paddingBottom: '0',
    marginBottom: '0',
    listStyle: 'none'
  },
  item: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
  },
  itemLink: {
    width: 'auto',
    transition: 'all 300ms linear',
    margin: '20px 15px 20px',
    borderRadius: '3px',
    position: 'relative',
    display: 'block',
    padding: '10px 4px',
    backgroundColor: 'transparent',
    ...defaultFont
  },
  itemIcon: {
    width: '32px',
    height: '38px',
    marginRight: '15px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  whiteFont: {
    color: '#FFFFFF'
  },
  purple: {
    backgroundColor: primaryColor,
    boxShadow:
      '0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)',
    '&:hover': {
      backgroundColor: primaryColor,
      boxShadow:
        '0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)'
    }
  },
  toolTip: {
    whiteSpace: 'nowrap'
  },
};

export default verticalNaviStyle;
