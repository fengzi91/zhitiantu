export default {
  showAppBar: state => state.global.showAppBar,
  fillHeight: state => state.global.fillHeight,
  loginLoading: state => state.auth.loginLoading,
  authBackTo: state => state.auth.backTo,
  authRedirectTo: state => state.auth.redirectTo,
  isLoggedIn: state => state.auth.loggedIn,
  userinfo: state => state.auth.userInfo,
  checkedLength: state => state.checked.data.length,
}
