import { flow, code, tradeoffs, escape, tabs, bindTabs, selectTab, refreshIcons } from './ui.js';
export function renderWorkload(fixture, title) {
  return `<section class="scenario-panel workload-panel" data-fixture="${fixture.id}"><div class="panel-heading"><div><p class="eyebrow">Application story · illustrative</p><h3>${escape(title)}</h3></div><span class="tag">Synthetic data</span></div>${tabs('story', fixture.options, fixture.default, `${title} scenarios`)}<div id="story-panel" role="tabpanel" aria-labelledby="story-${fixture.default}"></div></section>`;
}
export function initWorkload(fixture, benefits, considerations, extra = '') {
  const root = document.querySelector('.workload-panel');
  const controls = root.querySelector('[role="tablist"]');
  const target = root.querySelector('#story-panel');
  function select(key) {
    const data = fixture[key];
    selectTab(controls, key); target.setAttribute('aria-labelledby', `story-${key}`);
    target.innerHTML = `<div class="profile-copy"><h4>${escape(data.title)}</h4><p>${escape(data.summary)}</p></div>${flow(data.nodes, data.edges, data.title)}<p class="result-note">${escape(data.result)}</p>${code('JSON · illustrative outcome', JSON.stringify(data.output, null, 2), 'Synthetic fixture. This is not a response from OCI.')}`;
    refreshIcons();
  }
  root.insertAdjacentHTML('afterend', extra + tradeoffs(benefits, considerations));
  bindTabs(controls, select); select(fixture.default);
}
