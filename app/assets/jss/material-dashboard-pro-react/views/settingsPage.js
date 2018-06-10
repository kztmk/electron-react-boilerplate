import { primaryColor, primaryBoxShadow, cardTitle } from '../../material-dashboard-pro-react';

const settingPageStyle = {
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
  cardRoot: {
    width: '75vw'
  },
  marginReset: {
    margin: '-70px'
  },
  label: {
    cursor: 'pointer',
    paddingLeft: '0',
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    display: 'inline-flex',
    transition: '0.3s ease all'
  },
  labelDisabled: {
    cursor: 'pointer',
    paddingLeft: '0',
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    display: 'inline-flex',
    transition: '0.3s ease all'
  },
  labelHorizontal: {
    color: 'rgba(0, 0, 0, 0.7)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '39px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  labelHorizontalDisabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '39px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  labelHorizontalLessUpperSpace: {
    color: 'rgba(0, 0, 0, 0.26)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '22px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  checkboxAndRadio: {
    position: 'relative',
    display: 'block',
    marginTop: '10px',
    marginBottom: '10px'
  },
  checkboxAndRadioHorizontal: {
    position: 'relative',
    display: 'block',
    '&:first-child': {
      marginTop: '10px'
    },
    '&:not(:first-child)': {
      marginTop: '-14px'
    },
    marginTop: '0',
    marginBottom: '0'
  },
  checked: {
    color: primaryColor
  },
  checkedIcon: {
    width: '20px',
    height: '20px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '3px'
  },
  uncheckedIcon: {
    width: '0px',
    height: '0px',
    padding: '9px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '3px'
  },
  radio: {
    color: primaryColor
  },
  radioChecked: {
    width: '20px',
    height: '20px',
    border: `1px solid ${primaryColor}`,
    borderRadius: '50%'
  },
  radioUnchecked: {
    width: '0px',
    height: '0px',
    padding: '9px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '50%'
  },
  groupBox: {
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '30px',
    padding: '20px',
    margin: '0 15px 15px 15px'
  },
  groupBoxDisabled: {
    border: '1px solid rgba(0, 0, 0, .25)',
    borderRadius: '30px',
    padding: '20px',
    margin: '0 15px 15px 15px'
  },
  cardContentRight: {
    padding: '0',
    position: 'relative'
  },
  buttonGroupStyle: {
    marginTop: '-65px'
  },
  buttonGroup: {
    position: 'relative',
    margin: '10px 1px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  lastButton: {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    margin: '0',
    '&:hover': {
      zIndex: '2'
    }
  },
  select: {
    padding: '12px 0 7px',
    '&:focus': {
      backgroundColor: 'transparent'
    },
    '&[aria-owns] + input + svg': {
      transform: 'rotate(180deg)'
    },
    '& + input + svg': {
      transition: 'all 300ms linear'
    }
  },
  selectFormControl: {
    '& > div': {
      '&:before': {
        backgroundColor: '#D2D2D2 !important',
        height: '1px !important'
      },
      '&:after': {
        backgroundColor: primaryColor
      }
    }
  },
  selectLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#3C4858 !important',
    top: '8px'
  },
  selectLabelDisabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: '12px',
    textTransform: 'uppercase',
    top: '8px'
  },
  selectMenu: {
    '& > div': {
      boxSizing: 'borderBox',
      borderRadius: '4px',
      padding: '0',
      minWidth: '100%',
      display: 'block',
      border: '0',
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
      backgroundClip: 'padding-box',
      margin: '2px 0 0',
      fontSize: '14px',
      textAlign: 'left',
      listStyle: 'none',
      backgroundColor: 'transparent'
    },
    '& > div > ul': {
      border: '0',
      padding: '5px 0',
      margin: '0',
      boxShadow: 'none',
      minWidth: '100%',
      borderRadius: '4px',
      boxSizing: 'border-box',
      display: 'block',
      fontSize: '14px',
      textAlign: 'left',
      listStyle: 'none',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box'
    }
  },
  selectMenuItem: {
    fontSize: '13px',
    padding: '10px 20px',
    margin: '0 5px',
    borderRadius: '2px',
    transition: 'all 150ms linear',
    display: 'block',
    clear: 'both',
    fontWeight: '400',
    lineHeight: '2',
    whiteSpace: 'nowrap',
    color: '#333',
    '&:hover': {
      backgroundColor: primaryColor,
      color: '#FFFFFF',
      ...primaryBoxShadow
    }
  },
  selectMenuItemSelected: {
    backgroundColor: primaryColor + '!important',
    color: '#FFFFFF'
  }
};

export default settingPageStyle;
