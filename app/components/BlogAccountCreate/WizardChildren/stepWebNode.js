/* eslint-disable react/no-unused-state */
// @flow
import React from 'react';
import TagsInput from 'react-tagsinput';
import generatePassword from 'password-generator';

// material-ui components
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '../../../ui/CustomButtons/Button';
import Refresh from '../../../../node_modules/@material-ui/icons/Refresh';

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
  subdomain: string,
  subdomainState: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * blogAccount自動取得時のwebNode追加情報フォーム
 */
class StepWebNode extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      subdomain: '',
      subdomainState: '',
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
    blogParams.subdomain = `サブドメイン:${this.state.subdomain}`;
    blogParams.subdomainValue = this.state.subdomain;

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
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  setFirstBlog = () => {
    // nothing to do
  }

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidated = () => {
    let errorMsg = '';
    if (this.state.titleState !== 'success') {
      this.setState({ titleState: 'error' });
      errorMsg = 'ブログタイトルを確認してください。\n';
    }
    if (this.state.descriptionState !== 'success') {
      this.setState({ descriptionState: 'error' });
      errorMsg += 'ブログの説明の入力を確認してください。\n';
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
      case 'subdomain':
        this.setState({ subdomain: event.target.value });
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
   * ランダムな文字列でaccountIdを作成
   *
   * 文字列長をaccountId欄に入力すれば優先、default length 8
   */
  handleGenerateAccountId = () => {
    let acLength = 8;
    const newAcLength = parseInt(this.state.subdomain, 10);
    if (!Number.isNaN(newAcLength)) {
      if (newAcLength > 8) {
        acLength = newAcLength;
      }
    }
    const newAccountId = generatePassword(acLength, false, /[a-z0-9]/);
    if (this.isRequiredLength(newAccountId, 8)) {
      this.setState({
        subdomain: newAccountId.toLowerCase(),
        subdomainState: 'success'
      });
    } else {
      this.setState({
        subdomain: newAccountId.toLowerCase(),
        subdomainState: 'error'
      });
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
                success={this.state.subdomainState === 'success'}
                error={this.state.subdomainState === 'error'}
                labelText="サブドメイン:"
                id="subdomain"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="ランダムなIDを再取得">
                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => this.handleGenerateAccountId()}
                        >
                          <Refresh />
                        </Button>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  value: this.state.subdomain,
                  onChange: event => this.formFieldChange(event, 'subdomain'),
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

export default withStyles(extendedFormsStyle)(StepWebNode);
