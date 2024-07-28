export const getImageMimeType = (extension: string) => {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return 'unknown'
  }
}

export const getImageExtension = (imageUrl: string) => {
  const extension = imageUrl.substring(imageUrl.lastIndexOf('.') + 1)
  return extension
}
