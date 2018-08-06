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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Check from '@material-ui/icons/Check';
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
  useDomain: boolean,
  domain: string,
  tags: Array<string>,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * blogAccount自動取得時のLivedoorブログ追加情報フォーム
 */
class StepLivedoor extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      useDomain: false,
      domain: 'livedoor.jp',
      tags: [],
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
    blogParams.tags = this.state.tags.length === 0 ? this.state.tags.join(',') : '';
    blogParams.useDomain = this.state.useDomain;
    blogParams.domain = this.state.domain;

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
      useDomain: false,
      domain: 'livedoor.jp',
      tags: [],
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  /**
   * ドメイン選択枝作成
   *
   * @returns {any[]}
   */
  selectMenuItems = () => {
    const domains = [
      'blog.jp',
      'doorblog.jp',
      'ldblog.jp',
      'dreamlog.jp',
      'publog.jp',
      'livedoor.biz',
      'diary.to',
      'weblog.to',
      'bloggeek.jp',
      'blogism.jp',
      'blogo.jp',
      'blogstation.jp',
      'blogto.jp',
      'gger.jp',
      'golog.jp',
      'liblo.jp',
      'myjournal.jp',
      'mynikki.jp',
      'xxxblog.jp',
      'youblog.jp',
      '2chblog.jp',
      'teamblog.jp',
      'corpblog.jp',
      'officeblog.jp',
      'storeblog.jp',
      'cafeblog.jp',
      'officialblog.jp',
      'techblog.jp'
    ];

    const { classes } = this.props;

    return domains.map(p => (
      <MenuItem
        key={p}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={p}
      >
        {p}
      </MenuItem>
    ));
  };

  /**
   * ドメイン選択時の処理
   *
   * @param event
   */
  handleSelectDomain = event => {
    this.setState({ domain: event.target.value });
  };

  /**
   * チェックボックス選択時の処理
   */
  handleCheckBoxClicked = () => {
    console.log(`check:${this.state.useDomain}`);
    if (this.state.useDomain) {
      this.setState({ domain: '' });
    }
    this.setState({ useDomain: !this.state.useDomain });
  };

  /**
   * validation
   * @returns {boolean}
   */
  isValidate = () => {
    let errorMsg = '';
    if (this.state.titleState !== 'success') {
      errorMsg = 'ブログタイトルを確認してください。\n';
    }
    if (this.state.descriptionState !== 'success') {
      errorMsg += 'ブログの説明の入力を確認してください。\n';
    }
    if (this.state.useDomain && this.state.domain === 'livedoor.jp') {
      errorMsg += 'ドメインを選択してください。';
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
          <GridContainer container justify="left">
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
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={4} md={4}>
              <div className={`${classes.checkboxAndRadio} ${classes.checkboxAndRadioHorizontal}`}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.useDomain}
                      tabIndex={-1}
                      onClick={() => this.handleCheckBoxClicked()}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked
                      }}
                    />
                  }
                  classes={{
                    label: classes.label
                  }}
                  label="サブドメインを使う"
                />
              </div>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="subdomain-select"
                  className={
                    !this.state.useDomain ? classes.selectLabelDisabled : classes.selectLabel
                  }
                >
                  サブドメイン
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.domain}
                  onChange={this.handleSelectDomain}
                  inputProps={{
                    name: 'subdomainSelect',
                    id: 'subdomain-select',
                    disabled: !this.state.useDomain
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    サブドメインを選択
                  </MenuItem>
                  {this.selectMenuItems()}
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

export default withStyles(extendedFormsStyle)(StepLivedoor);
