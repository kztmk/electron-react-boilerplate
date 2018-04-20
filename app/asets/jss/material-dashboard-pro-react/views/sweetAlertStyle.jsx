// ##############################
// // // SweetAlert view styles
// #############################

import buttonStyle from '../../material-dashboard-pro-react/components/buttonStyle';
import modalStyle from '../modalStyle';

const sweetAlertStyle = {
  toolTip: {
    whiteSpace: 'nowrap'
  },
  cardTitle: {
    marginTop: '0',
    marginBottom: '3px',
    color: '#3C4858',
    fontSize: '18px'
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
  ...buttonStyle,
  ...modalStyle
};

export default sweetAlertStyle;
