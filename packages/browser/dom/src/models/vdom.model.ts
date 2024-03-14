export type VDOMArgs = Children | Attrs<any>

export type VDOMChildren = {
  type: 'TextNode' | 'HTMLElement' | 'Function',
  value: HTMLElement | Text |  string | number | Date | boolean | StateGetter<any>
}

export interface VDOM {
  tag: string
  attrs: {
    values: Map<string, any>
    events: Map<string, any>
    styles: Map<string, any>
    watchers: Map<string, any>
  }
  children: VDOMChildren[]
}
