import {
  cardHeader,
  defaultFont,
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader,
  primaryColor,
  primaryBoxShadow
} from '../../material-dashboard-pro-react';

const formAddStyle = {
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none'
  },
  cardHeader: {
    ...cardHeader,
    ...defaultFont,
    display: 'inline-block',
    textAlign: 'left'
  },
  cardPlainHeader: {
    marginLeft: 0,
    marginRight: 0
  },
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader,
  cardTitle: {
    color: '#FFFFFF',
    marginTop: '0',
    marginBottom: '3px',
    ...defaultFont,
    fontSize: '1.3em'
  },
  cardSubtitle: {
    marginBottom: '0',
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: '14px'
  },
  cardActions: {
    padding: '14px',
    display: 'block',
    height: 'auto'
  },
  cardContent: {
    padding: '15px 20px',
    position: 'relative'
  },
  left: {
    textAlign: 'left'
  },
  right: {
    textAlign: 'right'
  },
  center: {
    textAlign: 'center'
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
    },
    labelHorizontalDateTags: {
      color: 'rgba(0, 0, 0, 0.7)',
      cursor: 'pointer',
      display: 'inline-flex',
      fontSize: '14px',
      lineHeight: '1.428571429',
      fontWeight: '400',
      paddingTop: '24px',
      marginRight: '0',
      '@media (min-width: 992px)': {
        float: 'right'
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
      color: '#3C4858 !important',
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
      display: 'flex',
      alignItems: 'center',
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
      backgroundColor: `${primaryColor} '!important'`,
      color: '#FFFFFF'
    }
  },
  staticFormGroup: {
    marginLeft: '0',
    marginRight: '0',
    paddingBottom: '10px',
    margin: '8px 0 0 0',
    position: 'relative',
    '&:before,&:after': {
      display: 'table',
      content: '" "'
    },
    '&:after': {
      clear: 'both'
    }
  },
  staticFormControl: {
    marginBottom: '0',
    paddingTop: '8px',
    paddingBottom: '8px',
    minHeight: '34px'
  },
  inputMyControl: {
    padding: '24px 0 0',
    fontWeight: '400',
    height: '36px',
    fontSize: '14px',
    lineHeight: '1.428571429',
    color: '#555',
    '&[rows]': {
      height: 'auto'
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
  buttonGroupStyle: {
    marginTop: '-65px'
  },
  buttonGroup: {
    position: 'relative',
    margin: '10px 1px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  firstButton: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    margin: '0',
    position: 'relative',
    float: 'left',
    '&:hover': {
      zIndex: '2'
    }
  },
  middleButton: {
    borderRadius: '0',
    margin: '0',
    position: 'relative',
    float: 'left',
    '&:hover': {
      zIndex: '2'
    }
  },
  lastButton: {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    margin: '0',
    '&:hover': {
      zIndex: '2'
    }
  },
  avatar: {
    height: '24px',
    width: '24px',
    margin: '8px'
  }
};

export default formAddStyle;
