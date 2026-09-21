/**
 * 数据层入口：`@/lib/data`。
 *
 * 目录划分（重构自原先单文件 data.ts）：
 *   types.ts      纯类型定义
 *   datasets.ts   JSON 数据引入与定型
 *   config.ts     静态配置（平台、破限等级、合规分组）
 *   selectors.ts  派生统计与筛选
 *
 * 页面按需导入即可，路径不变（仍是 `@/lib/data`）。
 */
export * from "./types";
export * from "./datasets";
export * from "./config";
export * from "./selectors";
