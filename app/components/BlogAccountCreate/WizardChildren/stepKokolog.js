/* eslint-disable react/no-unused-state */
// @flow
import React from 'react';
import TagsInput from 'react-tagsinput';
// material-ui components
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle';

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0'
};

const questions = [
  { val: '1', question: '好きな食べ物は？' },
  { val: '2', question: '嫌いな食べ物は？' },
  { val: '3', question: '初恋の相手の名前は？' },
  { val: '4', question: '尊敬する人の名前は？' },
  { val: '5', question: '一番印象に残っている学校の先生の名前は？' },
  { val: '6', question: '初めて飼ったペットの名前は？' },
  { val: '7', question: '両親の結婚記念日は？' },
  { val: '8', question: '愛用する腕時計のシリアル番号は？' }
];

type Props = {
  classes: Object
};

type State = {
  title: string,
  titleState: string,
  description: string,
  descriptionState: string,
  remark: string,
  tags: Array<string>,
  question: string,
  questionValue: string,
  answer: string,
  nickName: string,
  nickNameState: string,
  answerState: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * blogAccount自動取得時のココログ追加情報フォーム
 */
class StepKokolog extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      question: '',
      questionValue: '',
      answer: '',
      nickName: '',
      nickNameState: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  /**
   * ブログ作成時に必要な情報を親フォームに送る
   */
  sendState = () => {
    const blogParams = [];
    blogParams.title = this.state.title;
    blogParams.description = this.state.description;
    blogParams.remark = this.state.remark;
    blogParams.tags = this.state.tags.length > 0 ? this.state.tags.join(',') : '';
    blogParams.question = `秘密の質問:${this.getQuestionLabel(this.state.question)}`;
    blogParams.questionValue = this.state.question;
    blogParams.answer = `質問の答:${this.state.answer}`;
    blogParams.anserValue = this.state.answer;
    blogParams.nickName = `ニックネーム:${this.state.nickName}`;
    blogParams.nickNameValue = this.state.nickName;

    return blogParams;
  };

  /**
   * キャンセル、完了時にstateを初期化
   */
  initState = () => {
    this.setState({
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      question: '',
      questionValue: '',
      answer: '',
      nickName: '',
      nickNameState: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  /**
   * ココログ作成時の秘密の質問
   *
   * @returns {any[]}
   */
  getQuestions = () => {
    const { classes } = this.props;

    return questions.map(q => (
      <MenuItem
        key={q.val}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={q.val}
      >
        {q.question}
      </MenuItem>
    ));
  };

  getQuestionLabel = value => {
    if (value) {
      const q = questions.find(qq => qq.val === value);
      return q.question;
    }
  };

  /**
   * 秘密の質問を選択
   *
   * @param event
   */
  handleQuestionSelected = event => {
    this.setState({
      question: event.target.value
    });
  };

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidated = () => {
    let errorMsg = '';
    if (this.state.question.length === 0) {
      errorMsg = '秘密の質問を選択してください。\n';
    }
    if (this.state.answer.length < 3) {
      this.setState({ answerState: 'error' });
      errorMsg += '秘密の質問の答えを3文字以上、入力してください。';
    }
    if (this.state.titleState !== 'success') {
      this.setState({ titleState: 'error' });
      errorMsg += 'ブログタイトルの入力を確認してください。。\n';
    }
    if (this.state.descriptionState !== 'success') {
      this.setState({ descriptionState: 'error' });
      errorMsg += 'ブログの説明の入力を確認してください。\n';
    }
    if (this.state.nickNameState !== 'success') {
      this.setState({ nickNameState: 'error' });
      errorMsg += 'ニックネームの入力を確認してください。\n';
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

  /**
   * 入力項目全チェック時にエラー表示を閉じる
   */
  handleErrorSnackbarClose = () => {
    this.setState({ openErrorSnackbar: false });
  };

  requiredField = value => value.length > 3;

  /**
   * フォーム入力時のフィールド毎の処理
   *
   * @param event
   * @param type
   */
  inputFormChange = (event, type) => {
    switch (type) {
      case 'title':
        if (this.requiredField(event.target.value)) {
          this.setState({
            title: event.target.value,
            titleState: 'success'
          });
        } else {
          this.setState({
            title: event.target.value,
            titleState: 'error'
          });
        }
        break;
      case 'description':
        if (this.requiredField(event.target.value)) {
          this.setState({
            description: event.target.value,
            descriptionState: 'success'
          });
        } else {
          this.setState({
            description: event.target.value,
            descriptionState: 'error'
          });
        }
        break;
      case 'remark':
        this.setState({ remark: event.target.value });
        break;
      case 'answer':
        if (event.target.value.length > 2) {
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
        break;
      case 'nickName':
        if (this.requiredField(event.target.value)) {
          this.setState({
            nickName: event.target.value,
            nickNameState: 'success'
          });
        } else {
          this.setState({
            nickName: event.target.value,
            nickNameState: 'error'
          });
        }
        break;
      default:
    }
  };

  /**
   * タグ入力時の処理
   *
   * @param currentTags
   */
  handleTags = currentTags => {
    this.setState({
      tags: currentTags
    });
  };

  /**
   * 描画
   * @returns {*}
   */
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridContainer style={groupBox}>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                success={this.state.titleState === 'success'}
                error={this.state.titleState === 'error'}
                labelText="ブログタイトル"
                id="title"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.title,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'title')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                success={this.state.descriptionState === 'success'}
                error={this.state.descriptionState === 'error'}
                labelText="ブログの説明"
                id="description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.description,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'description')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                labelText="備考"
                id="remark"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.remark,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'remark')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="flex-start">
            <GridItem xs={12} sm={2} md={2}>
              <FormLabel className={classes.labelHorizontal}>タグ:</FormLabel>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <TagsInput
                value={this.state.tags}
                tagProps={{ className: 'react-tagsinput-tag info' }}
                onChange={this.handleTags}
                inputProps={{
                  className: 'react-tagsinput-input-top-padding',
                  placeholder: 'ここへタグを追加'
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <CustomInput
                labelText="ニックネーム"
                id="nickName"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.nickName,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'nickName')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={4} md={4}>
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
                  value={this.state.question}
                  onChange={this.handleQuestionSelected}
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
                  {this.getQuestions()}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <CustomInput
                success={this.state.answerState === 'success'}
                error={this.state.answerState === 'error'}
                labelText="質問の答え"
                id="answer"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.answer,
                  onChange: event => this.inputFormChange(event, 'answer'),
                  type: 'text'
                }}
              />
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

export default withStyles(extendedFormsStyle)(StepKokolog);
