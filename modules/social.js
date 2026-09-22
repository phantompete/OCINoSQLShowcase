import { workloads } from '../fixtures/scenarios.js';
import { renderWorkload, initWorkload } from './workload.js';
export const social = {
  label: 'Social', summary: 'Evolve member profiles with clear visibility rules.', references: ['concepts', 'global', 'security'],
  help: [['JSON document', 'Flexible data stored inside a typed JSON column; primary-key and access design still apply.'], ['Regional freshness', 'A nearby regional replica may not yet include a recent change from another region.']],
  render: () => renderWorkload(workloads.social, 'Social · flexible profiles, local access'),
  init: () => initWorkload(workloads.social, ['Add optional profile fields without flattening every attribute.', 'Use local regional access for distributed application audiences.'], ['Privacy and visibility filtering belong in the authorized application path.', 'Design indexes and conflict handling; this is not a complete social-feed engine.'])
};
