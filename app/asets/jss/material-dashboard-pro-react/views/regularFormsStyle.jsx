// ##############################
// // // RegularForms view styles
// #############################

import customCheckboxRadioSwitch from '../../material-dashboard-pro-react/customCheckboxRadioSwitch';
import sweetAlertStyle from './sweetAlertStyle';

const regularFormsStyle = {
  ...customCheckboxRadioSwitch,
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
  ...sweetAlertStyle
};

export default regularFormsStyle;
