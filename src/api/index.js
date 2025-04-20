import request from '@/utils/request'

// 保存订单信息
export function saveOrder(orderData) {
  return request({
    url: '/order/submit',
    method: 'post',
    data: orderData
  })
}