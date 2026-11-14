import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
/**
 * Whether nobody is playing: every client is a computer player's (the arena, a headless run). True with no clients at
 * all. A host with a client of its own that isn't an `AIClient` counts as someone playing.
 */
export declare const isUnattended: (clientRegistry: ClientRegistry) => boolean;
export default isUnattended;
