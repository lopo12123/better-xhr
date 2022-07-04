/**
 * @description 运行 `task`, 失败自动重试最多 `max` 次
 * @param max 最大重试次数: 若`<1`则使用默认值`1`
 * @param task 任务: 返回类型为 Promise 的函数
 * @param args 任务的调用参数: 无参则传空数组 `[]`
 * @param immediate_condition 立即退出判断条件
 */
declare const do_retry_task: <Params extends any[] = any[], Response_1 = any>(max: number, task: (...args: Params) => Promise<Response_1>, args: Params, immediate_condition?: ((err: any) => boolean) | undefined) => Promise<Response_1>;
export { do_retry_task };
