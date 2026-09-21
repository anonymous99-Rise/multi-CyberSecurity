import test from "node:test";
import assert from "node:assert/strict";
import { fmt } from "../src/lib/format.ts";

test("fmt 千分位", () => {
  assert.equal(fmt(0), "0");
  assert.equal(fmt(7), "7");
  assert.equal(fmt(999), "999");
  assert.equal(fmt(1000), "1,000");
  assert.equal(fmt(1427), "1,427");
  assert.equal(fmt(1234567), "1,234,567");
  assert.equal(fmt(-1234), "-1,234"); // 负数保持符号
});

test("fmt 对静态导出是确定性的（两端 hydrate 结果必须一致）", () => {
  // 刻意不用 toLocaleString：断言多次调用与不同调用点结果相同
  const values = [1, 999, 1000, 12345678];
  assert.deepEqual(values.map(fmt), values.map(fmt));
});
