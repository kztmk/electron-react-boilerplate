// @flow
import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import Loadable from 'react-loading-overlay';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
// material-ui/coins
import Cancel from '@material-ui/icons/Cancel';

import type BlogAccountType from '../../types/blogAccount';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import Card from '../../ui/Card/Card';
import CardHeader from '../../ui/Card/CardHeader';
import CardText from '../../ui/Card/CardText';
import CardBody from '../../ui/Card/CardBody';
import CustomInput from '../../ui/CustomInput/CustomInput';
import Button from '../../ui/CustomButtons/Button';

import formAddStyle from '../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
import Table from '../../ui/Table/Table';
import { SaveAltIcon } from '../../assets/icons';

import { getBlogProviderImage } from './blogList';

export type Props = {
  classes: Object,
  mode: string,
  errorMessage: string,
  targetAccount: BlogAccountType,
  updateAccount: () => void,
  closeModal: () => void,
  formStatus: boolean
};

type State = {
  password: string,
  tags: Array<string>,
  data: Array<Array<string>>,
  sweetAlert: ?Object,
  isUpdated: boolean,
  readyToClose: boolean
};

const providerImageStyle = {
  marginLeft: '-15px',
  paddingTop: '6px',
  width: '32px',
  height: '36px'
};

const iconStyle = {
  width: '18px',
  height: '18px'
};

const urlSpaceAdjust = {
  marginTop: '22px'
};

