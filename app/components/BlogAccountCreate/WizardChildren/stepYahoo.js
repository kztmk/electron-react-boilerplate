// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import FormControl from 'material-ui/Form/FormControl';
import InputLabel from 'material-ui/Input/InputLabel';

// @material-ui/icons
import AddAlert from 'material-ui-icons/AddAlert';

import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
// core components
import { GridContainer, ItemGrid, CustomInput, Snackbar } from '../../../ui';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle';

// import yahooQuestions from './questionsForApply';
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
  yahooQuestion: string,
  yahooAnswer: string,
  answerState: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * mailAccount自動取得時のYahoo!メール用追加情報フォーム
 */
class StepYahoo extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      yahooQuestion: '',
      yahooAnswer: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  /**
   * Yahoo!メール作成時の秘密の質問
   *
   * @returns {any[]}
   */
  getYahooQuestions = () => {
    const yahooQuestions = [
      '父親の出身地は？',
      '初めて飛行機で行った場所は？',
      '初めての習いごとは？',
      '卒業旅行で行った場所は？',
      '小学校6年生のときの先生は？',
      '初めてデートした場所は？',
      '1番年上のいとこの名前は？',
      '初めて勤めた会社の場所は？',
      '小学生のころのあだ名は？',
      '子どものころの憧れの職業は？',
      '初めて泣いた映画は？',
      '3歳の時に住んでいた場所は？',
      '子どものころのヒーローは？',
      '高校時代の所属クラブは？',
      '最後の晩餐で食べたいものは？'
    ];
    const { classes } = this.props;

    return yahooQuestions.map(q => (
      <MenuItem
        key={q}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={q}
      >
        {q}
      </MenuItem>
    ));
  };

  /**
   * 秘密の質問を選択
   *
   * @param event
   */
  handleQuestionSelected = event => {
    this.setState({
      yahooQuestion: event.target.value
    });
  };

  /**
   * 秘密の質問の答えを入力
   *
   * @param event
   * @param fieldName
   */
  changeFormField = (event, fieldName) => {
    if (fieldName === 'answer') {
      if (event.target.value.length > 2) {
        this.setState({
          yahooAnswer: event.target.value,
          answerState: 'success'
        });
      } else {
        this.setState({
          yahooAnswer: event.target.value,
          answerState: 'error'
        });
      }
    }
  };

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidate = () => {
    let errorMsg = '';
    if (this.state.yahooQuestion.length === 0) {
      errorMsg = '秘密の質問を選択してください。\n';
    }
    if (this.state.yahooAnswer.length < 3) {
      this.setState({ answerState: 'error' });
      errorMsg += '秘密の質問の答えを3文字以上、入力してください。';
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

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridContainer style={groupBox}>
          <GridContainer container justify="center">
            <ItemGrid xs={12} sm={8} md={8}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="yahooQuestion-select" className={classes.selectLabel}>
                  秘密の質問を選択
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.yahooQuestion}
                  onChange={this.handleQuestionSelected}
                  inputProps={{
                    name: 'yahooQuestionSelect',
                    id: 'yahooQuestion-select'
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
                  {this.getYahooQuestions()}
                </Select>
              </FormControl>
            </ItemGrid>
          </GridContainer>
          <GridContainer container justify="center">
            <ItemGrid xs={12} sm={8} md={8}>
              <CustomInput
                success={this.state.answerState === 'success'}
                error={this.state.answerState === 'error'}
                labelText="秘密の質問への答え"
                id="answer"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.yahooAnswer,
                  onChange: event => this.changeFormField(event, 'answer'),
                  type: 'text'
                }}
              />
            </ItemGrid>
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

export default withStyles(extendedFormsStyle)(StepYahoo);
