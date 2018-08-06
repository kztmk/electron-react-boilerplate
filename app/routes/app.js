import Home from '@material-ui/icons/Home';
import MailOutline from '@material-ui/icons/MailOutline';
import Web from '@material-ui/icons/Web';
import AccountBox from '@material-ui/icons/AccountBox';
import Settings from '@material-ui/icons/SettingsSharp';
import HomePage from '../containers/HomePage';
import BlogsListPage from '../containers/BlogList';
import MailAddressListPage from '../containers/MailAddressList';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';

const appRoutes = [
  {
    id: 'nav-icon-home',
    path: '/home',
    navName: 'トップ',
    icon: Home,
    component: HomePage
  },
  {
    id: 'nav-icon-mailaddresses',
    path: '/mailaccounts_views',
    navName: 'メールアドレス一覧',
    icon: MailOutline,
    component: MailAddressListPage,
    to: '/home'
  },
  {
    id: 'nav-icon-blogs',
    path: '/blogs_views',
    navName: 'ブログ一覧',
    icon: Web,
    component: BlogsListPage,
    to: '/home'
  },
  {
    id: 'nav-icon-profile',
    path: '/profile',
    navName: 'プロフィール',
    icon: AccountBox,
    component: ProfilePage,
    to: '/home'
  },
  {
    id: 'nav-icon-settings',
    path: '/settings',
    navName: '設定',
    icon: Settings,
    component: SettingsPage,
    to: '/home'
  },
  {
    redirect: true,
    path: '/',
    to: '/home'
  }
];

export default appRoutes;
