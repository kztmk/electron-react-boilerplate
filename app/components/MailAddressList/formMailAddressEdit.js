// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import FormLabel from 'material-ui/Form/FormLabel';
import TagsInput from 'react-tagsinput';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import type MailAccountType from '../../types/mailAccount';
import { GridContainer, ItemGrid, HeaderCard, CustomInput, Button } from '../../ui';

import regularFormsStyle from '../../asets/jss/material-dashboard-pro-react/views/regularFormsStyle';
import Table from '../../ui/Table/Table';

import { getProviderImage } from './mailAddressList';

export type Props = {
  classes: Object,
  errorMessage: string,
  isLoading: boolean,
  targetAccount: MailAccountType,
  updateAccount: () => void,
  closeModal: () => void
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

class FormMailAddressEdit extends Component<Props, State> {
  constructor(props) {
    super(props);

    const tagArray =
      this.props.targetAccount.tags.length > 0 ? this.props.targetAccount.tags.split(',') : [];
    this.state = {
      password: this.props.targetAccount.password,
      tags: tagArray,
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
    if (!nextProps.isLoading) {
      console.log(`props change isUpdated:${this.state.isUpdated}`);
      // propsのtargetAccountが持つtagsは文字列のため、「,」で区切り、配列を取得
      const tagArray =
        nextProps.targetAccount.tags.length > 0 ? nextProps.targetAccount.tags.split(',') : [];

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
          ? 'メールアカウント情報を更新しました。'
          : `エラー発生:${nextProps.errorMessage}`;

      // 処理と結果でstateの更新・dialogの選択・表示
      let flg = -1;
      if (!this.state.isUpdated) {
        flg = 0;
      } else {
        flg = isUpdateSuccess ? 1 : 2;
      }
      switch (flg) {
        // フォームの表示
        case 0:
          this.setState({
            password: nextProps.targetAccount.password,
            tags: tagArray,
            data: this.convertTableData(nextProps.targetAccount.detailInfo),
            sweetAlert: null
          });
          break;
        // 更新・成功
        case 1:
          this.setState({
            password: nextProps.targetAccount.password,
            tags: tagArray,
            data: this.convertTableData(nextProps.targetAccount.detailInfo),
            readyToClose: true,
            sweetAlert: (
              <SweetAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="更新完了"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={this.props.classes.button + ' ' + this.props.classes.success}
              >
                {msg}
              </SweetAlert>
            )
          });
          break;
        // 更新・失敗
        case 2:
          this.setState({
            password: nextProps.targetAccount.password,
            tags: tagArray,
            data: this.convertTableData(nextProps.targetAccount.detailInfo),
            sweetAlert: (
              <SweetAlert
                danger
                style={{ display: 'block', marginTop: '-100px' }}
                title="更新失敗"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={this.props.classes.button + ' ' + this.props.classes.success}
              >
                {msg}
              </SweetAlert>
            )
          });
          break;
        default:
          break;
      }
    } else {
      // loading
    }
  };

  convertTableData = details => {
    const tableData = [];
    let counter = 1;
    details.forEach(detail => {
      tableData.push([counter, detail]);
      counter += 1;
    });
    return tableData;
  };

  handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  };

  handleTags(currentTags) {
    this.setState({
      tags: currentTags
    });
  }

  updateMailAccount = () => {
    const account = {
      ...this.props.targetAccount,
      tags: this.state.tags.join(','),
      password: this.state.password
    };
    this.setState({
      isUpdated: true
    });
    console.log('update to isUpdated true');
    this.props.updateAccount(account);
  };

  hideAlert = () => {
    this.setState({
      isUpdated: false,
      sweetAlert: null
    });
    if (this.state.readyToClose) {
      this.props.closeModal();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={12}>
          <HeaderCard
            cardTitle="メールアカウント情報　編集"
            headerColor="rose"
            content={
              <div>
                <ItemGrid xs={12} sm={6} className={classes.labelHorizontalLessUpperSpace}>
                  <div className={classes.buttonGroupStyle}>
                    <div className={classes.buttonGroup}>
                      <Button
                        color="primary"
                        customClass={classes.firstButton}
                        onClick={this.props.closeModal}
                      >
                        キャンセル
                      </Button>
                      <Button
                        color="primary"
                        customClass={classes.lastButton}
                        onClick={this.updateMailAccount}
                      >
                        保存
                      </Button>
                    </div>
                  </div>
                </ItemGrid>
                <form>
                  <GridContainer>
                    <ItemGrid xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                        メールアドレス:
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={8}>
                      <CustomInput
                        id="mailAddress"
                        formControlProps={{
                          fullWidth: true
                        }}
                        lessSpace
                        inputProps={{
                          type: 'text',
                          disabled: true,
                          value: this.props.targetAccount.mailAddress
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1}>
                      <img
                        style={providerImageStyle}
                        src={getProviderImage(this.props.targetAccount.provider)}
                        alt={this.props.targetAccount.provider}
                      />
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                        パスワード:
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={9}>
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
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                        作成日時:
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={3}>
                      <CustomInput
                        id="disabled"
                        formControlProps={{
                          fullWidth: true
                        }}
                        lessSpace
                        inputProps={{
                          className: classes.inputNoLabelLessUpperSpace,
                          placeholder: 'Disabled',
                          disabled: true,
                          // eslint-disable-next-line function-paren-newline
                          value: moment(this.props.targetAccount.createDate).format(
                            'YYYY/MM/DD HH:mm'
                            // eslint-disable-next-line function-paren-newline
                          )
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontalLessUpperSpace}>
                        最終ログイン:
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={3}>
                      <CustomInput
                        id="disabled"
                        formControlProps={{
                          fullWidth: true
                        }}
                        lessSpace
                        inputProps={{
                          placeholder: 'Disabled',
                          disabled: true,
                          value: moment(this.props.targetAccount.lastLogin).format(
                            'YYYY/MM/DD HH:mm'
                          )
                        }}
                      />
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={9}>
                      <div className={classes.inputNoLabelLessUpperSpace}>
                        <TagsInput
                          value={this.state.tags}
                          tagProps={{ className: 'react-tagsinput-tag info' }}
                          onChange={::this.handleTags}
                          inputProps={{
                            className: 'react-tagsinput-input',
                            placeholder: 'ここへタグを追加'
                          }}
                        />
                      </div>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid>
                      <Table tableHead={['---詳細情報---']} tableData={this.state.data} />
                    </ItemGrid>
                  </GridContainer>
                </form>
              </div>
            }
          />
          {this.state.sweetAlert}
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(FormMailAddressEdit);
