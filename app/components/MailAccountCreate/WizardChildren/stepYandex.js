// @flow
import React from 'react';
import jconv from 'jaconv';
// material-ui components
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';

// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';

const stepContent = {
  padding: '5px'
};

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0 0 0'
};

const questions = [
  { question: "Your favorite musician's surname", jp: '好きなミュージシャンの姓', key: 0 },
  { question: 'The street you grew up on', jp: '子どもの頃済んでいた町名', key: 1 },
  { question: 'Your favorite actor or actress', jp: '好きな俳優', key: 2 },
  { question: "Your grandmother's date of birth", jp: '祖母の誕生日', key: 3 },
  { question: "Your parents' post code", jp: '両親の郵便番号', key: 4 },
  { question: 'The brand of your first car', jp: '最初に購入した車名', key: 5 },
  { question: "Your favorite teacher's surname", jp: '好きな先生の姓', key: 6 },
  { question: 'Your favorite childhood book', jp: '子どもの頃好きだった本', key: 7 },
  { question: 'Your favorite computer game', jp: '好きなゲーム名', key: 8 }
];

type Props = {
  classes: Object
};

type State = {
  firstName: string,
  firstNameState: string,
  lastName: string,
  lastNameState: string,
  question: string,
  questionJp: string,
  questionSelect: string,
  answer: string,
  answerState: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * mailAccount自動取得のWizard画面 Yandex
 */
class StepYandex extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      firstNameState: '',
      lastName: '',
      lastNameState: '',
      question: '',
      questionJp: '',
      questionSelect: '',
      answer: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  /**
   * 入力欄が変更されたときのメソッド
   *
   * @param event
   * @param fieldName
   */
  formFieldChange = (event, fieldName) => {
    switch (fieldName) {
      case 'lastName':
        if (event.target.value.length > 3) {
          this.setState({
            lastName: event.target.value,
            lastNameState: 'success'
          });
        } else {
          this.setState({
            lastName: event.target.value,
            lastNameState: 'error'
          });
        }
        break;
      case 'firstName':
        if (event.target.value.length > 3) {
          this.setState({
            firstName: event.target.value,
            firstNameState: 'success'
          });
        } else {
          this.setState({
            firstName: event.target.value,
            firstNameState: 'error'
          });
        }
        break;
      case 'answer':
        {
          if (event.target.value.length > 3) {
            this.setState({
              answer: event.target.value,
              answerState: 'success'
            });
          } else {
            this.setState({
              answer: event.target.value,
              answerState: 'error'
            });
          }
        }
        break;
      default:
    }
  };

  /**
   * 文字列長確認メソッド
   *
   * @param value
   * @param length
   * @returns {boolean}
   */
  isRequiredLength = (value, length) => value.length >= length;

  getInfo = (lastNameKana: string, firstNameKana: string) => {
    const firstNameHepburn = jconv.toHebon(firstNameKana);
    const lastNameHepburn = jconv.toHebon(lastNameKana);
    this.setState({ firstName: firstNameHepburn, lastName: lastNameHepburn });
  };

  /**
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => {
    const plusInfo = [];
    plusInfo.firstNameHepburn = this.state.firstName;
    plusInfo.lastNameHepburn = this.state.lastName;
    plusInfo.question = this.state.question;
    plusInfo.answer = this.state.answer;

    return plusInfo;
  };

  /**
   * stateを初期化
   */
  initState = () => {
    this.setState({
      firstName: '',
      firstNameState: '',
      lastName: '',
      lastNameState: '',
      question: '',
      questionJp: '',
      questionSelect: '',
      answer: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  /**
   * form移動時に全ての入力項目のチェック
   *
   * @returns {boolean}
   */
  isValidated = () => {
    let errorMsg = '';

    if (this.state.lastName.length < 1 || !this.isAlfa(this.state.lastName)) {
      this.setState({ lastNameState: 'error' });
      errorMsg += '姓は必須で、尚且つ半角英字です。\n';
    } else {
      this.setState({ lastNameState: 'success' });
    }

    if (this.state.firstName.length < 1 || !this.isAlfa(this.state.firstName)) {
      this.setState({ firstNameState: 'error' });
      errorMsg += '名は必須で、尚且つ半角英字です。\n';
    } else {
      this.setState({ firstNameState: 'success' });
    }

    if (this.state.questionSelect.length === 0) {
      errorMsg += '秘密の質問を選択してください。\n';
    }

    if (this.state.answer.length < 4 || !this.isAlfaNumeric(this.state.answer)) {
      errorMsg += '質問の答えは必須です。4文字以上、尚且つ半角英数字と「-」「/」「_」です。';
      this.setState({ answerState: 'error' });
    }
    if (errorMsg.length > 0) {
      this.setState({
        errorMessage: errorMsg,
        openErrorSnackbar: true
      });
      return false;
    }

    return true;
  };

  isAlfa = value => /^[A-Za-z]+$/.test(value);

  isAlfaNumeric = value => /^[A-Za-z0-9 -/_]+$/.test(value);

  /**
   * フォーム移動時の入力チェックでエラーがあった場合のエラー表示
   */
  handleErrorSnackbarClose = () => {
    this.setState({
      openErrorSnackbar: false
    });
  };

  selectQuestions = () => {
    const { classes } = this.props;

    return questions.map(p => (
      <MenuItem
        key={p.key}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={p.key}
      >
        {p.question}
      </MenuItem>
    ));
  };

  handleSelectQuestion = event => {
    const question = questions.find(q => q.key === event.target.value);

    if (question) {
      this.setState({
        question: question.question,
        questionJp: question.jp,
        questionSelect: event.target.value
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer style={stepContent}>
          <GridContainer style={groupBox} container justify="center">
            <GridContainer container justify="center">
              <GridItem xs={12} sm={3} md={4}>
                <CustomInput
                  success={this.state.lastNameState === 'success'}
                  error={this.state.lastNameState === 'error'}
                  labelText="姓"
                  id="lastName"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.formFieldChange(event, 'lastName'),
                    value: this.state.lastName
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={3} md={4}>
                <CustomInput
                  success={this.state.firstNameState === 'success'}
                  error={this.state.firstNameState === 'error'}
                  labelText="名"
                  id="firstname"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.formFieldChange(event, 'firstName'),
                    value: this.state.firstName
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <GridItem xs={12} sm={3} md={8}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="question-select" className={classes.selectLabel}>
                    秘密の質問を選択
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={this.state.questionSelect}
                    onChange={this.handleSelectQuestion}
                    inputProps={{
                      name: 'questionSelect',
                      id: 'question-select'
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      秘密の質問を選択
                    </MenuItem>
                    {this.selectQuestions()}
                  </Select>
                  <FormHelperText>{this.state.questionJp}</FormHelperText>
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <GridItem xs={12} sm={3} md={8}>
                <CustomInput
                  success={this.state.answerState === 'success'}
                  error={this.state.answerState === 'error'}
                  labelText="質問の答え"
                  id="answer"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.formFieldChange(event, 'answer'),
                    value: this.state.answer,
                    placeholder: '質問の答え(半角英数字)'
                  }}
                />
              </GridItem>
            </GridContainer>
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
      </div>
    );
  }
}

export default withStyles(formAddStyle)(StepYandex);
