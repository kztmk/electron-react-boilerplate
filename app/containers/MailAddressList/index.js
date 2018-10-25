// @flow
import { connect } from 'react-redux';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import {
  importMailAddressRequest,
  createMailAddressRequest,
  updateMailAddressRequest,
  deleteMailAddressRequest,
  getMailAddressRequest,
  updateLastLoginRequest, setPageSizeRequest
} from "./actions";

import MailAddressListPage from '../../components/MailAddressList';
import { closeConnectionRequest } from '../MailAccount/actions';
import {
  getRandomPersonalInfoRequest,
  savePersonalInfoForBlogRequest
} from '../PersonalInfo/actions';
import { createBlogRequest } from '../BlogList/actions';

const mapStateToProps = (state: State) => ({
  mailAccounts: state.MailAddressList.mailAccounts,
  isGetting: state.MailAddressList.isGetting,
  isCreating: state.MailAddressList.isCreating,
  isUpdating: state.MailAddressList.isUpdating,
  isDeleting: state.MailAddressList.isDeleting,
  isImporting: state.MailAddressList.isImporting,
  isFailure: state.MailAddressList.isFailure,
  metaMessage: state.MailAddressList.metaMessage,
  transAccounts: state.MailAddressList.transAccounts,
  pageSize: state.MailAddressList.pageSize
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startGetMailAccounts() {
    dispatch(getMailAddressRequest());
  },
  startImportMailAccounts(mailAccounts) {
    dispatch(importMailAddressRequest(mailAccounts));
  },
  startCreateMailAccount(mailAccount) {
    dispatch(createMailAddressRequest(mailAccount));
  },
  startUpdateMailAccount(mailAccount) {
    dispatch(updateMailAddressRequest(mailAccount));
  },
  startDeleteMailAccount(mailAccount) {
    dispatch(deleteMailAddressRequest(mailAccount));
  },
  startCloseConnection() {
    dispatch(closeConnectionRequest());
  },
  startGetRandomPersonalInfo() {
    dispatch(getRandomPersonalInfoRequest());
  },
  startCreateBlogAccount(blogAccount) {
    dispatch(createBlogRequest(blogAccount));
  },
  startSavePersonalInfoForBlog(personalInfo) {
    dispatch(savePersonalInfoForBlogRequest(personalInfo));
  },
  startUpdateLastLogin(mailAccount) {
    dispatch(updateLastLoginRequest(mailAccount));
  },
  startSetPageSize(pageSize) {
    dispatch(setPageSizeRequest(pageSize));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MailAddressListPage);
