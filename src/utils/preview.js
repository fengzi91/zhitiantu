// 图片位置辅助
import vuetify from '@/plugins/vuetify'
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
  const scaleX = newWidth / originWidth
  const scaleY = newHeight / originHeight
  return {
    translateX,
    translateY,
    scaleX,
    scaleY,
  }
}
/**
 * 获取当前正在显示的图片缩小后 滚动条的变化值
 *
 * @return {Number} > 0 向下滚动， < 0 向上滚动 0 不变
 */
export const getCurrentShowImageScrollTop = (
  initSection,
  initItem,
  currentSection,
  currentItem,
  initScrollTop
) => {
  const initTop = initSection.top + initItem.top
  const currentTop = currentSection.top + currentItem.top
  // const maxScrollTop = initScrollTop
  const globalTop = 76
  const windowHeight = vuetify.framework.breakpoint.height
  if (initTop > currentTop) {
    // 往上翻页
    console.log('往上翻', initScrollTop)
    // 滚动距离越少越好
    return parseInt(initItem.rect.top - globalTop) >=
      parseInt(initTop - currentTop)
      ? 0
      : parseInt(initItem.rect.top - globalTop) - parseInt(initTop - currentTop) //-(currentItem.height - (initTop - initScrollTop - globalTop))
  } else if (initTop < currentTop) {
    console.log('往下翻')
    // 向下滚动了, 判断正在显示的图片是否还在缓存的窗口内，是 不操作滚动条， 增加 newTop - initTop
    return parseInt(currentTop - initTop + currentItem.height) <=
      parseInt(windowHeight - initItem.rect.top)
      ? 0
      : parseInt(currentTop - initTop + currentItem.height) -
          parseInt(windowHeight - initItem.rect.top) // currentTop - initTop
  }
  return 0
}
/**
 * 用于返回时 缩小图片到指定位置
 * @param initRect DOMRect
 * @param initSection
 * @param initItem 正在显示的元素
 * @param currentSection
 * @param currentItem 即将显示的元素
 * @param initScrollTop
 * @param scrollTopChanged
 */
export const getSmallImagePosition = (
  initRect,
  initSection,
  initItem,
  currentSection,
  currentItem,
  initScrollTop,
  scrollTopChanged
) => {
  let positionTop
  const positionLeft = initRect.left - initItem.left + currentItem.left
  // 整体上下位置 需要滚动
  const scrollTop =
    typeof scrollTopChanged === 'undefined'
      ? getCurrentShowImageScrollTop(
          initSection,
          initItem,
          currentSection,
          currentItem,
          initScrollTop
        )
      : scrollTopChanged
  // const windowHeight = vuetify.framework.breakpoint.height
  const initTop = initSection.top + initItem.top
  const currentTop = currentSection.top + currentItem.top
  console.log('滚多少', scrollTop)
  if (scrollTop === 0) {
    // 滚动条不变，按原来的位置显示
    positionTop =
      initTop >= currentTop
        ? initRect.top - (initTop - currentTop)
        : initRect.top + (currentTop - initTop)
  } else {
    positionTop =
      initTop === currentTop
        ? initRect.top
        : initTop > currentTop
        ? initRect.top + scrollTop < 0
          ? 76
          : initRect.top + scrollTop
        : initRect.top + (currentTop - initTop) - scrollTop
  }
  return {
    top: positionTop,
    left: positionLeft,
    width: currentItem.width,
    height: currentItem.height,
  }
}
/**
 * 获取展示的大图的最终样式 top left width height
 * @param {Object} currentItem
 * @param {Number} windowWidth
 * @param {Number} windowHeight
 * @param {Object} previewOffset
 * @param {Element} dom
 *
 * @return {Object}
 */
export const getPreviewImageStyle = (
  currentItem,
  windowWidth,
  windowHeight,
  previewOffset,
  dom
) => {
  if (typeof dom === 'object' && dom !== null) {
    return dom.getBoundingClientRect()
  }
  previewOffset =
    typeof previewOffset === 'undefined'
      ? { top: 20, left: 20, right: 20, bottom: 20 }
      : previewOffset
  const containerHeight =
    windowHeight - previewOffset.top - previewOffset.bottom
  const containerWidth = windowWidth - previewOffset.left - previewOffset.right
  let ratio = 1
  if (
    containerWidth >= currentItem._width &&
    containerHeight >= currentItem._width
  ) {
    ratio = 1
  } else if (
    currentItem._width / containerWidth >
    currentItem._height / containerHeight
  ) {
    ratio = currentItem._width / containerWidth
  } else {
    ratio = currentItem._height / containerHeight
  }
  const width = currentItem._width / ratio
  const height = currentItem._height / ratio
  const top = previewOffset.top + (containerHeight - height) / 2
  const left = previewOffset.left + (containerWidth - width) / 2
  return {
    top,
    left,
    width,
    height,
  }
}
// 获取由大图转为小图的样式
export const getTransformToSmall = () => {}
