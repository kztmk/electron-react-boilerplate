// @flow
import React from 'react';
import { withStyles } from 'material-ui';
import Slide from 'material-ui/transitions/Slide';
import LoginForm from '../../containers/Login';
import FormResetPassword from '../../containers/ResetPassword';
import type { AuthType } from '../../types/auth';

const styles = {
  sliderItem: {
    transitionDuration: '1500ms'
  }
};

export type Props = {
  userAuth: AuthType
};

/**
 *   起動時にリダイレクトされ、最初に表示される画面
 *   Firebaseのuid(userAuth:userId)が空欄の場合、ログイン画面
 *   ログイン画面から、requestPasswordResetで、パスワードリセット画面
 *
 *   ログイン後は、インフォーメーション画面
 */
class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRequestPasswordReset: false
    };
  }

  /**
   * このコンポーネントのプロパティを変更するメソッド
   * PasswordReset画面への切替
   */
  handleRequestPasswordReset = () => {
    this.setState({ isRequestPasswordReset: true });
  };

  /**
   * このコンポーネントのプロパティを変更するメソッド
   * PasswordReset画面から、ログイン画面へ戻す
   */
  handleCancelRequestPasswordReset = () => {
    this.setState({ isRequestPasswordReset: false });
  };

  render() {
    // eslint-disable-next-line
    const isLogin = this.props.userAuth.userId.length > 0;
    return (
      <div>
        <Slide in={!isLogin}>
          {(() => {
            return this.state.isRequestPasswordReset ? (
              <FormResetPassword
                cancelRequestPasswordReset={this.handleCancelRequestPasswordReset}
              />
            ) : (
              <LoginForm requestPasswordReset={this.handleRequestPasswordReset} />
            );
          })()}
        </Slide>
        {isLogin && <h3>ホームページ</h3>}
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
