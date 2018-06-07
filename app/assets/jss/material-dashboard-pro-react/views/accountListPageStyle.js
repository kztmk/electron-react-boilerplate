// ##############################
// // // accountListPage view styles
// #############################

import { defaultFont } from '../../material-dashboard-pro-react';
import buttonStyle from '../../material-dashboard-pro-react/components/buttonStyle';

const accountListPageStyle = {
  cardTitle: {
    marginTop: '0',
    marginBottom: '3px',
    color: '#3C4858',
    fontSize: '18px'
  },
  cardHeader: {
    zIndex: '3'
  },
  cardSubtitle: {
    ...defaultFont,
    color: '#999999',
    fontSize: '14px',
    margin: '0 0 10px'
  },
  center: {
    textAlign: 'center'
  },
  right: {
    textAlign: 'right'
  },
  left: {
    textAlign: 'left'
  },
  marginRight: {
    marginRight: '5px'
  },
  modalSectionTitle: {
    marginTop: '30px'
  },
  cardContent: {
    padding: '0 20px'
  },
  cardContentRight: {
    padding: '15px 20px 15px 0px',
    position: 'relative'
  },
  cardContentBottom: {
    padding: '15px 0px 0px 0px',
    position: 'relative'
  },
  icons: {
    width: '17px',
    height: '17px'
  },
  modalNarrow: {
    borderRadius: '6px',
    minHeight: '40vh',
    maxHeight: '80vh',
    minWidth: '40vw',
    maxWidth: '65vw'
  },
  modal: {
    borderRadius: '6px',
    minHeight: '60vh',
    maxHeight: '100vh',
    minWidth: '85vw',
    maxWidth: '95vw'
  },
  modalWide: {
    borderRadius: '6px',
    minHeight: '60vh',
    maxHeight: '100vh',
    minWidth: '75vw',
    maxWidth: '95vw'
  },
  modalHeader: {
    borderBottom: 'none',
    paddingTop: '6px',
    paddingRight: '24px',
    paddingBottom: '0',
    paddingLeft: '24px',
    minHeight: '16.43px'
  },
  modalTitle: {
    margin: '0',
    lineHeight: '1.42857143'
  },
  modalCloseButton: {
    color: '#999999',
    marginTop: '-12px',
    WebkitAppearance: 'none',
    padding: '0',
    cursor: 'pointer',
    background: '0 0',
    border: '0',
    fontSize: 'inherit',
    opacity: '.9',
    textShadow: 'none',
    fontWeight: '700',
    lineHeight: '1',
    float: 'right'
  },
  modalClose: {
    width: '16px',
    height: '16px'
  },
  modalBody: {
    paddingTop: '0px',
    paddingRight: '24px',
    paddingBottom: '16px',
    paddingLeft: '24px',
    position: 'relative'
  },
  modalFooter: {
    padding: '15px',
    textAlign: 'right',
    paddingTop: '0',
    margin: '0'
  },
  modalFooterCenter: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  instructionNoticeModal: {
    marginBottom: '25px'
  },
  imageNoticeModal: {
    maxWidth: '150px'
  },
  modalSmall: {
    width: '300px'
  },
  modalSmallBody: {
    paddingTop: '0'
  },
  modalLarge: {
    width: '720px'
  },
  modalLargeBody: {
    paddingTop: '0'
  },
  modalSmallFooterFirstButton: {
    margin: '0',
    paddingLeft: '16px',
    paddingRight: '16px',
    width: 'auto'
  },
  modalSmallFooterSecondButton: {
    marginBottom: '0',
    marginLeft: '5px'
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
  buttonGroupStyle: {
    marginTop: '-70px'
  },
  ...buttonStyle
};

export default accountListPageStyle;
