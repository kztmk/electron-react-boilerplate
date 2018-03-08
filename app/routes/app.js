import BlogsListPage from '../components/BlogsListPage';
import MailAddressListPage from '../components/MailAddressListPage';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import AuthPage from '../components/AuthPage';
import { LoginIcon, LogoutIcon } from '../asets/icons';

import MailOutline from 'material-ui-icons/MailOutline';
import Web from 'material-ui-icons/Web';
import AccountBox from 'material-ui-icons/AccountBox';
import Settings from 'material-ui-icons/Settings';

const appRoutes = [
  {
    path: '/mailaddresses',
    naviName: 'メールアドレス一覧',
    icon: MailOutline,
    component: MailAddressListPage
  },
  {
    path: '/blogs',
    naviName: 'ブログ一覧',
    icon: Web,
    component: BlogsListPage
  },
  {
    path: '/profile',
    naviName: 'プロフィール',
    icon: AccountBox,
    component: ProfilePage
  },
  {
    path: '/settings',
    naviName: '設定',
    icon: Settings,
    component: SettingsPage
  },
  {
    path: '/',
    naviName: '認証',
    icon: LoginIcon,
    component: AuthPage
  }
];

export default appRoutes;
