import justifiedLayout from 'justified-layout'
export default (data, containerWidth, top = 10) => {
  return justifiedLayout(data, {
    targetRowHeight: 180,
    containerWidth,
    showWidows: false,
    containerPadding: {
      top,
      right: 12,
      bottom: 10,
      left: 12,
    },
  })
}
