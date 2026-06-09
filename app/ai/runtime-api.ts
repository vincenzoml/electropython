import { startNodeCapabilityServer } from '../../framework/node/api_server/server';

// Restricted runtime API for AI agents and local automation.
// It exposes application actions, not arbitrary developer/dev operations.
startNodeCapabilityServer(Number(process.env.ELECTROPYTHON_AGENT_PORT ?? 37621));
