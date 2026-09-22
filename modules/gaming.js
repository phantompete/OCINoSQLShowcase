import { workloads } from '../fixtures/scenarios.js';
import { renderWorkload, initWorkload } from './workload.js';
import { panel, tabs, bindTabs, selectTab } from './ui.js';
export const gaming = {
  label: 'Gaming', summary: 'Keep player context and correctness aligned.', references: ['concepts', 'global'],
  help: [['Read consistency', 'EVENTUAL may return an older value; ABSOLUTE reads the current regional value. Neither makes asynchronous regional replication globally absolute.'], ['Concurrent regional writes', 'For the same row, timestamp-based conflict resolution can supersede one update. Use a data design that fits the business action.']],
  render: () => renderWorkload(workloads.gaming, 'Gaming · player context across regions'),
  init: () => {
    initWorkload(workloads.gaming, ['Read player context through a key-based application path.', 'Place regional replicas near distributed player populations.'], ['Authorization and high-value game-state rules remain application responsibilities.', 'Conflicting regional writes need deliberate modeling and validation.'], panel('Independent decision', 'Choose read freshness for the action', `${tabs('consistency', [['eventual', 'EVENTUAL'], ['absolute', 'ABSOLUTE']], 'eventual', 'Read consistency')}<p id="consistency-panel" role="tabpanel" aria-labelledby="consistency-eventual" class="result-note"></p>`));
    const root = document.querySelector('[aria-label="Read consistency"]');
    const target = document.querySelector('#consistency-panel');
    const select = key => { selectTab(root, key); target.setAttribute('aria-labelledby', `consistency-${key}`); target.textContent = key === 'absolute' ? 'ABSOLUTE: current value in the region being read; twice the read units for the same data. Does not wait for every remote region to converge.' : 'EVENTUAL: an older value may be returned. Use when the application can tolerate this freshness tradeoff.'; };
    bindTabs(root, select); select('eventual');
  }
};
