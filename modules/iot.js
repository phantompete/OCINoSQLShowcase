import { workloads } from '../fixtures/scenarios.js';
import { renderWorkload, initWorkload } from './workload.js';
export const iot = {
  label: 'IoT', summary: 'Turn device readings into usable context.', references: ['concepts', 'global', 'reference'],
  help: [['Shard key', 'The primary-key portion used to distribute rows. A hot device or key may concentrate demand.'], ['Time to live', 'A row expiry setting. Expired readings cannot substitute for a separately retained history.']],
  render: () => renderWorkload(workloads.iot, 'IoT · readings with a useful lifetime'),
  init: () => initWorkload(workloads.iot, ['Store flexible device payloads alongside stable identifiers.', 'Expire disposable readings according to your data policy.'], ['Validate devices and payloads before writing; this page is not an ingestion service.', 'Design keys for history and distribution; retain an archive separately if needed.'])
};
