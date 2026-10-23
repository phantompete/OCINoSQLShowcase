/* Original section narratives composed with V2 panel, table and navigation primitives. */
(() => {
 const S=window.SERVICE;
 const comparisons={"capacity":{"headers":["Choice","Best fit","What you control","Consideration"],"rows":[["Provisioned tables","Demand you can estimate and review","Read Units, Write Units, and storage","Monitor throttling and revise allocations as usage changes."],["On-demand tables","Variable or initially uncertain demand","Storage, data design, application behavior","Automatic throughput management does not remove service limits or cost review."],["Global Active Tables","Local access in multiple regions or regional continuity","Replica placement and application routing","Asynchronous convergence, frozen schema, and conflict behavior must fit the workload."],["Dedicated hosted environment","Tenancy isolation or unusually demanding capacity","A separately requested dedicated environment","Evaluate commercial terms and readiness with Oracle; Global Active Tables are currently unsupported."]]},"recovery":{"headers":["Pattern","Recovery-point posture","Recovery-time posture","Best fit / operator action"],"rows":[["Regional redundancy","Managed in-region data copies","Managed service response; application retries still matter","Local infrastructure faults; observe application results."],["Global Active Tables","Remote state may lag recent writes","Depends on detection, routing, reconnection, and validation","Regional disruption; prepare replicas and redirect application traffic."],["Customer-retained export","Depends on the selected capture and source-write coordination","Depends on import volume, capacity, and validation","Unwanted changes or a recovery rehearsal; select files, import, verify, then route."]]},"migration":{"headers":["Path","Useful when","Prerequisites","Cutover responsibility"],"rows":[["File import","A reviewed data set exists in a supported format","Mapped keys/types, reviewed configuration, empty target","Validate imported data and update application routing."],["Oracle NoSQL source","Moving existing NoSQL tables to the cloud","Accessible source, IAM, cloud compatibility review","Coordinate concurrent changes and reconcile the transfer."],["Phased application adoption","A workload can move independently","Explicit write ownership and application routing","Customer-designed rollout and rollback; not automatic CDC."]]},"security":{"headers":["Control","Protection","Customer responsibility","Consideration"],"rows":[["IAM and compartments","Scoped access to tables and operations","Define principals and least-privilege policies","Separate inspect, read, and write/manage permissions."],["HTTPS and network path","Encrypted transport to the service","Configure endpoint, routes, egress, and client trust","Validate service-gateway eligibility and regional connectivity."],["Encryption at rest","Stored data encryption managed by the service","Select the supported key ownership model","CMEK needs a specifically enabled dedicated environment."],["Data lifecycle and evidence","Retention policy and traceable supported API activity","Set expiry/retention; retain application evidence","Expiry is not archival; Audit is not a complete data-access log."]]}};
 function create(h){
  const {samples,observationSamples,operationData}=window.FIRST_ITERATION;
  const {escape}=h;
  const panel=(eyebrow,title,body,badge='')=>h.panel(title,body,'',eyebrow,badge);
  const icon=(name,tone='teal')=>h.iconTile(name,tone);
  const mini=(title,copy,tag)=>'<div><span class="capability-tag">'+escape(tag)+'</span><h3>'+escape(title)+'</h3><p>'+escape(copy)+'</p></div>';
  const table=(rows,headers)=>h.table(headers,rows);
  const flow=(nodes,edges,description)=>'<div class="diagram" role="group" aria-label="'+escape(description)+'">'+h.flow(nodes.map(([icon,title,detail,tone])=>[title,detail,icon,tone==='green'?'teal':tone]),-1,edges)+'</div>';
  const code=(label,text,prerequisites)=>h.code({label,text,prerequisites});
  const tradeoffs=(benefits,considerations)=>h.tradeoffs({benefits,considerations});
  const runbook=rows=>h.runbook(rows);
  const tabs=(id,items,selected,label)=>h.tabs(id,items,selected).replace('aria-label="'+id+'"','aria-label="'+escape(label)+'"');
  const bindTabs=(root,select)=>h.bindTabs(root.parentElement,root.getAttribute('aria-label'),select);
  const selectTab=(root,key)=>root.querySelectorAll('[role=tab]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.value===key));b.tabIndex=b.dataset.value===key?0:-1;});
  const refreshIcons=h.icons;
  const comparison=(name,title)=>panel('Decision support',title,table(comparisons[name].rows,comparisons[name].headers));
  const scenarioShell=(keys,title)=>{const owner=keys[0]==='regional'?'recovery':'migration';return panel('Scenario explorer',title,h.tabs('scenario',keys.map(key=>[key,S.pages[owner].scenarios[key].label]),keys[0])+'<div id="scenario-panel" role="tabpanel"></div>','Presentation simulation');};
function renderAvailability() {
  return panel('Availability architecture', 'Start regional. Add reach when it matters.', `<div class="region-layout"><article class="region-card">${icon('database', 'teal')}<p class="eyebrow">Region A</p><h4>Managed NoSQL table</h4><p>Oracle manages placement and redundant copies within the region.</p><div class="copy-nodes"><span>Managed copy</span><span>Managed copy</span></div></article><div class="region-link"><i data-lucide="arrow-left-right" aria-hidden="true"></i></div><article class="region-card">${icon('globe', 'violet')}<p class="eyebrow">Optional · Region B</p><h4>Global Active Table replica</h4><p>Local reads and writes with asynchronous regional replication.</p><div class="copy-nodes"><span>Managed copy</span><span>Managed copy</span></div></article></div><p class="section-copy">Conceptual layout; copy symbols do not specify replica count or placement. Use eligible regions, freeze the table schema, and design application routing and conflict handling before adding regional replicas.</p>`, 'Illustrative placement')
    + comparison('capacity', 'Choose the control that fits the workload')
    + panel('Application design', 'Throughput starts with the access pattern', `<div class="grid three-col">${mini('Distribute the keys', 'Choose shard keys around access and load distribution, then test representative hot-key behavior.', 'Model', 'teal')}${mini('Choose freshness', 'Use read consistency intentionally. Regional ABSOLUTE reads do not create global absolute consistency.', 'Read', 'violet')}${mini('Observe and adjust', 'Revisit capacity after examining consumption, throttling, and business latency.', 'Operate', 'amber')}</div>`);
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


 return {renderAvailability,renderRecovery,renderMigration,renderObservability,initOperationsDemo,renderSecurity};
 }
 for(const key of ['availability','recovery','migration','observability','security']){
  const name='render'+key[0].toUpperCase()+key.slice(1);
  S.renderers[key]=(m,h)=>create(h)[name]();
  S.initializers[key]=(m,h)=>key==='recovery'||key==='migration'?h.initScenarios(m):key==='observability'?(create(h).initOperationsDemo(),()=>{}):()=>{};
 }
 window.NOSQL_SECTIONS={
  consistency(h){return h.panel('Choose read freshness for the action',h.tabs('consistency',[['eventual','EVENTUAL'],['absolute','ABSOLUTE']],'eventual')+'<p id="consistency-panel" role="tabpanel" aria-labelledby="consistency-eventual" class="note"></p>','','Independent decision','');},
  initConsistency(h){const target=document.querySelector('#consistency-panel');const select=key=>{target.setAttribute('aria-labelledby','consistency-'+key);target.textContent=key==='absolute'?'ABSOLUTE: current value in the region being read; twice the read units for the same data. Does not wait for every remote region to converge.':'EVENTUAL: an older value may be returned. Use when the application can tolerate this freshness tradeoff.';};h.bindTabs(document.querySelector('main'),'consistency',select);select('eventual');}
 };
})();
