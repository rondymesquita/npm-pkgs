export const jsonml = 'lib testing';

export type JSONML = Array<string | Record<string, string> | JSONML>;



export function domToJSONML(element: HTMLElement) {
  if (!element || element.nodeType !== 1) {
    return null;
  }

  const jsonml: JSONML = [element.tagName.toLowerCase(),];

  const attributes = element.attributes;
  if (attributes.length > 0) {
    const attrs: Record<string, string> = {};
    for (let i = 0; i < attributes.length; i++) {
      attrs[attributes[i].name] = attributes[i].value;
    }
    jsonml.push(attrs);
  }

  for (let i = 0; i < element.childNodes.length; i++) {
    const childJSONML = domToJSONML(element.childNodes[i] as HTMLElement);
    if (childJSONML !== null) {
      jsonml.push(childJSONML);
    }
  }

  const innerText = directInnerText(element).trim();

  innerText && jsonml.push(innerText);

  return jsonml;
}

function directInnerText(element: Element) {
  return Array.from(element.childNodes).reduce((x, y) => x + (y.nodeType == Node.TEXT_NODE ? (y as any).data : ''), '').trim();
}
