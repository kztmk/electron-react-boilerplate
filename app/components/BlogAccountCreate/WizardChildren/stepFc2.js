/* eslint-disable react/no-unused-state,react/destructuring-assignment */
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
import fc2Junre from './data/fc2';

const groupBox = {
  border: '1px solid #333',
  padding: '0 0 20px 0',
  borderRadius: '20px',
  margin: '20px 0'
};

const fc2Questions = [
  { val: '11', question: '母の出生地' },
  { val: '12', question: '父の出生地' },
  { val: '20', question: '初恋の人の名前' },
  { val: '30', question: '最初に飼ったペットの名前' },
  { val: '40', question: '卒業した小学校の名前' },
  { val: '101', question: '保険証番号の下５桁' },
  { val: '102', question: 'クレジットカード番号の下５桁' }
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
  fc2Question: string,
  fc2QuestionValue: string,
  fc2Answer: string,
  mainJunre: string,
  mainJunreValue: string,
  subJunre: string,
  subJunreValue: string,
  nickName: string,
  nickNameState: string,
  answerState: string,
  errorMessage: string,
  openErrorSnackbar: boolean,
  subJunreData: any[]
};

/**
 * blogAccount自動取得時のfc2blog追加情報フォーム
 */
class StepFc2 extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      fc2Question: '',
      fc2Answer: '',
      mainJunre: '',
      subJunre: '',
      nickName: '',
      nickNameState: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false,
      subJunreData: []
    };
  }

  /**
   * ブログ作成時に必要な情報を親フォームに送る
   */
  sendState = () => {
    const blogParams = {};
    blogParams.title = this.state.title;
    blogParams.description = this.state.description;
    blogParams.remark = this.state.remark;
    blogParams.tags = this.state.tags.length > 0 ? this.state.tags.join(',') : '';
    blogParams.nickName = `ニックネーム:${this.state.nickName}`;
    blogParams.nickNameValue = this.state.nickName;
    blogParams.question = `秘密の質問:${this.getFc2QuestionLabel(this.state.fc2Question)}`;
    blogParams.questionValue = this.state.fc2Question;
    blogParams.answer = `質問の答え:${this.state.fc2Answer}`;
    blogParams.answerValue = this.state.fc2Answer;
    blogParams.mainJunre = `メインジャンル:${this.getMainJunreLabel(this.state.mainJunre)}`;
    blogParams.mainJunreValue = this.state.mainJunre;
    blogParams.subJunre = `サブジャンル:${this.getSubJunreLabel(
      this.state.mainJunre,
      this.state.subJunre
    )}`;
    blogParams.subJunreValue = this.state.subJunre;

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
      fc2Question: '',
      fc2Answer: '',
      mainJunre: '',
      subJunre: '',
      nickName: '',
      nickNameState: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false,
      subJunreData: []
    });
  };

  /**
   * FC2作成時の秘密の質問の選択枝を作成
   *
   * @returns {any[]}
   */
  getFc2Questions = () => {
    const { classes } = this.props;

    return fc2Questions.map(q => (
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

  getFc2QuestionLabel = value => {
    const question = fc2Questions.find(q => q.val === value);
    console.log('question');
    console.log(question);
    if (question) {
      return question.question;
    } else {
      return '';
    }
  };

  /**
   * メインジャンルの選択枝を作成
   * @returns {any[]}
   */
  getMainJunre = () => {
    const { classes } = this.props;
    return fc2Junre.map(j => (
      <MenuItem
        key={j.mainJunre}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={j.mainJunre}
      >
        {j.text}
      </MenuItem>
    ));
  };

  getMainJunreLabel = value => {
    if (value) {
      const fc2mainJunre = fc2Junre.find(j => j.mainJunre === value);
      return fc2mainJunre.text;
    } else {
      return '';
    }
  };

  getSubJunreLabel = (mainJunreValue, subJunreValue) => {
    if (mainJunreValue && subJunreValue) {
      const fc2mainJunre = fc2Junre.find(j => j.mainJunre === mainJunreValue);
      const subJunre = fc2mainJunre.sub.find(s => s.subJunre === subJunreValue);
      return subJunre.text;
    } else {
      return '';
    }
  };

  /**
   * サブジャンルの選択肢を作成
   * @param mainJunre
   * @returns {*}
   */
  getSubJunre = mainJunre => {
    if (mainJunre) {
      const { classes } = this.props;
      const targetJunre = fc2Junre.find(mj => mj.mainJunre === mainJunre);

      if (targetJunre) {
        return targetJunre.sub.map(j => (
          <MenuItem
            key={j.subJunre}
            classes={{
              root: classes.selectMenuItem,
              selected: classes.selectMenuItemSelected
            }}
            value={j.subJunre}
          >
            {j.text}
          </MenuItem>
        ));
      }
    }
  };

  /**
   * 秘密の質問を選択
   *
   * @param event
   */
  handleQuestionSelected = event => {
    this.setState({
      fc2Question: event.target.value
    });
  };

  /**
   * メインジャンルを選択
   *
   * @param event
   */
  handleMainJunreSelected = event => {
    this.setState({
      subJunreData: this.getSubJunre(event.target.value),
      mainJunre: event.target.value
    });
  };

  /**
   * サブジャンルを選択
   * @param event
   */
  handleSubJunreSelected = event => {
    this.setState({
      subJunre: event.target.value
    });
  };

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidated = () => {
    console.log('fc2 start validate');
    let errorMsg = '';
    if (this.state.fc2Question.length === 0) {
      errorMsg = '秘密の質問を選択してください。\n';
    }
    if (this.state.fc2Answer.length < 3) {
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
    if (this.state.mainJunre.length === 0) {
      errorMsg += 'ジャンルを選択してください。\n';
    }
    if (this.state.subJunre.length === 0) {
      errorMsg += 'サブジャンルを選択してください。\n';
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
   * フォーム入力があった場合にフィールド毎の処理
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
            fc2Answer: event.target.value,
            answerState: 'success'
          });
        } else {
          this.setState({
            fc2Answer: event.target.value,
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
   * タグフィールド入力時
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
                <InputLabel htmlFor="fc2Question-select" className={classes.selectLabel}>
                  秘密の質問を選択
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.fc2Question}
                  onChange={this.handleQuestionSelected}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    秘密の質問を選択
                  </MenuItem>
                  {this.getFc2Questions()}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <CustomInput
                success={this.state.answerState === 'success'}
                error={this.state.answerState === 'error'}
                labelText="秘密の質問への答え"
                id="answer"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.fc2Answer,
                  onChange: event => this.inputFormChange(event, 'answer'),
                  type: 'text'
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={4} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="fc2Mainjunre-select" className={classes.selectLabel}>
                  ジャンル
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.mainJunre}
                  onChange={this.handleMainJunreSelected}
                  inputProps={{
                    name: 'fc2MainJunreSelect',
                    id: 'fc2MainJunre-select'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    ジャンルを選択
                  </MenuItem>
                  {this.getMainJunre()}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="FC2-junreSub-select" className={classes.selectLabel}>
                  サブジャンル
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.subJunre}
                  onChange={this.handleSubJunreSelected}
                  inputProps={{
                    name: 'fc2SubJunreSelect',
                    id: 'fc2SubJunre-select'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    サブジャンルを選択
                  </MenuItem>
                  {this.state.subJunreData}
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

export default withStyles(extendedFormsStyle)(StepFc2);
