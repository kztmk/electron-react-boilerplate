// @flow
import { connect } from 'react-redux';
import FormProfile from '../../components/FormProfile';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import { setProfile } from './actions';
import type { UserAccountType } from '../../types/userAccount';

const mapStateToProps = (state: State) => ({
  userInfo: state.Profile
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  addProfile(userInfo: UserAccountType) {
    dispatch(setProfile(userInfo));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FormProfile);
