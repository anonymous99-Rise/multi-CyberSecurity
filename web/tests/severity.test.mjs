import test from "node:test";
import assert from "node:assert/strict";
import { CSF_LABELS, SEVERITY_RAMP, severityBuckets, severityStep } from "../src/lib/severity.ts";

test("severityStep 分档边界（含上下界）", () => {
  const cases = [
    [0, "0-2"],
    [1, "0-2"],
    [2, "0-2"],
    [3, "3-4"],
    [4, "3-4"],
    [5, "5-7"],
    [7, "5-7"],
    [8, "8+"],
    [64, "8+"],
  ];
  for (const [score, label] of cases) {
    assert.equal(severityStep(score).label, label, `score=${score} 应落在 ${label}`);
  }
});

test("分档覆盖全部非负分数（不会返回 undefined）", () => {
  for (let score = 0; score <= 200; score += 1) {
    assert.ok(severityStep(score), `score=${score} 必须有分档`);
  }
});

test("severityBuckets 计数总和等于输入个数", () => {
  const scores = [0, 2, 3, 4, 5, 7, 8, 9, 10];
  const counts = severityBuckets(scores);
  assert.equal(counts.length, SEVERITY_RAMP.length);
  assert.equal(counts.reduce((a, b) => a + b, 0), scores.length);
  assert.deepEqual(counts, [2, 2, 2, 3]);
});

test("severityBuckets 空输入", () => {
  assert.deepEqual(severityBuckets([]), [0, 0, 0, 0]);
});

test("CSF_LABELS 覆盖 NIST 五大功能", () => {
  assert.deepEqual(Object.keys(CSF_LABELS).sort(), ["DE", "ID", "PR", "RC", "RS"]);
});
