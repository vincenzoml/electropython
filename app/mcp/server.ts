import { actionRegistry } from '../logic/actions/registry';
import { registerNodeCapabilities } from '../node/startup';

registerNodeCapabilities();

// Placeholder MCP server surface.
// Implement stdio or HTTP transport here and map MCP tools to actionRegistry calls.
console.log(JSON.stringify({
  name: 'electropython-mcp',
  status: 'placeholder',
  tools: actionRegistry.listPublic().map(action => ({
    name: action.name,
    description: action.description
  }))
}, null, 2));
