import store from '@/store'
const hasPermission = (userPermission) => {
  // 当前按钮列表
  var btnPermissionList = []
  btnPermissionList = store.state.nav
  // 过滤
  let eglishPermission = []
  btnPermissionList.map((v) => {
    v.menuArr.map((s) => {
      s.children.map((vals) => {
        eglishPermission.push(vals.priCode)
      })
    })
  })
  // 是否在权限数组里面
  let status = eglishPermission.includes(userPermission)
  return status
}
const routerPermission = (userPermission) => {
  // 过滤
  let routerPermissions = []
  store.state.nav.map((v) => {
    v.menuArr.map((c) => {
      routerPermissions.push(c.path)
    })
  })
  // 是否在权限数组里面
  let routerStatus = routerPermissions.includes(userPermission)
  return routerStatus
}
export default { hasPermission, routerPermission }
