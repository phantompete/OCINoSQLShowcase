/* Original presentation data from NoSQLShowcase. No service operations execute. */
window.FIRST_ITERATION = {
  "fixtureVersion": "1.0.0",
  "observationSamples": {
    "id": "operations.chart.v1",
    "version": "1.0.0",
    "illustrative": true,
    "unit": "ReadUnits per one-minute window",
    "values": [
      20,
      35,
      65,
      90,
      55,
      30
    ]
  },
  "operationData": {
    "detect": {
      "id": "operations.detect.v1",
      "title": "Start with the customer symptom",
      "summary": "Pair request errors and latency from your application with the relevant table metrics.",
      "signals": [
        [
          "Read / write throttles",
          "Counts of throttling exceptions over a selected period.",
          "triangle-alert"
        ],
        [
          "Consumed units",
          "ReadUnits and WriteUnits over the observation window.",
          "gauge"
        ],
        [
          "Application latency",
          "Application instrumentation; not inferred from table capacity.",
          "timer"
        ]
      ],
      "steps": [
        [
          "Scope",
          "Identify the affected operation, table, region, and time."
        ],
        [
          "Correlate",
          "Compare errors, consumed units, and throttles."
        ],
        [
          "Escalate",
          "Page the owner using a tested alarm and notification route."
        ]
      ]
    },
    "investigate": {
      "id": "operations.investigate.v1",
      "title": "Find what changed in the access path",
      "summary": "Check query shape, hot keys, payloads, and regional behavior before choosing a remedy.",
      "signals": [
        [
          "Table dimensions",
          "Filter the metric stream to the intended table and region.",
          "filter"
        ],
        [
          "Replica lag",
          "Receiver-side milliseconds; interpret with sender context.",
          "globe"
        ],
        [
          "Request evidence",
          "Use application logs and supported API audit records appropriately.",
          "logs"
        ]
      ],
      "steps": [
        [
          "Compare",
          "Inspect baseline and incident windows."
        ],
        [
          "Inspect",
          "Review queries, key distribution, and client retries."
        ],
        [
          "Separate",
          "Distinguish missing telemetry from measured inactivity."
        ]
      ]
    },
    "improve": {
      "id": "operations.improve.v1",
      "title": "Make a change you can evaluate",
      "summary": "Choose a scoped capacity or application adjustment, then compare customer outcomes.",
      "signals": [
        [
          "Capacity fit",
          "Revisit mode and provisioned limits against observed demand.",
          "sliders-horizontal"
        ],
        [
          "Data access",
          "Review indexes, row size, key distribution, and request patterns.",
          "database"
        ],
        [
          "Outcome",
          "Confirm errors and latency improve without unexpected cost.",
          "check-check"
        ]
      ],
      "steps": [
        [
          "Hypothesize",
          "State the cause and expected effect."
        ],
        [
          "Change",
          "Apply through your normal approved operating process."
        ],
        [
          "Verify",
          "Compare the same observation window and statistic."
        ]
      ]
    }
  },
  "samples": {
    "export": "# Bash · Oracle NoSQL Database Migrator 1.8.0\n# Review a cloud-source → file-sink configuration first.\n./runMigrator --config ./export-demo.json",
    "import": "# Bash · Oracle NoSQL Database Migrator 1.8.0\n# Review a file-source → cloud-sink configuration first.\n./runMigrator --config ./import-demo.json",
    "records": [
      {
        "id": "device-017",
        "document": {
          "temperatureC": 21,
          "zone": "north"
        }
      },
      {
        "id": "device-018",
        "document": {
          "temperatureC": 24,
          "zone": "south"
        }
      }
    ],
    "ddl": "CREATE TABLE demo_devices (\n  id STRING,\n  document JSON,\n  PRIMARY KEY (id)\n)",
    "read": "SELECT d.id, d.document\nFROM demo_devices d\nWHERE d.id = \"device-017\""
  },
  "scenarios": {
    "regional": {
      "id": "recovery.regional.v1",
      "label": "Regional disruption",
      "title": "Keep another region ready to serve",
      "summary": "Global Active Tables provide writable regional replicas. Your application needs a tested policy for choosing another region when its usual endpoint cannot be reached.",
      "nodes": [
        [
          "app-window",
          "Application",
          "Customer routing policy",
          "violet"
        ],
        [
          "database",
          "Region A endpoint",
          "Regional table replica",
          "teal"
        ],
        [
          "database",
          "Region B endpoint",
          "Regional table replica",
          "teal"
        ]
      ],
      "edges": [
        "Local requests",
        "Asynchronous replication"
      ],
      "stages": [
        {
          "title": "Serve locally",
          "text": "Both regional replicas can accept reads and writes. The illustrated application uses Region A.",
          "statuses": [
            "Uses Region A",
            "Read / write",
            "Read / write"
          ],
          "active": 1
        },
        {
          "title": "Detect disruption",
          "text": "Region A is unreachable from this application. Retry and timeout handling belongs to the client; recent remote updates may not yet be visible in Region B.",
          "statuses": [
            "Request interrupted",
            "Unreachable in this scenario",
            "Still read / write"
          ],
          "active": 0,
          "broken": true
        },
        {
          "title": "Redirect the application",
          "text": "The customer routing policy selects the Region B endpoint. Region B is already writable; there is no customer-operated replica promotion.",
          "statuses": [
            "Reconnects to Region B",
            "Unreachable in this scenario",
            "Serves application requests"
          ],
          "active": 2,
          "redirected": true
        },
        {
          "title": "Validate and reconcile",
          "text": "Check business operations and replication after connectivity returns. Investigate conflicting updates before returning traffic under your policy.",
          "statuses": [
            "Validates business results",
            "Connectivity restored",
            "Continues serving"
          ],
          "active": 2,
          "redirected": true
        }
      ],
      "runbook": [
        [
          "Prepare",
          "Create eligible replicas and test regional access."
        ],
        [
          "Detect",
          "Correlate client errors and regional signals."
        ],
        [
          "Redirect",
          "Apply your application routing and retry policy."
        ],
        [
          "Reconcile",
          "Validate data freshness and recovered-region behavior."
        ]
      ],
      "source": "global",
      "defaultStage": 0,
      "illustrative": true
    },
    "export": {
      "id": "recovery.export.v1",
      "label": "Retained export",
      "title": "Recover from a deliberately retained copy",
      "summary": "A customer-managed Migrator export provides a separate recovery input. Decide when to capture it, where to retain it, and how to validate an import before an incident.",
      "nodes": [
        [
          "database",
          "Source table",
          "Coordinate capture",
          "teal"
        ],
        [
          "archive",
          "Retained files",
          "Customer retention policy",
          "amber"
        ],
        [
          "database",
          "Recovery table",
          "Isolated validation target",
          "green"
        ]
      ],
      "edges": [
        "Export",
        "Import"
      ],
      "stages": [
        {
          "title": "Choose a capture boundary",
          "text": "Coordinate source writes and the export scope. Do not assume an online export is a transactionally consistent snapshot.",
          "statuses": [
            "Capture plan agreed",
            "Destination prepared",
            "Empty target"
          ],
          "active": 0
        },
        {
          "title": "Export and retain",
          "text": "Run the documented Migrator workflow. Protect the files and schema, record capture context, and check completion and error counts.",
          "statuses": [
            "Read by Migrator",
            "Copy retained",
            "Empty target"
          ],
          "active": 1
        },
        {
          "title": "Import separately",
          "text": "Restore the selected files into an empty demo/recovery target using a reviewed schema and permissions. This writes rows and consumes capacity.",
          "statuses": [
            "Original unchanged by restore",
            "Selected recovery input",
            "Importing rows"
          ],
          "active": 2
        },
        {
          "title": "Validate before routing",
          "text": "Compare counts, keys, values, indexes, and expiry semantics. Only then decide whether to route application traffic to the recovery target.",
          "statuses": [
            "Reference retained",
            "Evidence retained",
            "Application checks passed"
          ],
          "active": 2
        }
      ],
      "runbook": [
        [
          "Capture",
          "Document source-write coordination and copy time."
        ],
        [
          "Retain",
          "Govern files, schema, access, and retention."
        ],
        [
          "Restore",
          "Import into an empty isolated target."
        ],
        [
          "Validate",
          "Check data and application behavior before cutover."
        ]
      ],
      "source": "migrator",
      "defaultStage": 0,
      "illustrative": true
    },
    "file": {
      "id": "migration.file.v1",
      "label": "File import",
      "title": "Bring a reviewed data set into NoSQL",
      "summary": "Use supported JSON or CSV inputs with NoSQL Database Migrator. Rework keys and schema before import; an accepted file format does not establish application compatibility.",
      "nodes": [
        [
          "file-json",
          "Source files",
          "Synthetic records + schema",
          "amber"
        ],
        [
          "git-branch",
          "NoSQL Migrator",
          "Reviewed configuration",
          "violet"
        ],
        [
          "database",
          "Demo target",
          "Empty NoSQL table",
          "teal"
        ]
      ],
      "edges": [
        "Read records",
        "Write rows"
      ],
      "stages": [
        {
          "title": "Map the data",
          "text": "Choose primary and shard keys; validate field types and required transformations.",
          "statuses": [
            "2 synthetic input rows",
            "Mapping reviewed",
            "0 rows"
          ],
          "active": 0
        },
        {
          "title": "Prepare the target",
          "text": "Prepare an empty target, scoped access, and capacity. Review configuration before running Migrator outside this showcase.",
          "statuses": [
            "2 synthetic input rows",
            "Configuration ready",
            "0 rows"
          ],
          "active": 1
        },
        {
          "title": "Import the fixture",
          "text": "The illustrative migration writes both input records without errors. No cloud operation is performed here.",
          "statuses": [
            "2 rows read",
            "2 written · 0 failed",
            "2 rows"
          ],
          "active": 2
        },
        {
          "title": "Check before cutover",
          "text": "Verify keys, representative values, query behavior, expiry, and application access. Retain a rollback plan.",
          "statuses": [
            "Original retained",
            "Results reconciled",
            "2 validated rows"
          ],
          "active": 2
        }
      ],
      "runbook": [
        [
          "Map",
          "Review keys, types, and transformations."
        ],
        [
          "Prepare",
          "Scope IAM and use an empty target."
        ],
        [
          "Import",
          "Reconcile written, skipped, and failed records."
        ],
        [
          "Validate",
          "Exercise application reads before cutover."
        ]
      ],
      "source": "migrator",
      "defaultStage": 0,
      "illustrative": true
    },
    "onprem": {
      "id": "migration.onprem.v1",
      "label": "Oracle NoSQL source",
      "title": "Move existing NoSQL data deliberately",
      "summary": "Migrator can read an on-premises Oracle NoSQL source and write to the cloud service. Validate cloud constraints, access, and application configuration separately.",
      "nodes": [
        [
          "server",
          "Oracle NoSQL source",
          "Customer-operated deployment",
          "amber"
        ],
        [
          "git-branch",
          "NoSQL Migrator",
          "Source and sink configuration",
          "violet"
        ],
        [
          "database",
          "OCI NoSQL target",
          "Managed tables",
          "teal"
        ]
      ],
      "edges": [
        "Read source",
        "Import"
      ],
      "stages": [
        {
          "title": "Assess the source",
          "text": "Inventory schemas, keys, queries, security, and expiry. Check the cloud target against your application requirements.",
          "statuses": [
            "Source inventory",
            "Mapping planned",
            "Not serving traffic"
          ],
          "active": 0
        },
        {
          "title": "Coordinate the copy",
          "text": "Arrange network access and permissions. Define a source-write pause or an independently designed change reconciliation process.",
          "statuses": [
            "Writes coordinated",
            "Configuration validated",
            "Ready for import"
          ],
          "active": 1
        },
        {
          "title": "Transfer records",
          "text": "Run and observe Migrator. Reconcile errors and counts; this demonstration does not claim continuous change capture.",
          "statuses": [
            "Source retained",
            "Transfer examined",
            "Rows imported"
          ],
          "active": 2
        },
        {
          "title": "Validate and switch",
          "text": "Test SDK authentication, regional endpoints, query behavior, and capacity before application cutover.",
          "statuses": [
            "Rollback input retained",
            "Evidence recorded",
            "Application validated"
          ],
          "active": 2
        }
      ],
      "runbook": [
        [
          "Assess",
          "Inventory schemas and client assumptions."
        ],
        [
          "Coordinate",
          "Control concurrent source changes."
        ],
        [
          "Transfer",
          "Check errors and counts."
        ],
        [
          "Switch",
          "Validate the application and rollback conditions."
        ]
      ],
      "source": "migrator",
      "defaultStage": 0,
      "illustrative": true
    },
    "phased": {
      "id": "migration.phased.v1",
      "label": "Phased adoption",
      "title": "Move one application boundary at a time",
      "summary": "A customer-designed rollout can start with an isolated workload. Keep a single documented owner for each write path and define how discrepancies will be resolved.",
      "nodes": [
        [
          "app-window",
          "Application",
          "Feature routing",
          "violet"
        ],
        [
          "database",
          "Existing store",
          "Original workload owner",
          "amber"
        ],
        [
          "database",
          "OCI NoSQL",
          "Selected new workload",
          "teal"
        ]
      ],
      "edges": [
        "Existing path",
        "Reviewed data movement"
      ],
      "stages": [
        {
          "title": "Select a boundary",
          "text": "Choose an independently testable workload and define its source of truth.",
          "statuses": [
            "Original routing",
            "Owns writes",
            "Isolated target"
          ],
          "active": 0
        },
        {
          "title": "Exercise the new path",
          "text": "Validate a synthetic or approved test data set. Compare application results before changing traffic.",
          "statuses": [
            "Test traffic only",
            "Owns existing workload",
            "New path under test"
          ],
          "active": 2
        },
        {
          "title": "Shift selected traffic",
          "text": "The application team controls traffic and write ownership. This is not a built-in NoSQL migration feature.",
          "statuses": [
            "Selected traffic shifted",
            "Retained workload owner",
            "Owns selected workload"
          ],
          "active": 2
        },
        {
          "title": "Review rollback",
          "text": "Reconcile any changed data before rollback; switching an endpoint alone does not reverse writes.",
          "statuses": [
            "Evidence reviewed",
            "Retention defined",
            "New writes accounted for"
          ],
          "active": 2
        }
      ],
      "runbook": [
        [
          "Scope",
          "Select an isolated workload."
        ],
        [
          "Validate",
          "Compare representative application results."
        ],
        [
          "Shift",
          "Change routing and write ownership together."
        ],
        [
          "Observe",
          "Apply explicit rollback criteria."
        ]
      ],
      "source": "concepts",
      "defaultStage": 0,
      "illustrative": true
    }
  },
  "workloads": {
    "iot": {
      "id": "patterns.iot.v1",
      "default": "ingest",
      "options": [
        [
          "ingest",
          "Device readings"
        ],
        [
          "expiry",
          "Row expiry"
        ]
      ],
      "ingest": {
        "title": "Make device context available to applications",
        "summary": "An ingestion application validates each reading and writes it under a deliberate key. NoSQL stores the row; device identity and input validation belong to the application.",
        "nodes": [
          [
            "radio",
            "Device",
            "Synthetic device-017",
            "amber"
          ],
          [
            "app-window",
            "Ingestion application",
            "Validate identity and payload",
            "violet"
          ],
          [
            "database",
            "Readings table",
            "Device + event key",
            "teal"
          ]
        ],
        "edges": [
          "Reading",
          "Write row"
        ],
        "output": {
          "deviceId": "device-017",
          "eventId": "event-001",
          "reading": {
            "temperatureC": 21
          }
        },
        "result": "One illustrative event stored. Reusing a device-only key would overwrite its previous reading; include an event key when history matters."
      },
      "expiry": {
        "title": "Separate operational retention from archives",
        "summary": "Set a row lifetime for disposable readings. After expiration the row is no longer returned; a separate archival policy is needed if history must survive.",
        "nodes": [
          [
            "database",
            "Reading row",
            "Expiry configured",
            "teal"
          ],
          [
            "clock",
            "Expiry boundary",
            "Illustrative time progression",
            "amber"
          ],
          [
            "search",
            "Later read",
            "Expired row unavailable",
            "violet"
          ]
        ],
        "edges": [
          "Lifetime elapses",
          "Read after expiry"
        ],
        "output": {
          "deviceId": "device-017",
          "result": "No row returned after expiration"
        },
        "result": "Expiry is a data-lifecycle choice, not a backup. This illustration makes no promise about physical deletion timing."
      }
    },
    "gaming": {
      "id": "patterns.gaming.v1",
      "default": "local",
      "options": [
        [
          "local",
          "Player profile"
        ],
        [
          "global",
          "Regional conflict"
        ]
      ],
      "local": {
        "title": "Load the context behind a player session",
        "summary": "Read a player document by key. Keep session authorization in the application and choose read consistency according to the business action.",
        "nodes": [
          [
            "gamepad-2",
            "Player",
            "Synthetic player-042",
            "amber"
          ],
          [
            "app-window",
            "Game application",
            "Authorizes the request",
            "violet"
          ],
          [
            "database",
            "Player table",
            "Profile document",
            "teal"
          ]
        ],
        "edges": [
          "Session request",
          "Read by key"
        ],
        "output": {
          "playerId": "player-042",
          "profile": {
            "displayName": "Nova",
            "level": 8
          }
        },
        "result": "A profile read does not authorize a purchase or establish a globally consistent wallet."
      },
      "global": {
        "title": "Make concurrent profile changes explicit",
        "summary": "Two regions update the same player row in this synthetic example. Regional replication resolves the conflict using the later write timestamp.",
        "nodes": [
          [
            "database",
            "Region A",
            "Earlier write: blue theme",
            "teal"
          ],
          [
            "repeat-2",
            "Regional replication",
            "Asynchronous conflict resolution",
            "violet"
          ],
          [
            "database",
            "Region B",
            "Later write: green theme",
            "teal"
          ]
        ],
        "edges": [
          "Earlier update",
          "Later update wins"
        ],
        "output": {
          "playerId": "player-042",
          "theme": "green",
          "explanation": "Later timestamp wins after convergence"
        },
        "result": "The earlier blue-theme update is superseded in this example. Design high-value state around the required correctness rules."
      }
    },
    "social": {
      "id": "patterns.social.v1",
      "default": "profile",
      "options": [
        [
          "profile",
          "Flexible profiles"
        ],
        [
          "regional",
          "Local regional access"
        ]
      ],
      "profile": {
        "title": "Let profile details evolve with the product",
        "summary": "Keep a stable identity key while storing optional profile attributes in JSON. Your application still validates fields and enforces visibility.",
        "nodes": [
          [
            "users",
            "Member",
            "Synthetic member-008",
            "amber"
          ],
          [
            "shield-check",
            "Social application",
            "Visibility and validation",
            "violet"
          ],
          [
            "file-json",
            "Profile document",
            "Typed key + JSON fields",
            "teal"
          ]
        ],
        "edges": [
          "Profile request",
          "Authorized data access"
        ],
        "output": {
          "memberId": "member-008",
          "profile": {
            "name": "Ari",
            "interests": [
              "cycling",
              "photography"
            ]
          }
        },
        "result": "Flexible JSON accommodates optional fields. It does not remove access checks or the need to design indexes for query paths."
      },
      "regional": {
        "title": "Serve a traveling member closer to home",
        "summary": "A regional replica lets the application read and write near a member. A recent change made elsewhere may take time to appear.",
        "nodes": [
          [
            "users",
            "Traveling member",
            "Application selects a region",
            "amber"
          ],
          [
            "database",
            "Nearby replica",
            "Local read / write",
            "teal"
          ],
          [
            "database",
            "Other region",
            "Replicated profile",
            "teal"
          ]
        ],
        "edges": [
          "Regional request",
          "Asynchronous replication"
        ],
        "output": {
          "memberId": "member-008",
          "view": "Nearby regional replica",
          "freshness": "Remote changes eventually converge"
        },
        "result": "Application routing selects the endpoint. Global Active Tables do not automatically route a traveling user."
      }
    }
  }
};
window.FIXTURES = {recovery:{}, migration:{}};
for(const [key,f] of Object.entries(window.FIRST_ITERATION.scenarios)) {
 const owner=key==='regional'||key==='export'?'recovery':'migration';
 const fixture={...f,version:1,nodes:f.nodes.map(([icon,title,detail,tone])=>[title,detail,icon,tone==='green'?'teal':tone]),steps:f.stages.map(s=>[s.title,s.text]),sources:[f.source]};
 fixture.renderVisual=window.NOSQL_VISUALS.staged(fixture);
 window.FIXTURES[owner][key]=fixture;
}
