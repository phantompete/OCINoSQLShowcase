# OCI NoSQL service showcase

For application teams evaluating Oracle NoSQL Database Cloud Service, this interactive showcase connects data design to IoT, gaming and social experiences. Explore regional access, capacity choices and operational responsibilities before deciding how a workload should use NoSQL tables and JSON documents.

## Explore the core decisions

- **Overview:** Explore flexible rows, table throughput and regional reach, then follow people and devices through the application to a NoSQL table and choose a story.
- **Availability & scale:** Compare regional tables, Global Active Tables, provisioned or on-demand throughput, and a dedicated hosted environment.
- **Data protection & disaster recovery:** Distinguish application redirection to a regional replica from recovery using a retained export, including validation and ownership.
- **Migration & modernization:** Explore file import, an Oracle NoSQL source and phased application adoption, with validation before cutover.
- **Observability & operations:** Detect, investigate and improve with table metrics, application evidence and a concise response runbook.
- **Security & governance:** Explore IAM, transport encryption, encryption at rest and data lifecycle responsibilities, including the prerequisites for customer-managed keys.

## Workload patterns

- **IoT · device readings:** Follow device readings into an application-owned ingestion path, then explore row expiry and separate archival needs.
- **Gaming · player profiles:** Choose local read consistency and inspect a concurrent regional overwrite without assuming one worldwide transaction boundary.
- **Social · member profiles:** Explore flexible profile documents and local regional access for a traveling member.

## Open and explore

Open [index.html](index.html) in a current Chrome, Edge, Firefox or Safari browser. Keep the supplied scripts and styles beside it. No installation, account, credentials or internet connection is needed for the walkthroughs. Official documentation links require internet access.

Choose a section in the sidebar, or use **Menu** on a narrow screen. Workload patterns has a second selector for IoT, gaming and social. Bookmark `#patterns/iot`, `#patterns/gaming` or `#patterns/social` to reopen a story.

In Recovery and Migration, use **Next step**, **Reset** and **Play/Pause** to explore the walkthroughs. Workload stories and operating-loop choices switch directly; Gaming also offers an independent read-consistency selector. Arrow keys, Home and End operate the selectors. Reduced-motion settings disable timed playback while preserving manual steps. **About this page** opens definitions and source links; Escape closes the popup or navigation drawer.

Examples and displayed SQL, JSON, commands and metric values are illustrative. Presentation controls do not send service requests.

For an optional local preview, with Node.js 22 or later, run from this directory:

```sh
node tools/serve.mjs
```

Open [the local preview](http://127.0.0.1:8796/). Stop it with Ctrl+C.
