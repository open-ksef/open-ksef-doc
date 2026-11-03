const textOf = (node: any): string =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

/** Wide docs tables scroll sideways, so each one takes keyboard focus and is named after its section heading. */
export default function focusableTables() {
  return (tree: any) => {
    let heading = '';
    const walk = (node: any) => {
      if (/^h[1-6]$/.test(node.tagName)) heading = textOf(node);
      if (node.tagName === 'table') {
        node.properties = {...node.properties, tabIndex: 0, ...(heading && {ariaLabel: heading})};
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
