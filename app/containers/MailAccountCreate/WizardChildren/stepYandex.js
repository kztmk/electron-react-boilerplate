// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import StepYandex from '../../../components/MailAccountCreate/WizardChildren/stepYandex';

const mapStateToProps = (state: State) => ({
  aliasInfo: state.AliasMailInfo.aliasMailInfo,
  sequences: state.Sequence.sequences,
  mailAccounts: state.MailAddressList.mailAccounts
});


export default connect(mapStateToProps)(StepYandex);
