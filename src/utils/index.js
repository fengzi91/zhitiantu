export const computedSize = (size, showBytes = false) => {
  const aMultiples = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const nBytes = size
  let showSize = ''
  for (
    let nMultiple = 0, nApprox = nBytes / 1024;
    nApprox > 1;
    nApprox /= 1024, nMultiple++
  ) {
    showSize =
      nApprox.toFixed(3) +
      ' ' +
      aMultiples[nMultiple] +
      (showBytes ? ' (' + nBytes + ' bytes)' : '')
  }
  return showSize
}

export const generatorPassword = size => {
  const str = 'ABCDEFGHGKLMNPQRSTUVWXYZabcdefghigkmnpqrstuvwxyz0123456789'
  const array = str.split('')
  let result = ''
  for (let i = 0; i < size; i++) {
    result += array[parseInt(Math.random() * str.length)]
  }
  return result
}
