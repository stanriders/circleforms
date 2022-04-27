export default function getImage({
  id,
  banner,
  icon,
  type = 'banner'
}) {
  if (!id) {
    throw new Error('getImage: id is required')
  }

  if (type === 'icon') {
    if (!icon) {
      return `/images/form-entry-test-thumbnail.png`
    }

    return `https://assets.circleforms.net/${id}/${icon}`
  }

  if (type === 'banner') {
    if (!banner) {
      return `/images/form-entry-test.jpg`
    }

    return `https://assets.circleforms.net/${id}/${banner}`
  }
}