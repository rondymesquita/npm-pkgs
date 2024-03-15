import { StateGetter } from '..'

export type Children = (() => Children) | StateGetter <any> | HTMLElement | Text | string | number | boolean
