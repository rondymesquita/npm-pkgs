import { EventHandler } from '../event-bus/event-bus';
import { Tag } from './tag.model';

export type Attrs<K extends Tag> = Omit<Partial<HTMLElementTagNameMap[K]>, 'style'> & {
  watch?: Array<EventHandler>,
  style?: Partial<CSSStyleDeclaration>,
}
