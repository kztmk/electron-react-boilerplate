// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import type { DispatchType } from '../../types';
import YandexBaseSettings from '../../components/FormSettings/yandexBase';
import { getRandomPersonalInfoRequest } from '../PersonalInfo/actions';
import type AliasMailType from '../../types/aliasMailInfo';
import { deleteAliasMailRequest, saveAliasMailRequest } from './actions';

const mapStateToProps = (state: State) => ({
  isLoading: state.PersonalInfo.isLoading,
  isFailure: state.PersonalInfo.isFailure,
  errorMessage: state.PersonalInfo.errorMessage,
  personalInfo: state.PersonalInfo.personalInfo,
  randomPersonalInfo: state.PersonalInfo.randomPersonalInfo
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startGetRandomPersonalInfo() {
    dispatch(getRandomPersonalInfoRequest());
  },
  startSaveAlias(alias: AliasMailType) {
    dispatch(saveAliasMailRequest(alias))
  },
  startDeleteAlias(alias: AliasMailType) {
    dispatch(deleteAliasMailRequest(alias))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(YandexBaseSettings);