class FormBlogEdit extends Component<Props, State> {
  constructor(props) {
    super(props);

    const tagArray =
      this.props.targetAccount.groupTags.length > 0
        ? this.props.targetAccount.groupTags.split(',')
        : [];
    this.state = {
      accountId: this.props.targetAccount.accountId,
      password: this.props.targetAccount.password,
      mailAddress: this.props.targetAccount.mailAddress,
      title: this.props.targetAccount.title,
      description: this.props.targetAccount.description,
      remark: this.props.targetAccount.remark,
      groupTags: tagArray,
      data: this.convertTableData(this.props.targetAccount.detailInfo),
      sweetAlert: null,
      isUpdated: false,
      readyToClose: false
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
    if (nextProps.mode === 'update' && this.state.isUpdated) {
      console.log(`props change isUpdated:${this.state.isUpdated}`);
      // propsのtargetAccountが持つtagsは文字列のため、「,」で区切り、配列を取得
      const tagArray =
        nextProps.targetAccount.groupTags.length > 0
          ? nextProps.targetAccount.groupTags.split(',')
          : [];

      // 表示処理、更新 成功、更新失敗でdialogの表示・非表示の切り分け
      let isUpdateSuccess = false;
      // 更新処理・エラーなし
      if (this.state.isUpdated && nextProps.errorMessage.length === 0) {
        isUpdateSuccess = true;
      }
      // 更新処理・エラー発生
      if (this.state.isUpdated && nextProps.errorMessage.length > 0) {
        isUpdateSuccess = false;
      }
      // 更新処理の成功・失敗でメッセージの変更
      const msg =
        this.state.isUpdated && isUpdateSuccess
          ? 'ブログ情報を更新しました。'
          : `エラー発生:${nextProps.errorMessage}`;

      // 処理と結果でstateの更新・dialogの選択・表示
      let flg = -1;
      if (!this.state.isUpdated) {
        flg = 0;
      } else {
        flg = isUpdateSuccess ? 1 : 2;
      }
      console.log(`flg:${flg}`);
      switch (flg) {
        // フォームの表示
        case 0:
          this.setState({
            accountId: this.props.targetAccount.accountId,
            password: this.props.targetAccount.password,
            mailAddress: this.props.targetAccount.mailAddress,
            title: this.props.targetAccount.title,
            description: this.props.targetAccount.description,
            remark: this.props.targetAccount.remark,
            groupTags: tagArray,
            data: this.convertTableData(nextProps.targetAccount.detailInfo),
            sweetAlert: null
          });
          break;
        // 更新・成功
        case 1:
          this.setState({
            accountId: this.props.targetAccount.accountId,
            password: this.props.targetAccount.password,
            mailAddress: this.props.targetAccount.mailAddress,
            title: this.props.targetAccount.title,
            description: this.props.targetAccount.description,
            remark: this.props.targetAccount.remark,
            groupTags: tagArray,
            data: this.convertTableData(nextProps.targetAccount.detailInfo),
            readyToClose: true,
            sweetAlert: (
              <SweetAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="更新完了"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
              >
                {msg}
              </SweetAlert>
            )
          });
          break;
        // 更新・失敗
        case 2:
          this.setState({
            accountId: this.props.targetAccount.accountId,
            password: this.props.targetAccount.password,
            mailAddress: this.props.targetAccount.mailAddress,
            title: this.props.targetAccount.title,
            description: this.props.targetAccount.description,
            remark: this.props.targetAccount.remark,
            groupTags: tagArray,
            data: this.convertTableData(nextProps.targetAccount.detailInfo),
            sweetAlert: (
              <SweetAlert
                danger
                style={{ display: 'block', marginTop: '-100px' }}
                title="更新失敗"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
              >
                {msg}
              </SweetAlert>
            )
          });
          break;
        default:
          break;
      }
    } else if (this.props.formStatus) {
      // loading
      const tagArray =
        this.props.targetAccount.groupTags.length > 0
          ? this.props.targetAccount.groupTags.split(',')
          : [];
      this.setState({
        accountId: this.props.targetAccount.accountId,
        password: this.props.targetAccount.password,
        mailAddress: this.props.targetAccount.mailAddress,
        title: this.props.targetAccount.title,
        description: this.props.targetAccount.description,
        remark: this.props.targetAccount.remark,
        groupTags: tagArray,
        data: this.convertTableData(nextProps.targetAccount.detailInfo),
        sweetAlert: null
      });
    }
  };

  /**
   * 詳細情報をテーブルで表示するためにデータを配列の配列に
   * @param details
   * @returns {Array}
   */
  convertTableData = details => {
    const tableData = [];
    let counter = 1;
    details.forEach(detail => {
      tableData.push([counter, detail]);
      counter += 1;
    });
    return tableData;
  };

  /**
   * ブログ名の変更
   * @param event
   */
  handleChangeTitle = event => {
    this.setState({
      title: event.target.value
    });
  };

  /**
   * ブログの説明の変更
   * @param event
   */
  handleChangeDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  /**
   * アカウントIDの変更
   * @param event
   */
  handleChangeAccountId = event => {
    this.setState({
      accountId: event.target.value
    });
  };

  /**
   * パスワードの変更
   * @param event
   */
  handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  };

  /**
   * グループタグの変更
   * @param currentTags
   */
  handleTags(currentTags) {
    this.setState({
      groupTags: currentTags
    });
  }

  /**
   * 備考欄の変更
   * @param event
   */
  handleChangeRemark = event => {
    this.setState({
      remark: event.target.value
    });
  };

  /**
   * ブログ情報を更新するメソッド
   */
  updateBlogAccount = () => {
    const account = {
      ...this.props.targetAccount,
      accountId: this.state.accountId,
      password: this.state.password,
      mailAddress: this.state.mailAddress,
      title: this.state.title,
      description: this.state.description,
      remark: this.state.remark,
      groupTags: this.state.groupTags.join(',')
    };
    this.setState({
      isUpdated: true
    });
    console.log('update to isUpdated true');
    this.props.updateAccount(account);
  };

