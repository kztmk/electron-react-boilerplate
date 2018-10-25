// @flow
import { connect } from 'react-redux';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import {
  importBlogsRequest,
  createBlogRequest,
  updateBlogRequest,
  deleteBlogRequest,
  getBlogsRequest, setPageSizeRequest
} from "./actions";

import BlogListPage from '../../components/BlogsListPage';

const mapStateToProps = (state: State) => ({
  blogAccounts: state.BlogList.blogAccounts,
  isGetting: state.BlogList.isGetting,
  isCreating: state.BlogList.isCreating,
  isUpdating: state.BlogList.isUpdating,
  isDeleting: state.BlogList.isDeleting,
  isImporting: state.BlogList.isImporting,
  isFailure: state.BlogList.isFailure,
  metaMessage: state.BlogList.metaMessage,
  transAccounts: state.BlogList.transAccounts,
  pageSize: state.BlogList.pageSize
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startGetBlogAccounts() {
    dispatch(getBlogsRequest());
  },
  startImportBlogAccounts(blogAccounts) {
    dispatch(importBlogsRequest(blogAccounts));
  },
  startCreateBlogAccount(blogAccount) {
    dispatch(createBlogRequest(blogAccount));
  },
  startUpdateBlogAccount(blogAccount) {
    dispatch(updateBlogRequest(blogAccount));
  },
  startDeleteBlogAccount(blogAccount) {
    dispatch(deleteBlogRequest(blogAccount));
  },
  startSetPageSize(pageSize) {
    dispatch(setPageSizeRequest(pageSize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogListPage);
