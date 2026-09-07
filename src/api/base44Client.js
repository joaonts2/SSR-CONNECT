import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
// serverUrl: dentro da Base44 fica relativo (proxy /api local); fora dela
// (ex.: GitHub Pages) usa o backend absoluto para que dados e autenticação
// funcionem a partir de qualquer domínio.
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: appBaseUrl || '',
  requiresAuth: false,
  appBaseUrl
});