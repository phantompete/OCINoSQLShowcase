/* Original social stories, adapted to the shared V2 renderer. */
(() => {
 const S=window.SERVICE;
 S.workloads.social={
  "label": "Social",
  "summary": "Evolve member profiles with clear visibility rules.",
  "sources": [
    "concepts",
    "global",
    "security"
  ],
  "help": {
    "Illustrative workload": "A synthetic application design, not a deployed solution or measured performance result.",
    "JSON document": "Flexible data stored inside a typed JSON column; primary-key and access design still apply.",
    "Regional freshness": "A nearby regional replica may not yet include a recent change from another region."
  },
  "panelTitle": "Social · flexible profiles, local access",
  "panelSummary": "",
  "pillar": "Application story · illustrative",
  "badge": "Synthetic data",
  "renderer": "social",
  "benefits": [
    "Add optional profile fields without flattening every attribute.",
    "Use local regional access for distributed application audiences."
  ],
  "considerations": [
    "Privacy and visibility filtering belong in the authorized application path.",
    "Design indexes and conflict handling; this is not a complete social-feed engine."
  ],
  "scenarios": {
    "profile": {
      "id": "patterns.social.v1.profile",
      "version": 1,
      "label": "Flexible profiles",
      "title": "Let profile details evolve with the product",
      "summary": "Keep a stable identity key while storing optional profile attributes in JSON. Your application still validates fields and enforces visibility.",
      "nodes": [
        [
          "Member",
          "Synthetic member-008",
          "users",
          "amber"
        ],
        [
          "Social application",
          "Visibility and validation",
          "shield-check",
          "violet"
        ],
        [
          "Profile document",
          "Typed key + JSON fields",
          "file-json",
          "teal"
        ]
      ],
      "edges": [
        "Profile request",
        "Authorized data access"
      ],
      "note": "Flexible JSON accommodates optional fields. It does not remove access checks or the need to design indexes for query paths.",
      "json": {
        "label": "JSON · illustrative outcome",
        "text": "{\n  \"memberId\": \"member-008\",\n  \"profile\": {\n    \"name\": \"Ari\",\n    \"interests\": [\n      \"cycling\",\n      \"photography\"\n    ]\n  }\n}",
        "prerequisites": "Synthetic fixture. This is not a response from OCI."
      },
      "sources": [
        "concepts",
        "global",
        "security"
      ]
    },
    "regional": {
      "id": "patterns.social.v1.regional",
      "version": 1,
      "label": "Local regional access",
      "title": "Serve a traveling member closer to home",
      "summary": "A regional replica lets the application read and write near a member. A recent change made elsewhere may take time to appear.",
      "nodes": [
        [
          "Traveling member",
          "Application selects a region",
          "users",
          "amber"
        ],
        [
          "Nearby replica",
          "Local read / write",
          "database",
          "teal"
        ],
        [
          "Other region",
          "Replicated profile",
          "database",
          "teal"
        ]
      ],
      "edges": [
        "Regional request",
        "Asynchronous replication"
      ],
      "note": "Application routing selects the endpoint. Global Active Tables do not automatically route a traveling user.",
      "json": {
        "label": "JSON · illustrative outcome",
        "text": "{\n  \"memberId\": \"member-008\",\n  \"view\": \"Nearby regional replica\",\n  \"freshness\": \"Remote changes eventually converge\"\n}",
        "prerequisites": "Synthetic fixture. This is not a response from OCI."
      },
      "sources": [
        "concepts",
        "global",
        "security"
      ]
    }
  }
};
 S.renderers.social=(m,h)=>h.scenarioModule(m);
 S.initializers.social=(m,h)=>{const cleanup=h.initScenarios(m);return cleanup;};
})();
