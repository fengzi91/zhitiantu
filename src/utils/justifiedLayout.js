import justifiedLayout from 'justified-layout'
export default (
  data,
  containerWidth,
  top = 10,
  left = 12,
  right = 12,
  bottom = 10,
  targetRowHeight = 180
) => {
  return justifiedLayout(data, {
    targetRowHeight,
    containerWidth,
    showWidows: false,
    containerPadding: {
      top,
      right,
      bottom,
      left,
    },
  })
}
