/* V1 section content in the V2 shell. Overview and footer remain as approved. */
window.SERVICE = {
  "name": "Oracle NoSQL Database Cloud Service",
  "shortName": "OCI NoSQL",
  "icon": "database",
  "status": "Application architecture stories",
  "designDate": "2 October 2026",
  "reviewDate": "12 October 2026",
  "footerReviewDate": "23 November 2026",
  "footerSources": [
    "documentation",
    "concepts",
    "features",
    "releaseNotes"
  ],
  "sources": {
    "overview": [
      "Oracle NoSQL documentation",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/index.html"
    ],
    "documentation": [
      "Oracle NoSQL documentation",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/index.html"
    ],
    "features": [
      "Service features & dedicated environments",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/mmmmq/"
    ],
    "releaseNotes": [
      "NoSQL release notes",
      "https://docs.oracle.com/en-us/iaas/releasenotes/services/nosql-database-cloud/"
    ],
    "concepts": [
      "Cloud concepts",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/cloud-concepts.html"
    ],
    "global": [
      "Global Active Tables",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/global-active-tables-in-ndcs.html"
    ],
    "migrator": [
      "NoSQL Database Migrator",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/cjphq/index.html"
    ],
    "monitoring": [
      "Monitoring NoSQL",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/mgygg/"
    ],
    "security": [
      "NoSQL security model",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/ttxsq/index.html"
    ],
    "cmek": [
      "Customer-managed encryption keys",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/icxer/index.html"
    ],
    "design": [
      "Table design & retention",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/designing-a-table-in-oracle-nosql-database-cloud-service.html"
    ],
    "keys": [
      "Primary and shard keys",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/designing-a-table-in-oracle-nosql-database-cloud-service.html"
    ],
    "index": [
      "JSON index syntax",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/uapto/"
    ],
    "query": [
      "SQL and DDL reference",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/rnpxl/"
    ],
    "release": [
      "Service release notes",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/dtddt/whats-new-for-oracle-nosql-database-cloud-service.html"
    ],
    "metrics": [
      "Monitoring OCI NoSQL",
      "https://docs.oracle.com/en-us/iaas/nosql-database/doc/monitoring-ndcs1.html"
    ],
    "policies": [
      "NoSQL IAM policy reference",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/odsql/"
    ],
    "endpoints": [
      "Regions, endpoints & subscription",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/fnsxl/index.html"
    ],
    "audit": [
      "OCI Audit overview",
      "https://docs.oracle.com/en-us/iaas/Content/Audit/Concepts/auditoverview.htm"
    ],
    "releases": [
      "NoSQL release notes",
      "https://docs.oracle.com/en-us/iaas/releasenotes/services/nosql-database-cloud/"
    ],
    "changes": [
      "OCI service changes",
      "https://docs.oracle.com/en-us/iaas/Content/servicechanges.htm"
    ],
    "reference": [
      "Data types & DDL reference",
      "https://docs.oracle.com/en/cloud/paas/nosql-cloud/rnpxl/"
    ],
    "examples": [
      "Oracle NoSQL examples",
      "https://github.com/oracle/nosql-examples"
    ]
  },
  "defaultWorkload": "iot",
  "aliases": {
    "workloads": "patterns/iot",
    "iot": "patterns/iot",
    "gaming": "patterns/gaming",
    "social": "patterns/social"
  },
  "glanceTitle": "Application data, managed at table level",
  "glanceBadge": "Static customer walkthrough",
  "glance": [
    [
      "Flexible rows",
      "Combine typed keys and columns with JSON document content.",
      "Data model"
    ],
    [
      "Table throughput",
      "Choose provisioned or on-demand read and write capacity.",
      "Capacity"
    ],
    [
      "Regional reach",
      "Evaluate Global Active Tables for local access across regions.",
      "Placement"
    ]
  ],
  "overviewTitle": "From an application request to useful data",
  "overviewFlow": [
    [
      "People & devices",
      "Create application events",
      "users",
      "violet"
    ],
    [
      "Application",
      "Owns validation and access",
      "app-window",
      "teal"
    ],
    [
      "NoSQL table",
      "Stores rows and JSON documents",
      "database",
      "amber"
    ]
  ],
  "overviewEdges": [
    "Request",
    "Read / write"
  ],
  "overviewOutcome": "Choose a data model and access path that serve the application.",
  "overviewConsideration": "Placement, capacity and consistency are separate decisions.",
  "overviewBoundary": "Oracle manages the service infrastructure; your team owns the application and its data design.",
  "pages": {
    "overview": {
      "label": "Overview",
      "title": "Overview",
      "hero": "Build application stories around useful data",
      "summary": "Explore how OCI NoSQL supports application data, then examine the choices behind IoT, gaming and social experiences.",
      "icon": "layout-grid",
      "sources": [
        "concepts"
      ],
      "help": {
        "Table": "A collection of rows with a primary key and data fields.",
        "JSON": "Flexible document content can sit alongside typed columns.",
        "Scope": "The examples illustrate application decisions; controls advance the story."
      }
    },
    "availability": {
      "label": "Availability",
      "title": "Availability & scale",
      "hero": "Meet changing demand without managing servers.",
      "summary": "Choose how to fund throughput and where data should live, while keeping application freshness and regional access requirements visible.",
      "eyebrow": "Throughput, placement & workload fit",
      "pill": "Grow with a deliberate capacity model",
      "icon": "network",
      "pillar": "Foundation",
      "tone": "teal",
      "tags": [
        "Placement",
        "Capacity"
      ],
      "sources": [
        "concepts",
        "features",
        "global",
        "endpoints"
      ],
      "help": {
        "Read and Write Units": "Throughput accounting depends on operation and data size; request count alone is not capacity.",
        "On-demand": "The service manages read/write capacity for the table. Service and storage limits still apply.",
        "Global Active Table": "A table replicated asynchronously between regions, with local reads and writes.",
        "Dedicated hosted environment": "Tenancy-dedicated capacity, requested through Oracle. Currently excludes Global Active Tables."
      },
      "renderer": "availability"
    },
    "recovery": {
      "label": "Recovery",
      "title": "Data protection & disaster recovery",
      "hero": "Keep a tested path back to service.",
      "summary": "Plan separately for a regional disruption and for unwanted data changes. The copy you rely on determines the recovery work your team must rehearse.",
      "eyebrow": "Continuity, retained copies & rehearsal",
      "pill": "Practice the application recovery path",
      "icon": "shield-check",
      "pillar": "Protect",
      "tone": "coral",
      "tags": [
        "Continuity",
        "Retained copies"
      ],
      "sources": [
        "global",
        "migrator"
      ],
      "help": {
        "Regional redirection": "The application moves to another configured regional endpoint. It is not a customer-controlled node promotion.",
        "Recovery point": "The data state available after recovery. No measured or guaranteed RPO is provided by this simulation.",
        "Retained export": "Customer-managed files and schema used as recovery input. Retention, capture consistency, and restore validation require a deliberate process."
      },
      "renderer": "recovery"
    },
    "migration": {
      "label": "Migration",
      "title": "Migration & modernization",
      "hero": "Move application data with controlled cutover.",
      "summary": "Choose a manageable migration boundary and prove the new application path before customers depend on it.",
      "eyebrow": "Data movement & application readiness",
      "pill": "Validate before changing traffic",
      "icon": "arrow-right-left",
      "pillar": "Move",
      "tone": "teal",
      "tags": [
        "Data transfer",
        "Validation"
      ],
      "sources": [
        "migrator",
        "reference",
        "concepts"
      ],
      "help": {
        "Migrator": "A source-to-sink data movement utility. A data import is not proof of application compatibility.",
        "Cutover": "A customer-controlled change to application traffic and write ownership after validation.",
        "Display-only samples": "Commands are documentation examples. Executing them separately requires installation, IAM, reviewed configuration, and a demo target."
      },
      "renderer": "migration"
    },
    "observability": {
      "label": "Observability",
      "title": "Observability & operations",
      "hero": "Turn table signals into practical action.",
      "summary": "Connect customer symptoms to table demand and application behavior, then verify whether the chosen change helped.",
      "eyebrow": "From a service signal to a decision",
      "pill": "Start with customer impact",
      "icon": "activity",
      "pillar": "Operate",
      "tone": "teal",
      "tags": [
        "Signals",
        "Runbooks"
      ],
      "sources": [
        "metrics",
        "audit",
        "concepts"
      ],
      "help": {
        "oci_nosql": "The OCI Monitoring namespace for service metrics. Preserve the time window, statistic, and table dimensions.",
        "Throttle count": "A count of throttling exceptions over a period; correlate with the application before diagnosing impact.",
        "Replica lag": "A receiver-side replication signal, expressed in milliseconds. It is neither a global consistency guarantee nor a measured RPO.",
        "Missing samples": "Unknown is not zero. Show No samples or Unavailable and investigate collection separately."
      },
      "renderer": "observability"
    },
    "security": {
      "label": "Security",
      "title": "Security & governance",
      "hero": "Give each application only needed access.",
      "summary": "Build an adoption boundary that teams can explain: who can use the data, how it is reached, and who owns its lifecycle.",
      "eyebrow": "Identity, connectivity & data stewardship",
      "pill": "Make responsibilities explicit",
      "icon": "lock-keyhole",
      "pillar": "Govern",
      "tone": "violet",
      "tags": [
        "IAM",
        "Encryption"
      ],
      "sources": [
        "security",
        "policies",
        "endpoints",
        "cmek",
        "audit"
      ],
      "help": {
        "IAM policy": "Defines which principals may perform which actions on resources in a compartment.",
        "Service endpoint": "A regional access point; configure and validate the application network path. Do not assume a table has a Cache-style private endpoint.",
        "CMEK": "Customer-managed keys require a dedicated environment enabled for that feature and customer key lifecycle management.",
        "Audit boundary": "OCI Audit records supported API activity. It is not presented here as a complete row-read or application audit trail."
      },
      "renderer": "security"
    },
    "patterns": {
      "label": "Workload patterns",
      "title": "Workload patterns",
      "hero": "Build around the moments users value.",
      "summary": "Explore small application stories that connect a data model to a customer outcome, with the ownership and tradeoffs in view.",
      "eyebrow": "IoT, gaming & social applications",
      "pill": "Follow the data behind the experience",
      "icon": "blocks",
      "pillar": "Apply",
      "tone": "amber",
      "tags": [
        "Three workloads",
        "Data design"
      ],
      "sources": [
        "concepts"
      ],
      "help": {
        "Illustrative workload": "A synthetic application design, not a deployed solution or measured performance result."
      },
      "renderer": "patterns"
    }
  },
  "workloads": {},
  "renderers": {},
  "initializers": {},
  "overviewJourneys": {
    "availability": {
      "title": "Availability & scale",
      "summary": "Choose regional reach and capacity to fit the way your application grows.",
      "icon": "network",
      "pillar": "Foundation",
      "tone": "teal",
      "tags": [
        "Placement",
        "Capacity"
      ]
    },
    "recovery": {
      "title": "Data protection & disaster recovery",
      "summary": "Plan how applications resume and how retained data is checked before reuse.",
      "icon": "shield-check",
      "pillar": "Protect",
      "tone": "coral",
      "tags": [
        "Continuity",
        "Retained copies"
      ]
    },
    "migration": {
      "title": "Migration & modernization",
      "summary": "Move data through a supported path and keep application cutover a deliberate decision.",
      "icon": "arrow-right-left",
      "pillar": "Move",
      "tone": "teal",
      "tags": [
        "Data transfer",
        "Validation"
      ]
    },
    "observability": {
      "title": "Observability & operations",
      "summary": "Use service signals and application evidence to decide who should investigate and act.",
      "icon": "activity",
      "pillar": "Operate",
      "tone": "teal",
      "tags": [
        "Signals",
        "Runbooks"
      ]
    },
    "security": {
      "title": "Security & governance",
      "summary": "Match controls to the boundary they protect and identify who keeps them effective.",
      "icon": "lock-keyhole",
      "pillar": "Govern",
      "tone": "violet",
      "tags": [
        "IAM",
        "Encryption"
      ]
    },
    "patterns": {
      "title": "Workload patterns",
      "summary": "Choose a workload and follow how its data model, access needs and regional choices shape the experience.",
      "icon": "blocks",
      "pillar": "Apply",
      "tone": "amber",
      "tags": [
        "Three workloads",
        "Data design"
      ]
    }
  },
  "contentOrigin": {
    "directory": "NoSQLShowcase",
    "reviewDate": "22 September 2026",
    "imported": "23 October 2026"
  }
};
for (const key of ["recovery", "migration"]) window.SERVICE.pages[key].scenarios = window.FIXTURES[key];
