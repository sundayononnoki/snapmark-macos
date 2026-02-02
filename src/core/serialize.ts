import type { MarkupState } from './types';

const VERSION = 1 as const;

type Serialized = {
  version: typeof VERSION;
  state: MarkupState;
};

export function serializeMarkup(state: MarkupState): string {
  const payload: Serialized = { version: VERSION, state };
  return JSON.stringify(payload);
}

export function deserializeMarkup(json: string): MarkupState {
  const parsed = JSON.parse(json) as Partial<Serialized>;
  if (parsed.version !== VERSION || !parsed.state) {
    throw new Error('Unsupported or invalid markup format');
  }
  return parsed.state;
}
