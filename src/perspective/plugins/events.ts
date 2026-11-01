export function dispatchSelection(element: HTMLElement, row: Record<string, unknown>, column: string, filter?: unknown[]) {
  const viewer = element.closest("perspective-viewer")!;
  viewer.dispatchEvent(new CustomEvent("perspective-click", {
    bubbles: true, composed: true,
    detail: { row, column_names: [column], config: { filter: filter ?? [[column, "==", row[column]]] } }
  }));
}
