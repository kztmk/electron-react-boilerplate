// @flow
import React from 'react';
import generatePassword from 'password-generator';
// material-ui components
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import FormLabel from '@material-ui/core/FormLabel/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Clear from '@material-ui/icons/Clear';
// core components
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/accountListPageStyle';
import CustomInput from '../../../ui/CustomInput/CustomInput';

import Button from '../../../ui/CustomButtons/Button';

import Sequences from '../../../containers/MailAccountCreate/WizardChildren/sequences';
import type AliasMailType from '../../../types/aliasMailInfo';
import type SequenceType from '../../../types/sequence';
import { initialGmailBase } from '../../../containers/AliasMailInfo/reducer';

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0'
};

type Props = {
  classes: Object,
  aliasInfo: Array<AliasMailType>,
  sequences: Array<SequenceType>
};

type State = {
  disabled: boolean,
  sequenceValue: string,
  sequenceState: string,
  sequenceSelect: string,
  randomAlias: string,
  errorMessage: string,
  gmailInfo: AliasMailType,
  openErrorSnackbar: boolean,
  editSequenceModal: boolean
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

/**
 * mailAccount自動取得時のYahoo!メール用追加情報フォーム
 */
class StepGmail extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      sequenceValue: '',
      sequenceState: '',
      sequenceSelect: '',
      randomAlias: '',
      errorMessage: '',
      gmailInfo: initialGmailBase,
      openErrorSnackbar: false,
      editSequenceModal: false
    };
  }

  componentDidMount(){
    this.existsGmailInfo();
  };

  existsGmailInfo = () => {
    const gmailInfo = this.props.aliasInfo.find(alias => alias.provider === 'gmail');

    if (gmailInfo && gmailInfo.accountId.length > 0) {
      this.setState({ disabled: false, gmailInfo });
    } else {
      this.setState({
        gmailInfo: initialGmailBase,
        disabled: true,
        errorMessage: 'Gmailの登録を設定画面から行ってください。',
        openErrorSnackbar: true
      });
    }
  };

  /**
   * select box用に連番optionを作成
   * @returns {any[]}
   */
  generateSequenceValue = () => {
    const { classes } = this.props;

    return this.props.sequences.map(p => (
      <MenuItem
        key={p.key}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={p.key}
      >
        {`${p.prefix}${this.zeroPadding(p.sequence, p.sequenceDigit)}${p.suffix}`}
      </MenuItem>
    ));
  };

  /**
   * 「0(ゼロ)で桁数を埋める」
   * @param num
   * @param digits
   * @returns {string}
   */
  zeroPadding = (num, digits) => `00000000000000000000${num}`.slice(-digits);

  /**
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => {
    const plusInfo = [];
    plusInfo.accountName = `${this.state.gmailInfo.accountId}+${this.state.sequenceValue}`;
    plusInfo.domain = this.state.gmailInfo.domain;
    plusInfo.sequenceKey = this.state.sequenceSelect;

    return plusInfo;
  };

  /**
   * stateを初期化
   */
  initState = () => {
    this.setState({
      disabled: false,
      sequenceValue: '',
      sequenceState: '',
      sequenceSelect: '',
      randomAlias: '',
      errorMessage: '',
      gmailInfo: initialGmailBase,
      openErrorSnackbar: false,
      editSequenceModal: false
    });
  };

  /**
   * フォーム移動時、又は親から呼ばれるvalidation
   */
  isValidated = () => {
    if (this.state.gmailInfo.accountId.length === 0) {
      this.setState({
        errorMessage: '設定画面でGmailの登録を行ってください。\n',
        openErrorSnackbar: true
      });
      return false;
    }
    if (this.state.sequenceValue.length === 0) {
      this.setState({
        errorMessage: 'エイリアスを入力・選択してください。',
        openErrorSnackbar: true
      });
      return false;
    }
    return true;
  };

  /**
   * ランダムエイリアス欄に指定された桁数のランダム英数字を返す
   * @param event
   */
  setRandomAlias = event => {
    if (!Number.isNaN(parseInt(event.target.value, 10))) {
      // create random string length
      const alias = generatePassword(event.target.value, false, /[a-z0-9]/);
      this.setState({
        sequenceValue: alias,
        randomAlias: event.target.value,
        sequenceSelect: ''
      });
    } else {
      this.setState({
        errorMessage: 'ランダムエイリアスを作成する桁数は、半角数字を入力してください。',
        openErrorSnackbar: true
      });
    }
  };

  /**
   * 連番ドロップダウンから選択
   * @param event
   */
  handleSelectSequence = event => {
    const selectedSequence = this.props.sequences.find(s => s.key === event.target.value);
    if (selectedSequence) {
      const seq = `${selectedSequence.prefix}${this.zeroPadding(
        selectedSequence.sequence,
        selectedSequence.sequenceDigit
      )}${selectedSequence.suffix}`;
      this.setState({ sequenceValue: seq, randomAlias: '', sequenceSelect: event.target.value });
    }
  };

  /**
   * エイリアス欄が変更時のチェックと処理
   * @param event
   */
  handleChangeAlias = event => {
    if (event.target.value.length < 21) {
      if (/^[a-z0-9]+$/.test(event.target.value)) {
        this.setState({ sequenceValue: event.target.value, randomAlias: '', sequenceSelect: '' });
        this.generateAliases(event.target.value);
      } else {
        this.setState({ errorMessage: '半角英数字のみ使用できます。', openErrorSnackbar: true });
      }
    } else {
      this.setState({
        errorMessage: 'エイリアスは20桁以内で指定してください。。',
        openErrorSnackbar: true
      });
    }
  };

  /**
   * エラー表示を閉じる
   */
  handleErrorSnackbarClose = () => {
    this.setState({ errorMessage: '', openErrorSnackbar: false });
  };

  /**
   * 連番編集フォームを開く
   */
  editSequences = () => {
    this.setState({ editSequenceModal: true });
  };

  /**
   * 連番編集フォームを閉じる
   */
  editSequencesClose = () => {
    this.setState({ editSequenceModal: false });
  };

  /**
   * ランダムエイリアス欄をクリア
   */
  clearRandomAlias = () => {
    this.setState({ sequenceValue: '', randomAlias: '', sequenceSelect: '' });
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridContainer style={groupBox}>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={2} md={3}>
              <FormLabel className={classes.labelHorizontal}>
                {this.state.gmailInfo.accountId} +{' '}
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={3} md={3}>
              <CustomInput
                success={this.state.sequenceState === 'success'}
                error={this.state.sequenceState === 'error'}
                id="sequence"
                labelText="エイリアス"
                formControlProps={{
                  fullWidth: true
                }}
                lessSpace
                inputProps={{
                  onChange: this.handleChangeAlias,
                  type: 'text',
                  disabled: this.state.disabled,
                  value: this.state.sequenceValue
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={2} md={3}>
              <FormLabel className={classes.labelHorizontalLeft}>
                @{this.state.gmailInfo.domain}
              </FormLabel>
            </GridItem>
          </GridContainer>
          <GridContainer justify="center">
            <GridItem xs={12} sm={3} md={3}>
              <CustomInput
                labelText="ランダムエイリアス桁数"
                id="randomAlias"
                formControlProps={{
                  fullWidth: true,
                  className: classes.formControlAdjTop
                }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="ランダムエイリアス桁数をクリア">
                        <Button
                          justIcon
                          size="sm"
                          color="primary"
                          onClick={() => this.clearRandomAlias()}
                        >
                          <Clear />
                        </Button>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  value: this.state.randomAlias,
                  onChange: event => this.setRandomAlias(event),
                  type: 'text'
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={3} md={3}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="select-seq" className={classes.selectLabel}>
                  連番選択
                </InputLabel>
                <Select
                  value={this.state.sequenceSelect}
                  onChange={this.handleSelectSequence}
                  MenuProps={{ className: classes.selectMenu }}
                  classes={{ select: classes.select }}
                  inputProps={{
                    name: 'sequenceSelect',
                    id: 'select-seq'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    連番を選択
                  </MenuItem>
                  {this.generateSequenceValue()}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={3} md={3}>
              <Tooltip title="連番の新規作成、編集、削除を行います。">
                <Button color="primary" onClick={() => this.editSequences()}>
                  <Edit />
                  連番追加・編集
                </Button>
              </Tooltip>
            </GridItem>
          </GridContainer>
        </GridContainer>
        <Dialog
          classes={{
            root: classes.formCenter,
            paper: `${classes.modal} ${classes.modalSmall}`
          }}
          maxWidth={false}
          open={this.state.editSequenceModal}
          TransitionComponent={Transition}
        >
          <DialogTitle
            id="modal-sequence-edit"
            disableTypography
            className={classes.modalHeader}
          >
            <Button
              justIcon
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="transparent"
              onClick={() => this.editSequencesClose()}
            >
              <Close className={classes.modalClose} />
            </Button>
          </DialogTitle>
          <DialogContent
            id="formGmailSequenceseEdit"
            className={`${classes.modalBody} ${classes.modalSmallBody}`}
          >
            <Sequences closeForm={this.editSequencesClose} />
          </DialogContent>
        </Dialog>
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

export default withStyles(extendedFormsStyle)(StepGmail);
