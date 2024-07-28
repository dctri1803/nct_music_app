export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60000)
  const seconds = (time % 60000) / 1000
  return `${minutes}:${seconds <= 9.5 ? '0' : ''}${seconds.toFixed(0)}`
}
