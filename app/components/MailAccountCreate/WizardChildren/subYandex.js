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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Clear from '@material-ui/icons/Clear';
import Check from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Cancel';

// core components
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import Snackbar from '../../../ui/Snackbar/Snackbar';

// import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/accountListPageStyle';

import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
import CustomInput from '../../../ui/CustomInput/CustomInput';

import Button from '../../../ui/CustomButtons/Button';

import GmailSequences from '../../../containers/MailAccountCreate/WizardChildren/subGmail';
import type MailAccountType from '../../../types/mailAccount';
import CardBody from '../../../ui/Card/CardBody';
import CardHeader from '../../../ui/Card/CardHeader';
import CardText from '../../../ui/Card/CardText';

import { SaveAltIcon } from '../../../assets/icons';
import Card from '../../../ui/Card/Card';

const yandexDomains = [
  'yandex.ru',
  'ya.ru',
  'yandex.ua',
  'yandex.kz',
  'yandex.by',
  'yandex.com.tr',
  'narod.ru',
  'yandex.az'
];
const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0'
};

const iconStyle = {
  width: '18px',
  height: '18px'
};

type Props = {
  classes: Object,
  targetAccount: MailAccountType,
  gmailSequences: Array<GmailSequenceType>,
  mailAccounts: Array<MailAccountType>,
  closeForm: () => void
};

type State = {
  sequenceValue: string,
  sequenceState: string,
  sequenceSelect: string,
  randomAlias: string,
  errorMessage: string,
  openErrorSnackbar: boolean,
  editSequenceModal: boolean,
  checked: Array<number>,
  aliases: Array<string>
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

/**
 * mailAccount自動取得時のYahoo!メール用追加情報フォーム
 */
class YandexAlias extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      sequenceValue: '',
      sequenceState: '',
      sequenceSelect: '',
      randomAlias: '',
      errorMessage: '',
      openErrorSnackbar: false,
      editSequenceModal: false,
      checked: [],
      aliases: []
    };
  }

  componentDidMount = () => {
    this.generateAliases();
  };

  generateSequenceValue = () => {
    const { classes } = this.props;

    return this.props.gmailSequences.map(p => (
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

  zeroPadding = (num, digits) => `00000000000000000000${num}`.slice(-digits);

  /**
   * フォーム移動時、又は親から呼ばれるvalidation
   */
  isValidated = () => {
    if (this.props.targetAccount.accountId.length === 0) {
      this.setState({
        errorMessage: '元メールアドレスの取得に失敗しました。\n',
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

  setRandomAlias = event => {
    if (!Number.isNaN(parseInt(event.target.value, 10))) {
      // create random string length
      const alias = generatePassword(event.target.value, false, /[a-z0-9]/);
      this.setState({
        sequenceValue: alias,
        randomAlias: event.target.value,
        sequenceSelect: ''
      });
      this.generateAliases(alias);
    } else {
      this.setState({
        errorMessage: 'ランダムエイリアスを作成する桁数は、半角数字を入力してください。',
        openErrorSnackbar: true
      });
    }
  };

  handleSelectSequence = event => {
    const selectedSequence = this.props.gmailSequences.find(s => s.key === event.target.value);
    if (selectedSequence) {
      const seq = `${selectedSequence.prefix}${this.zeroPadding(
        selectedSequence.sequence,
        selectedSequence.sequenceDigit
      )}${selectedSequence.suffix}`;
      this.setState({ sequenceValue: seq, randomAlias: '', sequenceSelect: event.target.value });
      this.generateAliases(seq);
    }
  };

  handleChangeSequence = event => {
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

  generateAliases = (sequence = '') => {
    const aliases = [];

    yandexDomains.forEach(domain => {
      let aliasEmail = `${this.props.targetAccount.accountId}@${domain}`;

      let checkDup = this.checkDuplicate(aliasEmail);
      if (checkDup === undefined) {
        aliases.push(aliasEmail);
      }

      if (sequence.length > 0) {
        aliasEmail = `${this.props.targetAccount.accountId}+${sequence}@${domain}`;

        checkDup = this.checkDuplicate(aliasEmail);
        if (checkDup === undefined) {
          aliases.push(aliasEmail);
        }
      }
    });

    this.setState({ aliases });
  };

  checkDuplicate = email => this.props.mailAccounts.find(account => account.mailAddress === email);

  /**
   * エラー表示を閉じる
   */
  handleErrorSnackbarClose = () => {
    this.setState({ errorMessage: '', openErrorSnackbar: false });
  };

  editSequences = () => {
    this.setState({ editSequenceModal: true });
  };

  editSequencesClose = () => {
    this.setState({ editSequenceModal: false });
  };

  clearRandomAlias = () => {
    this.setState({ sequenceValue: '', randomAlias: '', sequenceSelect: '' });
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <Card>
          <CardHeader color="primary" text>
            <CardText color="primary">
              <h4 className={classes.cardTitle}>Yandexメール　エイリアス追加</h4>
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
                    キャンセル
                  </Button>
                  <Button color="primary" className={classes.lastButton} onClick={this.saveAliases}>
                    <SaveAltIcon style={iconStyle} />
                    追加
                  </Button>
                </div>
              </div>
            </GridItem>
          </CardHeader>
          <CardBody>
            <GridContainer justify="center">
              <GridItem xs={12} sm={10} md={10}>
                <GridContainer style={groupBox}>
                  <GridContainer container justify="center">
                    <GridItem xs={12} sm={2} md={3}>
                      <FormLabel className={classes.labelHorizontal}>メールアドレス:</FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={2} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        {this.props.targetAccount.accountId} +{' '}
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
                          onChange: this.handleChangeSequence,
                          type: 'text',
                          value: this.state.sequenceValue
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={2} md={3}>
                      <FormLabel className={classes.labelHorizontalLeft}>@yandex.com</FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={3} md={4}>
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
                    <GridItem xs={12} sm={3} md={4}>
                      <Tooltip title="連番の新規作成、編集、削除を行います。">
                        <Button color="primary" onClick={() => this.editSequences()}>
                          <Edit />
                          連番追加・編集
                        </Button>
                      </Tooltip>
                    </GridItem>
                  </GridContainer>
                </GridContainer>
                <GridContainer style={groupBox}>
                  <GridItem>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>以下のアドレスも同時に登録する。</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.aliases.map(value => (
                          <TableRow key={value} className={classes.tableRow}>
                            <TableCell className={classes.tableCell}>
                              <Checkbox
                                checked={this.state.checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                onClick={this.handleToggle(value)}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked
                                }}
                              />
                            </TableCell>
                            <TableCell className={classes.tableCell}>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
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
            id="modal-gmail-sequence-edit"
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
            <GmailSequences closeForm={this.editSequencesClose} />
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

export default withStyles(formAddStyle)(YandexAlias);
