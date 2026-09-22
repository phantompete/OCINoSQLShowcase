import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, workloads, samples } from '../fixtures/scenarios.js';
import { pageData, docs } from '../content.js';
import { escape } from '../modules/ui.js';
import { createShowcaseServer } from '../server.mjs';

test('every fixture has coherent stages and deterministic reset state', () => {
  const ids = new Set();
  for (const fixture of Object.values(scenarios)) {
    assert(!ids.has(fixture.id)); ids.add(fixture.id);
    assert.equal(fixture.defaultStage, 0); assert(fixture.illustrative);
    assert(fixture.stages.length >= 4); assert(docs[fixture.source]);
    for (const stage of fixture.stages) { assert.equal(stage.statuses.length, fixture.nodes.length); assert(stage.active >= 0 && stage.active < fixture.nodes.length); assert(stage.text); }
  }
  assert.equal(samples.records.length, 2);
  assert.match(scenarios.file.stages.at(-1).statuses.at(-1), /^2 validated rows$/);
});
test('workload defaults, scenarios and source links are complete', () => {
  for (const fixture of Object.values(workloads)) {
    assert(fixture[fixture.default]);
    for (const [key] of fixture.options) { assert(fixture[key].output); assert(fixture[key].result); assert.equal(fixture[key].nodes.length, 3); }
  }
  for (const page of Object.values(pageData)) {
    const count = page.heroTitle.split(/\s+/).length;
    assert(count >= 5 && count <= 8, `${page.nav}: ${count} hero words`);
    page.references.forEach(key => assert(docs[key]));
  }
});
test('samples escape active HTML instead of injecting markup', () => {
  assert.equal(escape('<script>"x"&\'y\'</script>'), '&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;');
});
test('static server bounds public files and survives malformed requests', async () => {
  const server = createShowcaseServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/', '/app.js', '/modules/ui.js', '/fixtures/scenarios.js', '/assets/lucide.min.js']) assert.equal((await fetch(base + path)).status, 200, path);
    for (const path of ['/SERVICE_BRIEF.md', '/.env', '/docs/baseline/checksums.json', '/api/tables', '/%2e%2e%2fpackage.json']) assert.equal((await fetch(base + path)).status, 404, path);
    assert.equal((await fetch(base + '/%ZZ')).status, 400);
    assert.equal((await fetch(base, { method: 'POST' })).status, 405);
    assert.equal((await fetch(base)).status, 200);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
