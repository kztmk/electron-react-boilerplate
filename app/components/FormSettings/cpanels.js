// @flow
import React, { Component } from "react";
import Loadable from "react-loading-overlay";

import validator from "validator";

import { withStyles } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import IconButton from "@material-ui/core/IconButton/IconButton";

import Cancel from "@material-ui/icons/Cancel";
import MarkunreadMailbox from "@material-ui/icons/MarkunreadMailbox";
import ContactMail from "@material-ui/icons/ContactMail";
import AddAlert from "@material-ui/icons/AddAlert";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";

import Snackbar from "../../ui/Snackbar/Snackbar";
import GridContainer from "../../ui/Grid/GridContainer";
import GridItem from "../../ui/Grid/GridItem";
import CustomInput from "../../ui/CustomInput/CustomInput";
import type CpanelType from "../../types/CpanelType";

import { SaveAltIcon, LoginIcon } from "../../assets/icons";
import Button from "../../ui/CustomButtons/Button";

import formAddStyle from '../../assets/jss/material-dashboard-pro-react/views/formAddStyle';


const stepContent = {
  padding: '5px',
  marginTop: '-10px'
};

const groupBoxTop = {
  border: '1px solid #333',
  padding: '10px 20px',
  borderRadius: '20px',
  margin: '0'
};

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 10px 20px',
  borderRadius: '20px',
  margin: '20px 0 0 0'
};

const iconStyle = {
  width: '18px',
  height: '18px'
};

type Props = {
  classes: object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  cpanels: Array<CpanelType>,
  startGetCpanels: () => void,
  startCreateCpanel: (CpanelType) => void,
  startUpdateCpanel: (CpanelType) => void,
  startDeleteCpanel: (CpanelType) => void
}

type State = {
  mode: string,
  domain: string,
  domainState: string,
  loginName: string,
  loginNameState: string,
  password: string,
  passwordState: string,
  cpanels: Array<CpanelType>,
  errorMessage: string,
  openErrorSnackbar: boolean,
  sweetAlert: object
}

class Cpanels extends Component <Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      domainState:'',
      loginName: '',
      loginNameState: '',
      password: '',
      passwordState: '',
      cpanels: this.props.cpanels,
      openErrorSnackbar: false,
      sweetAlert: null
    }
  }



  /**
   * 入力欄が変更されたときのメソッド
   *
   * @param event
   * @param fieldName
   */
  formFieldChange = (event, fieldName) => {
    switch (fieldName) {
      case 'domain':
        if (validator.isFQDN(event.target.value)) {
          this.setState({
            domain: event.target.value,
            domainState: 'success'
          })
        } else {
          this.setState({
            domain: event.target.value,
            domainState: 'error'
          })
      }
        break;
      case 'loginName':
        if(validator.isLength(event.target.value, {min: 3, max: 32})) {
          this.setState({
            loginName: event.target.value,
            loginNameState: 'success'
          })
        } else {
          this.setState({
            loginName: event.target.value,
            loginNameState: 'error'
          })
        }
        break;
      case 'password':
        if (validator.isLength(event.target.value, {min: 6, max: 32})) {
          this.setState({
            password: event.target.value,
            passwordState: 'success'
          })
        } else {
          this.setState({
            password: event.target.value,
            passwordState: 'error'
          })
        }
        break;
      default:
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.isLoading} spinner text="ドメイン情報・・・・">
        <div>
          <GridContainer style={stepContent}>
            <GridContainer container justify="center" style={groupBoxTop}>
              <GridContainer container justify="center">
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  success={this.state.domainState === 'success'}
                  error={this.state.domainState === 'error'}
                  labelText="ドメイン"
                  id="domain"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: this.state.domain,
                    onChange: event => this.formFieldChange(event, 'domain')
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  success={this.state.loginNameState === 'success'}
                  error={this.state.loginNameState === 'error'}
                  labelText="ログインID:"
                  id="loginName"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: this.state.loginName,
                    onChange: event => this.formFieldChange(event, 'loginName'),
                    type: 'text'
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  success={this.state.passwordState === 'success'}
                  error={this.state.passwordState === 'error'}
                  labelText="パスワード"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: this.state.password,
                    onChange: event => this.formFieldChange(event, 'password')
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer justify="flex-end">
              <GridItem xs={12} sm={3} md={3}>
                <div className={classes.cardContentRight}>
                  <div className={classes.buttonGroup}>
                    <Tooltip title="メール用ド名の情報を保存します。">
                      <Button
                        color="primary"
                        className={classes.firstButton}
                        onClick={() => this.handleSaveGmailAlias()}
                      >
                        <SaveAltIcon style={iconStyle} />
                        保存
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          </GridContainer>
          </GridContainer>
          <GridContainer style={stepContent} container justify="center">
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRow}>ドメイン名</TableCell>
                    <TableCell className={classes.tableRow}>ログインID</TableCell>
                    <TableCell className={classes.tableRow}>パスワード</TableCell>
                    <TableCell className={classes.tableActions}>アクション</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.cpanels.map(task => (
                    <TableRow key={task.key} className={classes.tableRow}>
                      <TableCell className={classes.tableRow}>{task.domain}</TableCell>
                      <TableCell className={classes.tableRow}>{task.loginName}</TableCell>
                      <TableCell className={classes.tableRow}>{task.password}</TableCell>
                      <TableCell className={classes.tableActions}>
                        <Tooltip
                          id="tooltip-login"
                          title="Cpanelへログイン"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="Login"
                            className={classes.tableActionButton}
                            onClick={() => this.loginToCpanel(task.key)}
                          >
                            <LoginIcon className={`${classes.tableActionButtonIcon} ${classes.edit}`} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="編集"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="Edit"
                            className={classes.tableActionButton}
                            onClick={() => this.editSequence(task.key)}
                          >
                            <Edit className={`${classes.tableActionButtonIcon} ${classes.edit}`} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top-start"
                          title="削除"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="Close"
                            className={classes.tableActionButton}
                            onClick={() => this.deleteSequence(task.key)}
                          >
                            <Close className={`${classes.tableActionButtonIcon} ${classes.close}`} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </GridContainer>

          {this.state.sweetAlert}
          <Snackbar
            color="warning"
            place="bc"
            icon={AddAlert}
            open={this.state.openErrorSnackbar}
            closeNotification={this.handleErrorSnackbarClose}
            close
            message={<span id="login_error">{this.state.errorMessage}</span>}
          />
        </div>
      </Loadable>
    );
  }
}


export default withStyles(formAddStyle)(Cpanels);
