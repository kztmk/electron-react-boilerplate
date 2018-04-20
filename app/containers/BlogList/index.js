// @flow
import { connect } from 'react-redux';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import {
  importBlogsRequest,
  createBlogRequest,
  updateBlogRequest,
  deleteBlogRequest
} from './actions';

import BlogListPage from '../../components/BlogsListPage';

const mapStateToProps = (state: State) => ({
  blogAccounts: state.BlogList.blogAccounts,
  targetAccount: state.BlogList.targetAccount,
  isLoading: state.BlogList.isLoading,
  isFailure: state.BlogList.isFailure,
  errorMessage: state.BlogList.errorMessage,
  errorAccounts: state.BlogList.errorAccounts
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BlogListPage);
