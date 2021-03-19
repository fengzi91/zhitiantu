/**
 * 表单验证公用规则
 **/
export const required = name => {
  return v => !!v || `${name} 不能为空`
}

export const length = (name, min, max, unit) => {
  unit =
    unit || (name === 'password' || name.indexOf('密码') > -1 ? '位' : '个字符')
  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    return v =>
      (v && v.length < max && v.length >= min) ||
      `${name} 必须在 ${min} - ${max} ${unit}之间`
  } else if (typeof max !== 'undefined') {
    return v => (v && v.length < max) || `${name}不能超过 ${max} ${unit}`
  }
  return v => (v && v.length >= min) || `${name}不能少于 ${min} ${unit}`
}
