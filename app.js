import { pageData, docs, reviewDate, comparisons } from './content.js';
import { scenarios, samples, operationData, observationSamples } from './fixtures/scenarios.js';
import { icon, mini, node, arrow, flow, table, runbook, panel, tradeoffs, code, tabs, bindTabs, selectTab, refreshIcons, escape } from './modules/ui.js';
import { iot } from './modules/iot.js';
import { gaming } from './modules/gaming.js';
import { social } from './modules/social.js';

const registry = { iot, gaming, social };
const content = document.querySelector('#content');
const navigation = document.querySelector('#navigation');
const overlay = document.querySelector('#help-overlay');
const helpTrigger = document.querySelector('#help-trigger');
const shell = document.querySelector('.shell');
let currentRoute = '', currentModule = 'iot', cleanup = () => {}, opener;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function referenceList(keys) {
  return `<span>Sources · content reviewed ${reviewDate} · design updated 22 September 2026</span>${['overview', ...new Set(keys)].map(key => `<a href="${docs[key][1]}" target="_blank" rel="noreferrer">${escape(docs[key][0])}</a>`).join('')}`;
}
function comparison(name, title) { const data = comparisons[name]; return panel('Decision support', title, table(data.rows, data.headers)); }

function renderOverview() {
  const journeys = [
    ['availability', 'Foundation', 'Choose capacity and regional reach', 'Throughput', 'Placement'],
    ['recovery', 'Protect', 'Rehearse a usable recovery path', 'Continuity', 'Copies'],
    ['migration', 'Move', 'Validate a controlled data transition', 'Migrator', 'Cutover'],
    ['observability', 'Operate', 'Connect signals to customer impact', 'Metrics', 'Runbooks'],
    ['security', 'Govern', 'Define access and ownership boundaries', 'IAM', 'Encryption'],
    ['patterns', 'Apply', 'Follow device, player, and member stories', 'IoT', 'Gaming · Social']
  ];
  return panel('Service at a glance', 'Application data, managed at table level', `<div class="grid three-col">${mini('Flexible rows', 'Combine typed keys and columns with JSON document content.', 'Data model', 'teal')}${mini('Table throughput', 'Choose provisioned or on-demand read and write capacity.', 'Capacity', 'violet')}${mini('Regional reach', 'Evaluate Global Active Tables for local access across regions.', 'Placement', 'amber')}</div>`, 'Static customer walkthrough')
    + panel('Application architecture', 'Keep the application path easy to explain', flow([['users', 'People & devices', 'A customer interaction', 'amber'], ['app-window', 'Application + SDK', 'Identity, validation, retries', 'violet'], ['database', 'OCI NoSQL table', 'Keys, rows, JSON documents', 'teal']], ['Request', 'HTTPS · data access'], 'People and devices use an application which accesses OCI NoSQL through its SDK'))
    + `<section class="journey-grid" aria-label="Explore customer journeys">${journeys.map(([route, label, summary, a, b], i) => `<a class="journey-card" href="#${route === 'patterns' ? 'patterns/iot' : route}" aria-label="Open ${pageData[route].nav}"><span class="journey-number">0${i + 1}</span>${icon(pageData[route].icon, i === 4 ? 'violet' : 'teal')}<p>${label}</p><h3>${escape(pageData[route].nav)}</h3><span>${summary}</span><div><b>${a}</b><b>${b}</b><i data-lucide="arrow-up-right" aria-hidden="true"></i></div></a>`).join('')}</section>`
    + tradeoffs(['Focus on application data while Oracle operates the service infrastructure.', 'Choose a data and capacity model for each application need.'], ['Own key design, access, retries, and the business rules around data.', 'Verify workload behavior and regional requirements before production adoption.']);
}
function renderAvailability() {
  return panel('Availability architecture', 'Start regional. Add reach when it matters.', `<div class="region-layout"><article class="region-card">${icon('database', 'teal')}<p class="eyebrow">Region A</p><h4>Managed NoSQL table</h4><p>Oracle manages placement and redundant copies within the region.</p><div class="copy-nodes"><span>Managed copy</span><span>Managed copy</span></div></article><div class="region-link"><i data-lucide="arrow-left-right" aria-hidden="true"></i></div><article class="region-card">${icon('globe', 'violet')}<p class="eyebrow">Optional · Region B</p><h4>Global Active Table replica</h4><p>Local reads and writes with asynchronous regional replication.</p><div class="copy-nodes"><span>Managed copy</span><span>Managed copy</span></div></article></div><p class="section-copy">Conceptual layout; copy symbols do not specify replica count or placement. Use eligible regions, freeze the table schema, and design application routing and conflict handling before adding regional replicas.</p>`, 'Illustrative placement')
    + comparison('capacity', 'Choose the control that fits the workload')
    + panel('Application design', 'Throughput starts with the access pattern', `<div class="grid three-col">${mini('Distribute the keys', 'Choose shard keys around access and load distribution, then test representative hot-key behavior.', 'Model', 'teal')}${mini('Choose freshness', 'Use read consistency intentionally. Regional ABSOLUTE reads do not create global absolute consistency.', 'Read', 'violet')}${mini('Observe and adjust', 'Revisit capacity after examining consumption, throttling, and business latency.', 'Operate', 'amber')}</div>`);
}

