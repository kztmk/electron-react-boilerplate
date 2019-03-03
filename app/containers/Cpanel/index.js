// @flow
import { connect } from 'react-redux';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import {
  getCpanelsRequest,
  createCpanelRequest,
  updateCpanelRequest,
  deleteCpanelRequest
} from "./actions";
import Cpanels from "../../components/FormSettings/cpanels";

const mapStateToProps = (state: State) => ({
  isLoading: state.Cpanel.isLoading,
  isFailure: state.Cpanel.isFailure,
  cpanels: state.Cpanel.cpanels,
  errorMessage: state.Cpanel.errorMessage
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startGetCpanels() {
    dispatch(getCpanelsRequest());
  },
  startCreateCpanel(cpanel) {
    dispatch(createCpanelRequest(cpanel));
  },
  startUpdateCpanel(cpanel) {
    dispatch(updateCpanelRequest(cpanel));
  },
  startDeleteCpanel(cpanel) {
    dispatch(deleteCpanelRequest(cpanel));
  }
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cpanels);
