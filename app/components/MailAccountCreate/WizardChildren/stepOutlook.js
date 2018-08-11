// @flow
import React from 'react';

// material-ui components
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle';

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0'
};

type Props = {
  classes: Object
};

type State = {
  domain: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * mailAccount自動取得時のYahoo!メール用追加情報フォーム
 */
class StepOutlook extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  /**
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => {
    const plusInfo = [];
    plusInfo.push({ domain: this.state.domain });

    return plusInfo;
  };

  /**
   * stateを初期化
   */
  initState = () => {
    this.setState({
      domain: '',
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  /**
   * domain select
   * @param event
   */
  handleDomainSelected = event => {
    this.setState({
      domain: event.target.value
    });
  };

  /**
   * フォーム移動時、又は親から呼ばれるvalidation
   */
  isValidate = () => {
    if (this.state.domain.length > 0) {
      this.setState({
        errorMessage: 'メールアドレスのドメインを選択してください。',
        openErrorSnackbar: true
      });
      return true;
    }
    return false;
  };

  /**
   * エラー表示を閉じる
   */
  handleErrorSnackbarClose = () => {
    this.setState({ openErrorSnackbar: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridContainer style={groupBox}>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="outlookDomain-select"
                  className={classes.selectLabel}
                >
                  ドメインを選択
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.domain}
                  onChange={this.handleDomainSelected}
                  inputProps={{
                    name: 'outlookDomainSelect',
                    id: 'outlookDomain-select'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    ドメインを選択
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="outlook.jp"
                  >
                    outlook.jp
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="outlook.com"
                  >
                    outlook.com
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="hotmail.com"
                  >
                    hotmail.com
                  </MenuItem>
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
        </GridContainer>
        <Snackbar
          color="warning"
          place="bc"
          icon={AddAlert}
          open={this.state.openErrorSnackbar}
          closeNotification={this.handleErrorSnackbarClose}
          close
          message={<span id="login_error">{this.state.errorMessage}</span>}
        />
      </GridContainer>
    );
  }
}

export default withStyles(extendedFormsStyle)(StepOutlook);