function scenarioShell(keys, title) {
  return panel('Scenario explorer', title, `${tabs('scenario', keys.map(k => [k, scenarios[k].label]), keys[0], 'Walkthrough scenarios')}<div id="scenario-panel" role="tabpanel" aria-labelledby="scenario-${keys[0]}"></div>`, 'Presentation simulation');
}
function regionalDiagram(nodes, state) {
  return `<div class="regional-architecture" role="group" aria-label="Application routing to two stationary regional endpoints">${nodes[0]}<div class="client-routes"><div class="client-route ${state.broken ? 'interrupted' : !state.redirected ? 'selected' : ''}"><span class="route-line" aria-hidden="true"></span><span>${state.broken ? 'Connection interrupted · retry' : !state.redirected ? 'Selected application route' : 'Not selected by this application'}</span></div><div class="client-route ${state.redirected ? 'selected' : ''}"><span class="route-line" aria-hidden="true"></span><span>${state.redirected ? 'Selected application route' : 'Available alternative route'}</span></div></div><div class="replica-row">${nodes[1]}${nodes[2]}</div><div class="replica-exchange"><i data-lucide="arrow-left-right" aria-hidden="true"></i><span>Asynchronous regional replication${state.broken || (state.redirected && state.statuses[1].includes('Unreachable')) ? ' · connectivity disrupted in this scenario' : ' · reads and writes are local to each region'}</span></div></div>`;
}
function initScenarioDemo(keys) {
  const root = document.querySelector('[aria-label="Walkthrough scenarios"]');
  const target = document.querySelector('#scenario-panel');
  let key = keys[0], stage = 0, timer = null;
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const draw = () => {
    const data = scenarios[key], state = data.stages[stage];
    const diagramNodes = data.nodes.map((n, i) => node(n[0], n[1], state.statuses[i], n[3]).replace('flow-node ', `flow-node ${i === state.active ? 'is-active ' : ''}${(state.broken || (state.redirected && stage === 2)) && i === 1 ? 'is-unreachable ' : ''}`));
    target.innerHTML = `<div class="walkthrough" data-fixture="${data.id}" data-stage="${stage}"><div class="profile-copy"><h4>${escape(data.title)}</h4><p>${escape(data.summary)}</p></div><ol class="stage-list">${data.stages.map((s, i) => `<li class="${stage === i ? 'active' : ''}" ${stage === i ? 'aria-current="step"' : ''}><b>${i + 1}</b>${escape(s.title)}</li>`).join('')}</ol><div class="walk-diagram ${timer ? 'is-playing' : ''} ${state.broken ? 'is-broken' : ''}">${key === 'regional' ? regionalDiagram(diagramNodes, state) : `<div class="architecture-flow nosql-flow" role="group" aria-label="${escape(data.title)}: ${escape(state.title)}">${diagramNodes.map((n, i) => n + (data.edges[i] ? arrow(data.edges[i]) : '')).join('')}</div>`}${key === 'regional' ? `<div class="routing-note">Application route: ${state.broken ? 'Region A connection interrupted → retry / routing policy' : state.redirected ? 'Application → Region B endpoint' : 'Application → Region A endpoint'} · endpoint labels remain unchanged.</div>` : ''}</div><div class="stage-description" aria-live="polite"><p class="eyebrow">Step ${stage + 1} of ${data.stages.length}</p><h4>${escape(state.title)}</h4><p>${escape(state.text)}</p></div><div class="walk-controls"><button type="button" data-action="play"><i data-lucide="${timer ? 'pause' : 'play'}" aria-hidden="true"></i>${timer ? 'Pause' : 'Play'}</button><button type="button" data-action="next" ${stage === data.stages.length - 1 ? 'disabled' : ''}>Next step<i data-lucide="arrow-right" aria-hidden="true"></i></button><button type="button" data-action="reset"><i data-lucide="rotate-ccw" aria-hidden="true"></i>Reset</button><span>${reducedMotion.matches ? 'Reduced motion · manual steps remain available' : 'Illustrative sequence · no RPO or RTO implied'}</span></div>${runbook(data.runbook)}</div>`;
    target.querySelector('[data-action="play"]').addEventListener('click', () => {
      if (timer) stop(); else { if (stage === data.stages.length - 1) stage = 0; timer = setInterval(() => { stage++; if (stage === data.stages.length - 1) stop(); redraw('play'); }, 3600); }
      redraw('play');
    });
    target.querySelector('[data-action="next"]').addEventListener('click', () => { stop(); stage = Math.min(stage + 1, data.stages.length - 1); redraw(stage === data.stages.length - 1 ? 'reset' : 'next'); });
    target.querySelector('[data-action="reset"]').addEventListener('click', () => { stop(); stage = 0; redraw('reset'); });
    refreshIcons();
  };
  const redraw = action => { const hadFocus = target.contains(document.activeElement); draw(); if (hadFocus) target.querySelector(`[data-action="${action}"]`)?.focus({ preventScroll: true }); };
  const select = next => { stop(); key = next; stage = 0; selectTab(root, key); target.setAttribute('aria-labelledby', `scenario-${key}`); draw(); };
  const motionChanged = () => { if (reducedMotion.matches) { stop(); draw(); } };
  reducedMotion.addEventListener('change', motionChanged);
  bindTabs(root, select); select(key);
  return () => { stop(); reducedMotion.removeEventListener('change', motionChanged); };
}
function renderRecovery() {
  return scenarioShell(['regional', 'export'], 'Match the recovery path to the failure') + comparison('recovery', 'Availability and recoverability answer different questions')
    + tradeoffs(['Regional replicas provide another application access location.', 'A retained export creates a recovery input separate from the working table.'], ['Replication also propagates unwanted data changes; it is not a historical backup.', 'Recovery depends on capture context, application routing, and rehearsal. No fixed RPO/RTO is claimed.']);
}
function renderMigration() {
  return scenarioShell(['file', 'onprem', 'phased'], 'Prove the destination before moving the customer') + comparison('migration', 'Choose a migration boundary you can validate')
    + panel('Import & export examples', 'Review configuration before running the tool', `<p class="section-copy">Install Oracle NoSQL Database Migrator and its supported Java runtime. Generate the source/sink configuration interactively with <code>./runMigrator</code>, inspect it, and answer <strong>n</strong> at the execution prompt until ready. Choose an approved source, local credentials or supported principal authentication, a retained file destination, and an empty non-production target.</p><div class="code-samples">${code('Bash · export', samples.export, 'Prerequisite: reviewed export-demo.json with cloud source and file sink. Reads table data, consumes read capacity, and writes files.')}${code('Bash · import', samples.import, 'Prerequisite: reviewed import-demo.json with file source and cloud sink. Writes rows and can create tables if configured; consumes capacity and may incur cost.')}</div><p class="section-copy sample-note">The named configuration files are placeholders to generate and review locally, not supplied credentials or executable showcase controls. Schema, indexes, permissions, expiry, and application compatibility must be checked independently.</p>`)
    + panel('Synthetic transfer fixture', 'Check that the sample input matches the outcome', `<div class="code-samples">${code('JSON · two source records', samples.records.map(r => JSON.stringify(r)).join('\n'), 'Two synthetic rows; the File import walkthrough ends with two validated target rows.')}${code('SQL · schema example', samples.ddl, 'Illustrative target DDL. Creating this table separately requires IAM and capacity configuration; nothing executes here.')}</div>`);
}
function renderObservability() {
  return panel('Operating loop', 'Detect, investigate, then improve', `${tabs('operations', [['detect', 'Detect'], ['investigate', 'Investigate'], ['improve', 'Improve']], 'detect', 'Operations scenarios')}<div id="operations-panel" role="tabpanel" aria-labelledby="operations-detect"></div>`)
    + panel('Illustrative chart · not telemetry', 'Read demand across six example windows', `<p class="section-copy">Synthetic ReadUnits consumed in six equal one-minute windows. This is an illustration of windowed consumption, not a live rate, benchmark, or capacity recommendation.</p><div class="bars" role="img" aria-label="Synthetic read units consumed: 20, 35, 65, 90, 55, 30 across six one-minute windows">${observationSamples.values.map(v => `<div style="height:${v}%"><span>${v}</span></div>`).join('')}</div><div class="chart-labels"><span>Window 1</span><span>Window 6</span></div>`)
    + panel('Evidence boundaries', 'Use each signal for the question it can answer', table([['Service metrics', 'Demand, storage, throttling, and applicable replica lag', 'Keep namespace, dimensions, window, and statistic visible.'], ['Application logs & traces', 'Business latency, request failures, retries, correlation IDs', 'Instrument the application; avoid sensitive payloads.'], ['OCI Audit', 'Supported OCI API activity', 'Do not present it as every row read or a complete business audit.'], ['Alarms & notifications', 'A configured signal condition and notification route', 'Test detection and delivery; no alert feed is connected here.']], ['Evidence', 'Useful for', 'Boundary']));
}
function initOperationsDemo() {
  const root = document.querySelector('[aria-label="Operations scenarios"]'), target = document.querySelector('#operations-panel');
  const select = key => {
    const data = operationData[key]; selectTab(root, key); target.setAttribute('aria-labelledby', `operations-${key}`);
    target.innerHTML = `<div class="profile-copy"><h4>${data.title}</h4><p>${data.summary}</p></div>${flow([['activity', 'Observe', 'Customer and table signals', 'teal'], ['search', 'Investigate', 'Evidence and context', 'violet'], ['check-check', 'Improve', 'Validate the outcome', 'green']], ['Correlate', 'Test a change'], 'Operational decisions connect observation to investigation and improvement')}<div class="signal-cards">${data.signals.map(([title, text, symbol]) => `<article class="signal-card">${icon(symbol, 'teal')}<h4>${title}</h4><p>${text}</p></article>`).join('')}</div>${runbook(data.steps)}`; refreshIcons();
  };
  bindTabs(root, select); select('detect');
}
function renderSecurity() {
  const layers = [['key-round', 'Identity & authorization', 'Authenticate the application and scope table operations through IAM.'], ['network', 'Connectivity & transport', 'Use the correct regional endpoint, HTTPS, and a validated network path.'], ['lock-keyhole', 'Stored data & key ownership', 'Use service encryption; evaluate dedicated-environment CMEK when required.'], ['clipboard-check', 'Lifecycle & evidence', 'Define retention, expiry, application auditing, and operational ownership.']];
  return panel('Control architecture', 'Build the boundary in layers', `<div class="security-layers">${layers.map(([symbol, title, text], i) => `<article class="security-layer"><span>0${i + 1}</span>${icon(symbol)}<div><h4>${title}</h4><p>${text}</p></div></article>`).join('')}</div>`) + comparison('security', 'Assign an owner to every control')
    + tradeoffs(['Use scoped IAM policies for repeatable application access.', 'Combine service encryption with explicit data governance.'], ['Validate supported features and regional connectivity for the actual deployment.', 'Customer-managed keys add lifecycle responsibilities; dedicated environments currently exclude Global Active Tables.']);
}

