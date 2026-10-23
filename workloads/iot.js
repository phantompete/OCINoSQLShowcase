/* Original iot stories, adapted to the shared V2 renderer. */
(() => {
 const S=window.SERVICE;
 S.workloads.iot={
  "label": "IoT",
  "summary": "Turn device readings into usable context.",
  "sources": [
    "concepts",
    "global",
    "reference"
  ],
  "help": {
    "Illustrative workload": "A synthetic application design, not a deployed solution or measured performance result.",
    "Shard key": "The primary-key portion used to distribute rows. A hot device or key may concentrate demand.",
    "Time to live": "A row expiry setting. Expired readings cannot substitute for a separately retained history."
  },
  "panelTitle": "IoT · readings with a useful lifetime",
  "panelSummary": "",
  "pillar": "Application story · illustrative",
  "badge": "Synthetic data",
  "renderer": "iot",
  "benefits": [
    "Store flexible device payloads alongside stable identifiers.",
    "Expire disposable readings according to your data policy."
  ],
  "considerations": [
    "Validate devices and payloads before writing; this page is not an ingestion service.",
    "Design keys for history and distribution; retain an archive separately if needed."
  ],
  "scenarios": {
    "ingest": {
      "id": "patterns.iot.v1.ingest",
      "version": 1,
      "label": "Device readings",
      "title": "Make device context available to applications",
      "summary": "An ingestion application validates each reading and writes it under a deliberate key. NoSQL stores the row; device identity and input validation belong to the application.",
      "nodes": [
        [
          "Device",
          "Synthetic device-017",
          "radio",
          "amber"
        ],
        [
          "Ingestion application",
          "Validate identity and payload",
          "app-window",
          "violet"
        ],
        [
          "Readings table",
          "Device + event key",
          "database",
          "teal"
        ]
      ],
      "edges": [
        "Reading",
        "Write row"
      ],
      "note": "One illustrative event stored. Reusing a device-only key would overwrite its previous reading; include an event key when history matters.",
      "json": {
        "label": "JSON · illustrative outcome",
        "text": "{\n  \"deviceId\": \"device-017\",\n  \"eventId\": \"event-001\",\n  \"reading\": {\n    \"temperatureC\": 21\n  }\n}",
        "prerequisites": "Synthetic fixture. This is not a response from OCI."
      },
      "sources": [
        "concepts",
        "global",
        "reference"
      ]
    },
    "expiry": {
      "id": "patterns.iot.v1.expiry",
      "version": 1,
      "label": "Row expiry",
      "title": "Separate operational retention from archives",
      "summary": "Set a row lifetime for disposable readings. After expiration the row is no longer returned; a separate archival policy is needed if history must survive.",
      "nodes": [
        [
          "Reading row",
          "Expiry configured",
          "database",
          "teal"
        ],
        [
          "Expiry boundary",
          "Illustrative time progression",
          "clock",
          "amber"
        ],
        [
          "Later read",
          "Expired row unavailable",
          "search",
          "violet"
        ]
      ],
      "edges": [
        "Lifetime elapses",
        "Read after expiry"
      ],
      "note": "Expiry is a data-lifecycle choice, not a backup. This illustration makes no promise about physical deletion timing.",
      "json": {
        "label": "JSON · illustrative outcome",
        "text": "{\n  \"deviceId\": \"device-017\",\n  \"result\": \"No row returned after expiration\"\n}",
        "prerequisites": "Synthetic fixture. This is not a response from OCI."
      },
      "sources": [
        "concepts",
        "global",
        "reference"
      ]
    }
  }
};
 S.renderers.iot=(m,h)=>h.scenarioModule(m);
 S.initializers.iot=(m,h)=>{const cleanup=h.initScenarios(m);return cleanup;};
})();
