// @flow
import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Loadable from 'react-loading-overlay';

import { withStyles } from '@material-ui/core/styles';

// import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
// import Table from '../../../ui/Table/Table';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import AddAlert from '@material-ui/icons/AddAlert';
import Cancel from '@material-ui/icons/Cancel';
import Refresh from '@material-ui/icons/Refresh';
import type { SequenceType } from '../../../types/sequence';

import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import Card from '../../../ui/Card/Card';
import CardHeader from '../../../ui/Card/CardHeader';
import CardText from '../../../ui/Card/CardText';
import CardBody from '../../../ui/Card/CardBody';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Button from '../../../ui/CustomButtons/Button';
import tasksStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import SweetAlertTitle from '../../SweetAlertTitle';
import { SaveAltIcon } from '../../../assets/icons';

const iconStyle = {
  width: '18px',
  height: '18px'
};

export type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  sequences: Array<SequenceType>,
  startCreateSequence: (sequence: SequenceType) => void,
  startUpdateSequence: (sequence: SequenceType) => void,
  startDeleteSequence: (sequence: SequenceType) => void,
  closeForm: () => void
};

type State = {
  key: string,
  targetSequence: SequenceType,
  prefix: '',
  prefixState: string,
  sequence: number,
  sequenceState: string,
  sequenceDigit: number,
  sequenceDigitState: string,
  suffix: '',
  suffixState: string,
  sequences: Array<SequenceType>,
  sweetAlert: React.Node,
  openErrorSnackbar: boolean,
  mode: string
};

