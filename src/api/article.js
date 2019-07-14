import request from '@/utils/request'

export const getArticles = ({
  channelId, // 频道
  timestamp, // 时间戳
  withTop // 是否包含置顶 1包含 0不包含
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

// 不感兴趣
export const dislickArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/artice/dislikes',
    data: {
      target: articleId
    }
  })
}
