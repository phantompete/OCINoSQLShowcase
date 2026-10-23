/* Original gaming stories, adapted to the shared V2 renderer. */
(() => {
 const S=window.SERVICE;
 S.workloads.gaming={
  "label": "Gaming",
  "summary": "Keep player context and correctness aligned.",
  "sources": [
    "concepts",
    "global"
  ],
  "help": {
    "Illustrative workload": "A synthetic application design, not a deployed solution or measured performance result.",
    "Read consistency": "EVENTUAL may return an older value; ABSOLUTE reads the current regional value. Neither makes asynchronous regional replication globally absolute.",
    "Concurrent regional writes": "For the same row, timestamp-based conflict resolution can supersede one update. Use a data design that fits the business action."
  },
  "panelTitle": "Gaming · player context across regions",
  "panelSummary": "",
  "pillar": "Application story · illustrative",
  "badge": "Synthetic data",
  "renderer": "gaming",
  "benefits": [
    "Read player context through a key-based application path.",
    "Place regional replicas near distributed player populations."
  ],
  "considerations": [
    "Authorization and high-value game-state rules remain application responsibilities.",
    "Conflicting regional writes need deliberate modeling and validation."
  ],
  "scenarios": {
    "local": {
      "id": "patterns.gaming.v1.local",
      "version": 1,
      "label": "Player profile",
      "title": "Load the context behind a player session",
      "summary": "Read a player document by key. Keep session authorization in the application and choose read consistency according to the business action.",
      "nodes": [
        [
          "Player",
          "Synthetic player-042",
          "gamepad-2",
          "amber"
        ],
        [
          "Game application",
          "Authorizes the request",
          "app-window",
          "violet"
        ],
        [
          "Player table",
          "Profile document",
          "database",
          "teal"
        ]
      ],
      "edges": [
        "Session request",
        "Read by key"
      ],
      "note": "A profile read does not authorize a purchase or establish a globally consistent wallet.",
      "json": {
        "label": "JSON · illustrative outcome",
        "text": "{\n  \"playerId\": \"player-042\",\n  \"profile\": {\n    \"displayName\": \"Nova\",\n    \"level\": 8\n  }\n}",
        "prerequisites": "Synthetic fixture. This is not a response from OCI."
      },
      "sources": [
        "concepts",
        "global"
      ]
    },
    "global": {
      "id": "patterns.gaming.v1.global",
      "version": 1,
      "label": "Regional conflict",
      "title": "Make concurrent profile changes explicit",
      "summary": "Two regions update the same player row in this synthetic example. Regional replication resolves the conflict using the later write timestamp.",
      "nodes": [
        [
          "Region A",
          "Earlier write: blue theme",
          "database",
          "teal"
        ],
        [
          "Regional replication",
          "Asynchronous conflict resolution",
          "repeat-2",
          "violet"
        ],
        [
          "Region B",
          "Later write: green theme",
          "database",
          "teal"
        ]
      ],
      "edges": [
        "Earlier update",
        "Later update wins"
      ],
      "note": "The earlier blue-theme update is superseded in this example. Design high-value state around the required correctness rules.",
      "json": {
        "label": "JSON · illustrative outcome",
        "text": "{\n  \"playerId\": \"player-042\",\n  \"theme\": \"green\",\n  \"explanation\": \"Later timestamp wins after convergence\"\n}",
        "prerequisites": "Synthetic fixture. This is not a response from OCI."
      },
      "sources": [
        "concepts",
        "global"
      ]
    }
  }
};
 S.renderers.gaming=(m,h)=>h.scenarioModule(m)+window.NOSQL_SECTIONS.consistency(h);
 S.initializers.gaming=(m,h)=>{const cleanup=h.initScenarios(m);window.NOSQL_SECTIONS.initConsistency(h);return cleanup;};
})();
