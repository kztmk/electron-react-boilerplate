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
  isGetting: state.MailAddressList.isGetting,
  isCreating: state.MailAddressList.isCreating,
  isUpdating: state.MailAddressList.isUpdating,
  isDeleting: state.MailAddressList.isDeleting,
  isImporting: state.MailAddressList.isImporting,
  isFailure: state.MailAddressList.isFailure,
  metaMessage: state.MailAddressList.metaMessage,
  transAccounts: state.MailAddressList.transAccounts
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
