/* Original walkthrough states rendered with the V2 diagram primitives. */
window.NOSQL_VISUALS = {
  staged(fixture) {
    return (step, h) => {
      const state = fixture.stages[step];
      const nodes = fixture.nodes.map((node, i) => [node[0], state.statuses[i], node[2], node[3]]);
      if (fixture.id !== 'recovery.regional.v1') return h.flow(nodes, state.active, fixture.edges);
      const interrupted = state.broken || (state.redirected && state.statuses[1].includes('Unreachable'));
      const route = state.broken ? 'Region A connection interrupted → retry / routing policy' : state.redirected ? 'Application → Region B endpoint' : 'Application → Region A endpoint';
      const routes = [state.broken ? 'Connection interrupted · retry' : !state.redirected ? 'Selected application route' : 'Not selected by this application', state.redirected ? 'Selected application route' : 'Available alternative route'];
      return `<div class="regional-recovery" role="group" aria-label="Application routing to two stationary regional endpoints">
        ${h.flow([nodes[0]], state.active === 0 ? 0 : -1)}
        <div class="regional-endpoints">${nodes.slice(1).map((node, i) => `<div class="regional-endpoint ${interrupted && i === 0 ? 'interrupted' : ''}"><p class="routing">${h.escape(routes[i])}</p>${h.flow([node], state.active === i + 1 ? 0 : -1)}</div>`).join('')}</div>
        <p class="diagram-caption">Asynchronous regional replication${interrupted ? ' · connectivity disrupted in this scenario' : ' · reads and writes are local to each region'}</p>
        <p class="note">Application route: ${h.escape(route)} · endpoint labels remain unchanged.</p>
      </div>`;
    };
  }
};
