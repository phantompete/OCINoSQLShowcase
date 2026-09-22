// Shared primitives adapted from the checksum-pinned Cache showcase.
export const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export function icon(name, tone = '') { return `<span class="card-icon ${tone}"><i data-lucide="${name}" aria-hidden="true"></i></span>`; }
export function mini(title, copy, tag, tone = '') { return `<article class="mini ${tone}"><span class="mini-tag">${escape(tag)}</span><h4>${escape(title)}</h4><p>${escape(copy)}</p></article>`; }
export function node(name, title, detail, tone = '') { return `<article class="flow-node ${tone}">${icon(name, tone)}<strong>${escape(title)}</strong><small>${escape(detail)}</small></article>`; }
export function arrow(label) { return `<div class="flow-arrow"><span aria-hidden="true"></span><small>${escape(label)}</small></div>`; }
export function flow(nodes, labels, description) { return `<div class="architecture-flow nosql-flow" role="group" aria-label="${escape(description)}">${nodes.map((n, i) => node(...n) + (labels[i] ? arrow(labels[i]) : '')).join('')}</div>`; }
export function table(rows, headers) { return `<div class="table-scroll" tabindex="0" role="region" aria-label="${escape(headers[0])} comparison"><table><thead><tr>${headers.map(h => `<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((v, i) => i ? `<td>${escape(v)}</td>` : `<th scope="row">${escape(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
export function runbook(rows) { return `<ol class="runbook">${rows.map(([heading, copy], i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div><strong>${escape(heading)}</strong><p>${escape(copy)}</p></div></li>`).join('')}</ol>`; }
export function panel(kicker, title, body, tag = '') { return `<section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">${escape(kicker)}</p><h3>${escape(title)}</h3></div>${tag ? `<span class="tag">${escape(tag)}</span>` : ''}</div>${body}</section>`; }
export function tradeoffs(benefits, considerations) { return `<section class="outcome-panel"><div><h3>Benefits</h3><ul>${benefits.map(v => `<li>${escape(v)}</li>`).join('')}</ul></div><div><h3>Considerations</h3><ul>${considerations.map(v => `<li>${escape(v)}</li>`).join('')}</ul></div></section>`; }
export function code(label, text, note) { return `<article class="code-panel"><p class="eyebrow">${escape(label)} · display only</p><pre><code>${escape(text)}</code></pre><p class="section-copy sample-note">${escape(note)}</p></article>`; }
export function tabs(id, items, selected, label) { return `<div class="segmented" role="tablist" aria-label="${escape(label)}">${items.map(([key, name]) => `<button id="${id}-${key}" class="chip${key === selected ? ' active' : ''}" role="tab" type="button" aria-selected="${key === selected}" aria-controls="${id}-panel" tabindex="${key === selected ? 0 : -1}" data-key="${key}">${escape(name)}</button>`).join('')}</div>`; }
export function bindTabs(root, select) {
  const buttons = [...root.querySelectorAll(':scope > [role="tab"]')];
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.key));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      select(buttons[next].dataset.key);
      buttons[next].focus();
    });
  });
}
export function selectTab(root, key) { root.querySelectorAll(':scope > [role="tab"]').forEach(button => { const active = button.dataset.key === key; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; }); }
export function refreshIcons() { window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } }); }
