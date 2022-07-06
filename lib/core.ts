/**
 * @description type of request
 */
export type RequestType = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

/**
 * @description 运行 `task`, 失败自动重试最多 `max` 次
 * @param max 最大重试次数: 若`<1`则使用默认值`1`
 * @param task 任务: 返回类型为 Promise 的函数
 * @param args 任务的调用参数: 无参则传空数组 `[]`
 * @param immediate_condition 立即退出判断条件
 */
const do_retry_task = <Params extends Array<any> = any[], Response = any>(
    max: number,
    task: (...args: Params) => Promise<Response>,
    args: Params,
    immediate_condition?: (err: any) => boolean) => {
    max = Math.max(max, 1)

    return new Promise<Response>((resolve, reject) => {
        const retry_closure = () => {
            task(...args)
                .then(resolve)
                .catch(err => {
                    if(max <= 0 || immediate_condition?.(err)) reject(err)
                    else {
                        max -= 1
                        retry_closure()
                    }
                })
        }
        retry_closure()
    })
}

export {
    do_retry_task
}