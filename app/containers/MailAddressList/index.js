// @flow
import { connect } from 'react-redux';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import {
  importMailAddressRequest,
  createMailAddressRequest,
  updateMailAddressRequest,
  deleteMailAddressRequest,
  getMailAddressRequest
} from './actions';

import MailAddressListPage from '../../components/MailAddressList';

const mapStateToProps = (state: State) => ({
  mailAccounts: state.MailAddressList.mailAccounts,
  targetAccount: state.MailAddressList.targetAccount,
  isLoading: state.MailAddressList.isLoading,
  isFailure: state.MailAddressList.isFailure,
  isRefreshDone: state.MailAddressList.isRefreshDone,
  errorMessage: state.MailAddressList.errorMessage,
  errorAccounts: state.MailAddressList.errorAccounts
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MailAddressListPage);
