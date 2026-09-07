const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// Valores como "null"/"undefined" chegam à URL ou ao localStorage após
// redirecionamentos quebrados e, se fossem aceitos, quebrariam o app.
const isInvalidParamValue = (v) => !v || v === "null" || v === "undefined";

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	const hasValidSearchParam = !isInvalidParamValue(searchParam);
	if (hasValidSearchParam || removeFromUrl || (searchParam && !hasValidSearchParam)) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (hasValidSearchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (!isInvalidParamValue(defaultValue)) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (!isInvalidParamValue(storedValue)) {
		return storedValue;
	}
	if (storedValue) {
		storage.removeItem(storageKey); // limpa valor poluído salvo no navegador
	}
	return null;
}

// Quando o site é hospedado fora da Base44 (ex.: GitHub Pages), não existe o
// proxy /api local — autenticação e dados precisam apontar para o backend
// publicado do app. Dentro da Base44 (ou em dev local) o proxy existe e o
// caminho relativo continua sendo usado.
const resolveAppBaseUrl = () => {
	const configured = getAppParamValue("app_base_url", { defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL });
	if (configured) return configured;
	if (!isNode && typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname || "")) {
		return "https://ssr-connect.base44.app";
	}
	return null;
};

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION }),
		appBaseUrl: resolveAppBaseUrl(),
	}
}


export const appParams = {
	...getAppParams()
}