export const getMentionsForSlug = async (slug: string) => {
  console.log('333333333')

  const webmentions = await fetch(`https://webmention.io/api/mentions?target=https://giscafer.com/blog/${slug}&per-page=10000`)
  const mentions = await webmentions.json()
  const numberOfmentions = mentions?.links?.length

  return numberOfmentions > 0 ? numberOfmentions : 0
}