function renderPatterns() {
  return `${panel('Application stories', 'Choose a customer conversation', `${tabs('workload', Object.entries(registry).map(([id, m]) => [id, m.label]), currentModule, 'Workload patterns')}<p class="section-copy" id="workload-summary">${registry[currentModule].summary}</p>`)}<div id="workload-panel" role="tabpanel" aria-labelledby="workload-${currentModule}" class="content-view workload-content"></div>`;
}
Object.assign(pageData.overview, { render: renderOverview });
Object.assign(pageData.availability, { render: renderAvailability });
Object.assign(pageData.recovery, { render: renderRecovery });
Object.assign(pageData.migration, { render: renderMigration });
Object.assign(pageData.observability, { render: renderObservability });
Object.assign(pageData.security, { render: renderSecurity });
Object.assign(pageData.patterns, { render: renderPatterns });

function mountWorkload() {
  const module = registry[currentModule], target = document.querySelector('#workload-panel');
  selectTab(document.querySelector('[aria-label="Workload patterns"]'), currentModule);
  target.setAttribute('aria-labelledby', `workload-${currentModule}`);
  document.querySelector('#workload-summary').textContent = module.summary;
  target.innerHTML = module.render(); module.init(); updateReferences(); refreshIcons();
}
function updateReferences() { document.querySelector('#page-references').innerHTML = referenceList(currentRoute === 'patterns' ? registry[currentModule].references : pageData[currentRoute].references); }
function parseRoute() {
  let hash = location.hash.slice(1) || 'overview';
  const aliases = { portfolio: 'overview', iot: 'patterns/iot', gaming: 'patterns/gaming', social: 'patterns/social', workloads: 'patterns/iot' };
  hash = aliases[hash] || hash;
  const parts = hash.split('/');
  if (parts[0] === 'patterns') hash = `patterns/${Object.hasOwn(registry, parts[1]) ? parts[1] : 'iot'}`;
  else if (!Object.hasOwn(pageData, hash)) hash = 'overview';
  if (location.hash !== `#${hash}`) history.replaceState(null, '', `#${hash}`);
  return hash.split('/');
}
function renderPage() {
  if (location.hash === '#main') { document.querySelector('#main').focus(); return; }
  const [route, module = 'iot'] = parseRoute();
  closeHelp(false);
  if (route === 'patterns' && currentRoute === 'patterns') { currentModule = module; mountWorkload(); return; }
  cleanup(); cleanup = () => {}; currentRoute = route; currentModule = module;
  const page = pageData[route];
  for (const [id, value] of [['page-title', page.title], ['page-eyebrow', page.eyebrow], ['hero-pill', page.pill], ['hero-title', page.heroTitle], ['hero-summary', page.summary]]) document.getElementById(id).textContent = value;
  document.title = `${page.nav} · OCI NoSQL Showcase`;
  navigation.querySelectorAll('[data-route]').forEach(a => { const active = a.dataset.route === route; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  content.innerHTML = page.render();
  if (route === 'recovery') cleanup = initScenarioDemo(['regional', 'export']);
  if (route === 'migration') cleanup = initScenarioDemo(['file', 'onprem', 'phased']);
  if (route === 'observability') initOperationsDemo();
  if (route === 'patterns') { bindTabs(document.querySelector('[aria-label="Workload patterns"]'), key => { location.hash = `patterns/${key}`; }); mountWorkload(); }
  updateReferences(); refreshIcons(); window.scrollTo({ top: 0, behavior: 'instant' });
}
function openHelp() {
  const page = pageData[currentRoute], module = currentRoute === 'patterns' ? registry[currentModule] : null;
  opener = document.activeElement; document.querySelector('#help-title').textContent = `${module?.label || page.nav} · definitions & boundaries`;
  document.querySelector('#help-body').innerHTML = `<p class="help-intro">Oracle NoSQL Database Cloud Service · customer conversation notes.</p>${[...page.help, ...(module?.help || [])].map(([term, text]) => `<article class="help-item"><h3>${escape(term)}</h3><p>${escape(text)}</p></article>`).join('')}<div class="references">${referenceList(module?.references || page.references)}</div>`;
  overlay.hidden = false; shell.inert = true; document.body.style.overflow = 'hidden'; helpTrigger.setAttribute('aria-expanded', 'true'); document.querySelector('#help-close').focus();
}
function closeHelp(restore = true) { if (overlay.hidden) return; overlay.hidden = true; shell.inert = false; document.body.style.overflow = ''; helpTrigger.setAttribute('aria-expanded', 'false'); if (restore) opener?.focus(); }
navigation.innerHTML = Object.entries(pageData).map(([route, page]) => `<a class="nav-button" href="#${route === 'patterns' ? 'patterns/iot' : route}" data-route="${route}"><i data-lucide="${page.icon}" aria-hidden="true"></i><span>${page.nav}</span></a>`).join('');
document.querySelector('.sidebar').insertAdjacentHTML('beforeend', '<div class="static-note"><strong>Explore. Explain. Decide.</strong>Illustrative scenarios · no cloud connection<br>Oracle NoSQL Database Cloud Service</div>');
helpTrigger.addEventListener('click', openHelp);
document.querySelector('#help-close').addEventListener('click', () => closeHelp());
overlay.addEventListener('click', event => { if (event.target === overlay) closeHelp(); });
document.addEventListener('keydown', event => {
  if (overlay.hidden) return;
  if (event.key === 'Escape') { event.preventDefault(); closeHelp(); }
  if (event.key === 'Tab') {
    const items = [...overlay.querySelectorAll('button, a[href]')]; const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); document.querySelector('#main').focus(); document.querySelector('#main').scrollIntoView({ behavior: 'instant' }); });
window.addEventListener('hashchange', renderPage);
window.addEventListener('pagehide', () => cleanup());
renderPage();


