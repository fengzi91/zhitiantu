// 图片位置辅助
import vuetify from '@/plugins/vuetify'
export const position = (width, height) => {
  const windowWidth = vuetify.framework.breakpoint.width - 20
  const windowHeight = vuetify.framework.breakpoint.height - 20
  // 计算图片缩放比例
  let aspectRatio =
    width / windowWidth > height / windowHeight
      ? width / windowWidth
      : height / windowHeight
  return {
    width: width / aspectRatio,
    height: height / aspectRatio,
  }
}
/**
 * 缩放比例
 * @param {number} originWidth
 * @param {number} originHeight
 * @param {number} windowWidth
 * @param {number} windowHeight
 * @param {object} previewOffset 四个边的边距
 * @returns {number}
 */
export const aspectRatio = (
  originWidth,
  originHeight,
  windowWidth,
  windowHeight,
  previewOffset = { top: 20, left: 20, right: 20, bottom: 20 }
) => {
  const containerWidth = windowWidth - previewOffset.left - previewOffset.right
  const containerHeight =
    windowHeight - previewOffset.top - previewOffset.bottom
  // return originWidth / containerWidth > originHeight / containerHeight
  //   ? originWidth / containerWidth
  //   : originHeight / containerHeight
  const ratioX = containerWidth / originWidth
  const ratioY = containerHeight / originHeight
  if (originHeight <= containerHeight && originWidth <= containerWidth) {
    return 1
  } else if (ratioX < ratioY) {
    // 无法完整放入
    return ratioX
  } else {
    return ratioY
  }
}
/**
 *  计算图片变换
 * @param width 图片正在显示的宽度
 * @param height 图片正在显示的高度
 * @param originWidth 图片实际宽度
 * @param originHeight 图片实际高度
 * @param windowWidth 实际显示区块宽度
 * @param windowHeight 实际显示区块高度
 * @param rect 当前所在位置信息 document.get
 * @param previewOffset 相对于窗口四边留白尺寸
 */
export const computedPosition = (
  width,
  height,
  originWidth,
  originHeight,
  windowWidth,
  windowHeight,
  rect,
  previewOffset = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    width: 0,
    height: 0,
  }
) => {
  const ratio = aspectRatio(
    originWidth,
    originHeight,
    windowWidth,
    windowHeight,
    previewOffset
  )
  // eslint-disable-next-line no-undef
  console.log(
    '传入的参数：',
    ratio,
    'width-> ',
    width,
    'height->',
    height,
    'ww->',
    windowWidth,
    'wh->',
    windowHeight,
    rect,
    originWidth,
    originHeight
  )
  const positionY =
    previewOffset.top +
    (windowHeight - previewOffset.top - previewOffset.bottom) / 2
  const positionX =
    previewOffset.left +
    (windowWidth - previewOffset.left - previewOffset.right) / 2
  // 要进行的移动
  const translateX = positionX - (rect.left + width / 2) + rect.left
  const translateY = positionY - (rect.top + height / 2) + rect.top
  // 缩放
  const scaleY = (ratio * originHeight) / height
  const scaleX = (ratio * originWidth) / width
  return {
    translateX,
    translateY,
    scaleX,
    scaleY,
  }
}
/**
 * 计算变换属性
 * @param originWidth 原始宽度
 * @param originHeight 原始高度
 * @param originTop 原始 top 相对于窗口
 * @param originLeft 原始 left 相对于窗口
 * @param newWidth 新的宽度
 * @param newHeight 新的高度
 * @param newTop 新的 top
 * @param newLeft 新的 left
 */
export const computedTransform = (
  originWidth,
  originHeight,
  originTop,
  originLeft,
  newWidth,
  newHeight,
  newTop,
  newLeft
) => {
  const translateX = newLeft - originLeft + (newWidth - originWidth) / 2
  const translateY = newTop - originTop + (newHeight - originHeight) / 2
  const scaleX = originWidth / newWidth
  const scaleY = originHeight / newHeight
  return {
    translateX,
    translateY,
    scaleX,
    scaleY,
  }
}
