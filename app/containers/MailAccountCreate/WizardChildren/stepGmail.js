// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import StepGmail from '../../../components/MailAccountCreate/WizardChildren/stepGmail';

const mapStateToProps = (state: State) => ({
  aliasInfo: state.AliasMailInfo.aliasMailInfo,
  sequences: state.Sequence.sequences
});


export default connect(mapStateToProps)(StepGmail);