class Sequences extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      key: '',
      targetSequence: {},
      prefix: '',
      prefixState: '',
      sequence: 0,
      sequenceState: '',
      sequenceDigit: 0,
      sequenceDigitState: '',
      suffix: '',
      suffixState: '',
      sequences: this.props.sequences,
      sweetAlert: null,
      openErrorSnackbar: false,
      mode: ''
    };
  }

  /**
   * propsが更新された場合の処理
   *  編集対象accountが指定されて表示した場合
   *  更新処理をした場合
   *  に、propsが更新される
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    // isLoading: false -> true loading...
    // -----
    // isLoading true -> false method done
    if (this.props.isLoading && !nextProps.isLoading && !nextProps.isFailure) {
      // 入力欄を初期化しtableを書換
      this.setState({
        prefix: '',
        prefixState: '',
        sequence: 0,
        sequenceState: '',
        sequenceDigit: 0,
        sequenceDigitState: '',
        suffix: '',
        suffixState: '',
        sequences: nextProps.sequences
      });

      if (this.state.mode === 'create' || 'update' || 'delete') {
        const { mode } = this.state;
        let title = '';
        switch (mode) {
          case 'create':
            title = 'を作成しました。';
            break;
          case 'update':
            title = 'を更新しました。';
            break;
          default:
            title = '削除しました。';
        }
        const seq = `
          ${this.state.targetSequence.prefix}
          ${this.zeroPadding(
            this.state.targetSequence.sequence,
            this.state.targetSequence.sequenceDigit
          )}
          ${this.state.targetSequence.suffix}`;
        this.setState({
          sweetAlert: (
            <SweetAlert
              success
              style={{ display: 'block', marginTop: '-100px' }}
              title={`${seq}${title}`}
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
            />
          )
        });
      }
    } else if (this.props.isLoading && !nextProps.isLoading && nextProps.isFailure) {
      // error
      this.setState({
        sweetAlert: (
          <SweetAlert
            style={{ display: 'block', marginTop: '-100px' }}
            title="エラー発生"
            onConfirm={() => this.hideAlert()}
            onCancel={() => this.hideAlert()}
            confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.warning}`}
          >
            {nextProps.errorMessage}
          </SweetAlert>
        )
      });
    }
  };

  hideAlert = () => {
    this.setState({
      sweetAlert: null,
      targetSequence: {},
      mode: ''
    });
  };

  createSequence = () => {
    // sequence validate
    if (this.validateData()) {
      const newSequence = {
        key: '',
        prefix: this.state.prefix,
        sequence: this.state.sequence,
        sequenceDigit: this.state.sequenceDigit,
        suffix: this.state.suffix
      };

      this.setState({ targetSequence: { ...newSequence }, mode: 'create' });
      this.props.startCreateSequence(newSequence);
    }
  };

  updateSequence = () => {
    if (this.validateData()) {
      const updateSequence = {
        key: this.state.key,
        prefix: this.state.prefix,
        sequence: this.state.sequence,
        sequenceDigit: this.state.sequenceDigit,
        suffix: this.state.suffix
      };
      if (updateSequence.key.length > 0) {
        this.setState({ targetSequence: { ...updateSequence }, mode: 'update' });
        this.props.startUpdateSequence(updateSequence);
      } else {
        this.setState({ targetSequence: { ...updateSequence }, mode: 'create' });
        this.props.startCreateSequence(updateSequence);
      }
    }
  };

  editSequence = sequenceKey => {
    const editSequence = this.state.sequences.find(s => s.key === sequenceKey);

    if (editSequence) {
      this.setState({
        key: editSequence.key,
        prefix: editSequence.prefix,
        sequence: editSequence.sequence,
        sequenceDigit: editSequence.sequenceDigit,
        suffix: editSequence.suffix
      });
    } else {
      this.setState({
        errorMessage: '編集対象の連番の取得に失敗しました。',
        openErrorSnackbar: true
      });
    }
  };

  deleteSequence = sequenceKey => {
    const targetSequence = this.state.sequences.find(s => s.key === sequenceKey);

    if (targetSequence) {
      const target = {
        key: targetSequence.key,
        prefix: targetSequence.prefix,
        sequence: targetSequence.sequence,
        sequenceDigit: targetSequence.sequenceDigit,
        suffix: targetSequence.suffix
      };
      this.setState({ targetSequence: { ...target }, mode: 'delete' });
      this.confirmDeleteSequence(target);
    } else {
      this.setState({
        errorMessage: '編集対象の連番の取得に失敗しました。',
        openErrorSnackbar: true
      });
    }
  };

  confirmDeleteSequence = (sequence: SequenceType) => {
    this.setState({
      sweetAlert: (
        <SweetAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title={
            <SweetAlertTitle
              row1="連番:"
              elmWord={`${sequence.prefix}${this.zeroPadding(
                sequence.sequence,
                sequence.sequenceDigit
              )}${sequence.suffix}`}
              row2="を削除しますか？"
            />
          }
          onConfirm={() => this.proceedDelete(sequence)}
          onCancel={() => this.cancelDelete()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
          cancelBtnCssClass={`${this.props.classes.button} ${this.props.classes.danger}`}
          confirmBtnText="はい、削除します。"
          cancelBtnText="キャンセル"
          showCancel
        >
          削除した連番は戻せません。
        </SweetAlert>
      )
    });
  };

  proceedDelete = sequence => {
    this.setState({
      sweetAlert: null
    });
    this.props.startDeleteSequence(sequence);
  };

  cancelDelete = () => {
    this.setState({
      sweetAlert: (
        <SweetAlert
          danger
          style={{ display: 'block', marginTop: '-100px' }}
          title="キャンセル"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
        >
          連番の削除をキャンセルしました。
        </SweetAlert>
      )
    });
  };

  validateData = () => {
    let errorMsg = '';
    if (this.state.prefix.length > 0) {
      if (this.isAlfaNumber(this.state.prefix)) {
        this.setState({ prefixState: 'success' });
      } else {
        this.setState({ prefixState: 'error' });
        errorMsg += '接頭語は半角英数字のみ使用できます。\n';
      }
    }

    if (this.state.suffix.length > 0) {
      if (this.isAlfaNumber(this.state.suffix)) {
        this.setState({ suffixState: 'success' });
      } else {
        this.setState({ suffixState: 'error' });
        errorMsg += '接尾語は半角英数字のみ使用できます。\n';
      }
    }

    if (this.state.sequenceDigit > 0 && this.state.sequenceDigit < 21) {
      this.setState({ sequenceDigitState: 'success' });
    } else {
      this.setState({ sequenceDigitState: 'error' });
      errorMsg += '連番桁数は、１ケタ以上20桁以下です。';
    }

    if (errorMsg.length > 0) {
      this.setState({ errorMessage: errorMsg, openErrorSnackbar: true });
      return false;
    }
    return true;
  };

  isAlfaNumber = value => {
    if (value) {
      return value.match(/^[A-Za-z0-9]/);
    }
    return false;
  };

  handleErrorSnackbarClose = () => {
    this.setState({ errorMessage: '', openErrorSnackbar: false });
  };

  zeroPadding = (num, digits) => {
    if (!Number.isNaN(parseInt(digits, 10))) {
      if (digits > 0) {
        return `00000000000000000000${num}`.slice(-digits);
      }
    }
    return '';
  };

  formFieldChange = (event, id) => {
    switch (id) {
      case 'prefix':
        if (event.target.value.length > 0) {
          if (this.isAlfaNumber(event.target.value)) {
            this.setState({ prefix: event.target.value, prefixState: 'success' });
          } else {
            this.setState({ prefix: event.target.value, prefixState: 'error' });
          }
        } else {
          this.setState({ prefix: '', prefixState: '' });
        }
        break;
      case 'sequence':
        if (!Number.isNaN(parseInt(event.target.value, 10))) {
          this.setState({ sequence: parseInt(event.target.value, 10), sequenceState: 'success' });
        } else {
          this.setState({ sequence: event.target.value, sequenceState: 'error' });
        }
        break;
      case 'sequenceDigit':
        if (!Number.isNaN(parseInt(event.target.value, 10))) {
          this.setState({
            sequenceDigit: parseInt(event.target.value, 10),
            sequenceDigitState: 'success'
          });
        } else {
          this.setState({ sequenceDigit: event.target.value, sequenceDigitState: 'error' });
        }
        break;
      case 'suffix':
        if (event.target.value.length > 0) {
          if (this.isAlfaNumber(event.target.value)) {
            this.setState({ suffix: event.target.value, suffixState: 'success' });
          } else {
            this.setState({ suffix: event.target.value, suffixState: 'error' });
          }
        } else {
          this.setState({ suffix: '', suffixState: '' });
        }
        break;
      default:
    }
  };

  closeForm = () => {
    this.props.closeForm();
  };

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.state.isUpdated} spinner text="サーバーと通信中・・・・">
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary" text>
                <CardText color="primary">
                  <h4 className={classes.cardTitle}>エイリアス連番編集</h4>
                </CardText>
                <GridItem xs={12} sm={6} className={classes.labelHorizontalLessUpperSpace}>
                  <div className={classes.buttonGroupStyle}>
                    <div className={classes.buttonGroup}>
                      <Button
                        color="primary"
                        className={classes.firstButton}
                        onClick={this.props.closeForm}
                      >
                        <Cancel style={iconStyle} />
                        閉じる
                      </Button>
                      <Button
                        color="primary"
                        className={classes.lastButton}
                        onClick={this.createSequence}
                      >
                        <SaveAltIcon style={iconStyle} />
                        新規追加
                      </Button>
                      <Button
                        color="primary"
                        className={classes.lastButton}
                        onClick={this.updateSequence}
                      >
                        <Refresh style={iconStyle} />
                        更新
                      </Button>
                    </div>
                  </div>
                </GridItem>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={3}>
                    <CustomInput
                      success={this.state.prefixState === 'success'}
                      error={this.state.prefixState === 'error'}
                      id="prefix"
                      labelText="接頭語"
                      formControlProps={{
                        fullWidth: true
                      }}
                      lessSpace
                      inputProps={{
                        onChange: event => this.formFieldChange(event, 'prefix'),
                        type: 'text',
                        value: this.state.prefix
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <CustomInput
                      success={this.state.sequenceState === 'success'}
                      error={this.state.sequenceState === 'error'}
                      id="sequence"
                      labelText="連番スタート(数字)"
                      formControlProps={{
                        fullWidth: true
                      }}
                      lessSpace
                      inputProps={{
                        onChange: event => this.formFieldChange(event, 'sequence'),
                        type: 'text',
                        value: this.state.sequence
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <CustomInput
                      success={this.state.sequenceDigitState === 'success'}
                      error={this.state.sequenceDigitState === 'error'}
                      id="sequenceDigit"
                      labelText="連番桁数(数字)"
                      formControlProps={{
                        fullWidth: true
                      }}
                      lessSpace
                      inputProps={{
                        onChange: event => this.formFieldChange(event, 'sequenceDigit'),
                        type: 'text',
                        value: this.state.sequenceDigit
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <CustomInput
                      success={this.state.suffixState === 'success'}
                      error={this.state.suffixState === 'error'}
                      id="suffix"
                      labelText="接尾語"
                      formControlProps={{
                        fullWidth: true
                      }}
                      lessSpace
                      inputProps={{
                        onChange: event => this.formFieldChange(event, 'suffix'),
                        type: 'text',
                        value: this.state.suffix
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  作成される連番： {this.state.prefix}
                  {this.zeroPadding(this.state.sequence, this.state.sequenceDigit)}
                  {this.state.suffix}
                </GridContainer>
              </CardBody>
            </Card>
            {this.state.sweetAlert}
          </GridItem>
        </GridContainer>
        <GridContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRow}>次回連番</TableCell>
                <TableCell className={classes.tableRow}>接頭語</TableCell>
                <TableCell className={classes.tableRow}>次回連番</TableCell>
                <TableCell className={classes.tableRow}>連番桁数</TableCell>
                <TableCell className={classes.tableRow}>接尾語</TableCell>
                <TableCell className={classes.tableActions}>編集・削除</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.sequences.map(task => (
                <TableRow key={task.key} className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>
                    {task.prefix}
                    {this.zeroPadding(task.sequence, task.sequenceDigit)}
                    {task.suffix}
                  </TableCell>
                  <TableCell className={classes.tableRow}>{task.prefix}</TableCell>
                  <TableCell className={classes.tableRow}>{task.sequence}</TableCell>
                  <TableCell className={classes.tableRow}>{task.sequenceDigit}</TableCell>
                  <TableCell className={classes.tableRow}>{task.suffix}</TableCell>
                  <TableCell className={classes.tableActions}>
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
      </Loadable>
    );
  }
}

export default withStyles(tasksStyle)(Sequences);
