export default {
  showAppBar: state => state.global.showAppBar,
  fillHeight: state => state.global.fillHeight,
  authLoading: state => state.auth.loginLoading || state.auth.registerLoading,
  authBackTo: state => state.auth.backTo,
  authRedirectTo: state => state.auth.redirectTo,
  isLoggedIn: state => state.auth.loggedIn,
  userinfo: state => state.auth.userInfo,
  checkedLength: state => state.checked.data.length,
  token: state => state.auth.token,
}
