export const formatDate = (date: string) =>
  new Date(date).toLocaleString('zh-CN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