  /**
   * ダイアログを非表示にする
   * 更新が成功の場合には、編集用フォームも閉じる
   */
  hideAlert = () => {
    this.setState({
      isUpdated: false,
      sweetAlert: null
    });
    console.log('set sweetAlert null');
    if (this.state.readyToClose) {
      this.props.closeModal();
    }
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
                  <h4 className={classes.cardTitle}>ブログ情報　編集</h4>
                </CardText>
                <GridItem xs={12} sm={6} className={classes.labelHorizontalLessUpperSpace}>
                  <div className={classes.buttonGroupStyle}>
                    <div className={classes.buttonGroup}>
                      <Button
                        color="primary"
                        customClass={classes.firstButton}
                        onClick={this.props.closeModal}
                      >
                        <Cancel style={iconStyle} />
                        キャンセル
                      </Button>
                      <Button
                        color="primary"
                        customClass={classes.lastButton}
                        onClick={this.updateBlogAccount}
                      >
                        <SaveAltIcon style={iconStyle} />
                        保存
                      </Button>
                    </div>
                  </div>
                </GridItem>
              </CardHeader>
              <CardBody>
                <div>
                  <form>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          ブログ名:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <CustomInput
                          id="title"
                          formControlProps={{
                            fullWidth: true
                          }}
                          lessSpace
                          inputProps={{
                            type: 'text',
                            value: this.state.title,
                            onChange: event => this.handleChangeTitle(event)
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={1}>
                        <img
                          style={providerImageStyle}
                          src={getBlogProviderImage(this.props.targetAccount.provider)}
                          alt={this.props.targetAccount.provider}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          ブログ説明
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <CustomInput
                          id="description"
                          formControlProps={{
                            fullWidth: true
                          }}
                          lessSpace
                          inputProps={{
                            type: 'text',
                            value: this.state.description,
                            onChange: event => this.handleChangeDescription(event)
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          ログインID:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
                        <CustomInput
                          id="accountId"
                          formControlProps={{
                            fullWidth: true
                          }}
                          lessSpace
                          inputProps={{
                            type: 'text',
                            disabled: true,
                            value: this.state.accountId,
                            onChange: event => this.handleChangeAccountId(event)
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          パスワード:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
                        <CustomInput
                          id="pass"
                          formControlProps={{
                            fullWidth: true
                          }}
                          lessSpace
                          inputProps={{
                            type: 'text',
                            value: this.state.password,
                            onChange: event => this.handleChangePassword(event)
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          作成:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
                        <CustomInput
                          id="disabled"
                          formControlProps={{
                            fullWidth: true
                          }}
                          lessSpace
                          inputProps={{
                            className: classes.inputNoLabelLessUpperSpace,
                            disabled: true,
                            // eslint-disable-next-line function-paren-newline
                            value: moment(this.props.targetAccount.createDate).format(
                              'YYYY/MM/DD HH:mm'
                              // eslint-disable-next-line function-paren-newline
                            )
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={1}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          URL:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={5}>
                        <div style={urlSpaceAdjust}>
                          <a
                            href={this.props.targetAccount.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {this.props.targetAccount.url}
                          </a>
                        </div>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                          備考:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={9}>
                        <CustomInput
                          id="pass"
                          formControlProps={{
                            fullWidth: true
                          }}
                          lessSpace
                          inputProps={{
                            type: 'text',
                            value: this.state.remark,
                            onChange: event => this.handleChangeRemark(event)
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontalLeastUpperSpace}>
                          グループタグ:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <div className={classes.inputNoLabelLessUpperSpace}>
                          <TagsInput
                            value={this.state.groupTags}
                            tagProps={{ className: 'react-tagsinput-tag info' }}
                            onChange={::this.handleTags}
                            inputProps={{
                              className: 'react-tagsinput-input',
                              placeholder: 'ここへタグを追加'
                            }}
                          />
                        </div>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={1} md={1} />
                      <GridItem>
                        <Table tableHead={['---詳細情報---']} tableData={this.state.data} />
                      </GridItem>
                    </GridContainer>
                  </form>
                </div>
              </CardBody>
            </Card>
            {this.state.sweetAlert}
          </GridItem>
        </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(formAddStyle)(FormBlogEdit);
