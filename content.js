export const reviewDate = '22 September 2026';
export const docs = {
  overview: ['Oracle NoSQL documentation', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/index.html'],
  concepts: ['Cloud concepts', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/cloud-concepts.html'],
  features: ['Service features & dedicated environments', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/mmmmq/'],
  global: ['Global Active Tables', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/global-active-tables-in-ndcs.html'],
  migrator: ['NoSQL Database Migrator', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/cjphq/index.html'],
  metrics: ['Monitoring OCI NoSQL', 'https://docs.oracle.com/en-us/iaas/nosql-database/doc/monitoring-ndcs1.html'],
  security: ['NoSQL security model', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/ttxsq/index.html'],
  policies: ['NoSQL IAM policy reference', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/odsql/'],
  cmek: ['Customer-managed encryption keys', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/icxer/index.html'],
  endpoints: ['Regions, endpoints & subscription', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/fnsxl/index.html'],
  audit: ['OCI Audit overview', 'https://docs.oracle.com/en-us/iaas/Content/Audit/Concepts/auditoverview.htm'],
  releases: ['NoSQL release notes', 'https://docs.oracle.com/en-us/iaas/releasenotes/services/nosql-database-cloud/'],
  changes: ['OCI service changes', 'https://docs.oracle.com/en-us/iaas/Content/servicechanges.htm'],
  reference: ['Data types & DDL reference', 'https://docs.oracle.com/en/cloud/paas/nosql-cloud/rnpxl/'],
  examples: ['Oracle NoSQL examples', 'https://github.com/oracle/nosql-examples']
};
export const pageData = {
  overview: { nav: 'Overview', title: 'Overview', icon: 'layout-dashboard', eyebrow: 'Oracle NoSQL Database Cloud Service', pill: 'Applications first. Infrastructure managed.', heroTitle: 'Bring responsive experiences closer to everyone.', summary: 'Keep application teams focused on device, player, and member experiences—with a clear plan for growth, resilience, and ownership.', references: ['concepts', 'features', 'releases'], help: [['OCI NoSQL', 'Oracle NoSQL Database Cloud Service: managed tables for key-value, document, and typed data.'], ['Table', 'Rows identified by a primary key. A JSON column can hold flexible document content.'], ['Static showcase', 'Every example is synthetic. No cloud connection, telemetry, or resource change is made.']] },
  availability: { nav: 'Availability', title: 'Availability & scale', icon: 'network', eyebrow: 'Throughput, placement & workload fit', pill: 'Grow with a deliberate capacity model', heroTitle: 'Meet changing demand without managing servers.', summary: 'Choose how to fund throughput and where data should live, while keeping application freshness and regional access requirements visible.', references: ['concepts', 'features', 'global', 'endpoints'], help: [['Read and Write Units', 'Throughput accounting depends on operation and data size; request count alone is not capacity.'], ['On-demand', 'The service manages read/write capacity for the table. Service and storage limits still apply.'], ['Global Active Table', 'A table replicated asynchronously between regions, with local reads and writes.'], ['Dedicated hosted environment', 'Tenancy-dedicated capacity, requested through Oracle. Currently excludes Global Active Tables.']] },
  recovery: { nav: 'Recovery', title: 'Data protection & disaster recovery', icon: 'cloud-cog', eyebrow: 'Continuity, retained copies & rehearsal', pill: 'Practice the application recovery path', heroTitle: 'Keep a tested path back to service.', summary: 'Plan separately for a regional disruption and for unwanted data changes. The copy you rely on determines the recovery work your team must rehearse.', references: ['global', 'migrator'], help: [['Regional redirection', 'The application moves to another configured regional endpoint. It is not a customer-controlled node promotion.'], ['Recovery point', 'The data state available after recovery. No measured or guaranteed RPO is provided by this simulation.'], ['Retained export', 'Customer-managed files and schema used as recovery input. Retention, capture consistency, and restore validation require a deliberate process.']] },
  migration: { nav: 'Migration', title: 'Migration & modernization', icon: 'git-branch', eyebrow: 'Data movement & application readiness', pill: 'Validate before changing traffic', heroTitle: 'Move application data with controlled cutover.', summary: 'Choose a manageable migration boundary and prove the new application path before customers depend on it.', references: ['migrator', 'reference', 'concepts'], help: [['Migrator', 'A source-to-sink data movement utility. A data import is not proof of application compatibility.'], ['Cutover', 'A customer-controlled change to application traffic and write ownership after validation.'], ['Display-only samples', 'Commands are documentation examples. Executing them separately requires installation, IAM, reviewed configuration, and a demo target.']] },
  observability: { nav: 'Observability', title: 'Observability & operations', icon: 'activity', eyebrow: 'From a service signal to a decision', pill: 'Start with customer impact', heroTitle: 'Turn table signals into practical action.', summary: 'Connect customer symptoms to table demand and application behavior, then verify whether the chosen change helped.', references: ['metrics', 'audit', 'concepts'], help: [['oci_nosql', 'The OCI Monitoring namespace for service metrics. Preserve the time window, statistic, and table dimensions.'], ['Throttle count', 'A count of throttling exceptions over a period; correlate with the application before diagnosing impact.'], ['Replica lag', 'A receiver-side replication signal, expressed in milliseconds. It is neither a global consistency guarantee nor a measured RPO.'], ['Missing samples', 'Unknown is not zero. Show No samples or Unavailable and investigate collection separately.']] },
  security: { nav: 'Security', title: 'Security & governance', icon: 'shield-check', eyebrow: 'Identity, connectivity & data stewardship', pill: 'Make responsibilities explicit', heroTitle: 'Give each application only needed access.', summary: 'Build an adoption boundary that teams can explain: who can use the data, how it is reached, and who owns its lifecycle.', references: ['security', 'policies', 'endpoints', 'cmek', 'audit'], help: [['IAM policy', 'Defines which principals may perform which actions on resources in a compartment.'], ['Service endpoint', 'A regional access point; configure and validate the application network path. Do not assume a table has a Cache-style private endpoint.'], ['CMEK', 'Customer-managed keys require a dedicated environment enabled for that feature and customer key lifecycle management.'], ['Audit boundary', 'OCI Audit records supported API activity. It is not presented here as a complete row-read or application audit trail.']] },
  patterns: { nav: 'Workload patterns', title: 'Workload patterns', icon: 'blocks', eyebrow: 'IoT, gaming & social applications', pill: 'Follow the data behind the experience', heroTitle: 'Build around the moments users value.', summary: 'Explore small application stories that connect a data model to a customer outcome, with the ownership and tradeoffs in view.', references: ['concepts'], help: [['Illustrative workload', 'A synthetic application design, not a deployed solution or measured performance result.']] }
};
export const comparisons = {
  capacity: {
    headers: ['Choice', 'Best fit', 'What you control', 'Consideration'],
    rows: [
      ['Provisioned tables', 'Demand you can estimate and review', 'Read Units, Write Units, and storage', 'Monitor throttling and revise allocations as usage changes.'],
      ['On-demand tables', 'Variable or initially uncertain demand', 'Storage, data design, application behavior', 'Automatic throughput management does not remove service limits or cost review.'],
      ['Global Active Tables', 'Local access in multiple regions or regional continuity', 'Replica placement and application routing', 'Asynchronous convergence, frozen schema, and conflict behavior must fit the workload.'],
      ['Dedicated hosted environment', 'Tenancy isolation or unusually demanding capacity', 'A separately requested dedicated environment', 'Evaluate commercial terms and readiness with Oracle; Global Active Tables are currently unsupported.']
    ]
  },
  recovery: {
    headers: ['Pattern', 'Recovery-point posture', 'Recovery-time posture', 'Best fit / operator action'],
    rows: [
      ['Regional redundancy', 'Managed in-region data copies', 'Managed service response; application retries still matter', 'Local infrastructure faults; observe application results.'],
      ['Global Active Tables', 'Remote state may lag recent writes', 'Depends on detection, routing, reconnection, and validation', 'Regional disruption; prepare replicas and redirect application traffic.'],
      ['Customer-retained export', 'Depends on the selected capture and source-write coordination', 'Depends on import volume, capacity, and validation', 'Unwanted changes or a recovery rehearsal; select files, import, verify, then route.']
    ]
  },
  migration: {
    headers: ['Path', 'Useful when', 'Prerequisites', 'Cutover responsibility'],
    rows: [
      ['File import', 'A reviewed data set exists in a supported format', 'Mapped keys/types, reviewed configuration, empty target', 'Validate imported data and update application routing.'],
      ['Oracle NoSQL source', 'Moving existing NoSQL tables to the cloud', 'Accessible source, IAM, cloud compatibility review', 'Coordinate concurrent changes and reconcile the transfer.'],
      ['Phased application adoption', 'A workload can move independently', 'Explicit write ownership and application routing', 'Customer-designed rollout and rollback; not automatic CDC.']
    ]
  },
  security: {
    headers: ['Control', 'Protection', 'Customer responsibility', 'Consideration'],
    rows: [
      ['IAM and compartments', 'Scoped access to tables and operations', 'Define principals and least-privilege policies', 'Separate inspect, read, and write/manage permissions.'],
      ['HTTPS and network path', 'Encrypted transport to the service', 'Configure endpoint, routes, egress, and client trust', 'Validate service-gateway eligibility and regional connectivity.'],
      ['Encryption at rest', 'Stored data encryption managed by the service', 'Select the supported key ownership model', 'CMEK needs a specifically enabled dedicated environment.'],
      ['Data lifecycle and evidence', 'Retention policy and traceable supported API activity', 'Set expiry/retention; retain application evidence', 'Expiry is not archival; Audit is not a complete data-access log.']
    ]
  }
};
