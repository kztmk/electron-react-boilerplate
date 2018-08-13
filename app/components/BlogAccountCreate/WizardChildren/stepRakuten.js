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
  junre: string,
  nickName: string,
  nickNameState: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * blogAccount自動取得時の楽天ブログ追加情報フォーム
 */
class StepRakuten extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      junre: '',
      nickName: '',
      nickNameState: '',
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
    blogParams.nickName = `ニックネーム:${this.state.nickName}`;
    blogParams.nickNameValue = this.state.nickName;
    blogParams.junre = `ジャンル:${this.state.junre}`;
    blogParams.junreValue = this.state.junre;

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
      junre: '',
      junreValue: '',
      nickName: '',
      nickNameState: '',
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  /**
   * カテゴリ選択枝の作成
   *
   * @returns {any[]}
   */
  getCategories = () => {
    const categories = [
      { val: '100', text: '園芸' },
      { val: '200', text: 'パソコン・家電' },
      { val: '300', text: '料理・食べ物' },
      { val: '400', text: 'ドリンク・お酒' },
      { val: '500', text: 'ファッション' },
      { val: '525', text: '出産・子育て' },
      { val: '600', text: '生活・インテリア' },
      { val: '700', text: '美容・コスメ' },
      { val: '710', text: '健康・ダイエット' },
      { val: '800', text: 'アウトドア・釣り' },
      { val: '805', text: '車・バイク' },
      { val: '820', text: 'スポーツ' },
      { val: '900', text: '趣味・ゲーム' },
      { val: '920', text: 'ペット' },
      { val: '1000', text: '映画・ＴＶ' },
      { val: '1005', text: '読書・コミック' },
      { val: '1025', text: '音楽' },
      { val: '1100', text: '旅行・海外情報' },
      { val: '1200', text: 'そのほか' }
    ];
    const { classes } = this.props;

    return categories.map(q => (
      <MenuItem
        key={q.val}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={q.val}
      >
        {q.text}
      </MenuItem>
    ));
  };

  /**
   * カテゴリを選択
   *
   * @param event
   */
  handleJunreSelected = event => {
    this.setState({
      junre: event.target.value
    });
  };

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidated = () => {
    let errorMsg = '';
    if (this.state.titleState !== 'success') {
      this.setState({ titleState: 'error' });
      errorMsg += 'ブログタイトルの入力を確認してください。\n';
    }
    if (this.state.descriptionState !== 'success') {
      this.setState({ descriptionState: 'error' });
      errorMsg += 'ブログの説明の入力を確認してください。\n';
    }
    if (this.state.junre.length === 0) {
      errorMsg = 'ジャンルを選択してください。\n';
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
            <GridItem xs={12} sm={6} md={6}>
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
          </GridContainer>
          <GridContainer container justify="center">
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
            <GridItem xs={12} sm={4} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="junre-select" className={classes.selectLabel}>
                  カテゴリを選択
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.junre}
                  onChange={this.handleJunreSelected}
                  inputProps={{
                    name: 'junreSelect',
                    id: 'junre-select'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    カテゴリを選択
                  </MenuItem>
                  {this.getCategories()}
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

export default withStyles(extendedFormsStyle)(StepRakuten);
