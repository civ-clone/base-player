import AIClient from '@civ-clone/core-ai-client/AIClient';
import Client from '@civ-clone/core-client/Client';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';

/**
 * Whether nobody is playing: every client is a computer player's (the arena, a headless run). True with no clients at
 * all. A host with a client of its own that isn't an `AIClient` counts as someone playing.
 */
export const isUnattended = (clientRegistry: ClientRegistry): boolean =>
  clientRegistry
    .entries()
    .every((client: Client): boolean => client instanceof AIClient);

export default isUnattended;
