"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnattended = void 0;
const AIClient_1 = require("@civ-clone/core-ai-client/AIClient");
/**
 * Whether nobody is playing: every client is a computer player's (the arena, a headless run). True with no clients at
 * all. A host with a client of its own that isn't an `AIClient` counts as someone playing.
 */
const isUnattended = (clientRegistry) => clientRegistry
    .entries()
    .every((client) => client instanceof AIClient_1.default);
exports.isUnattended = isUnattended;
exports.default = exports.isUnattended;
//# sourceMappingURL=unattended.js.map