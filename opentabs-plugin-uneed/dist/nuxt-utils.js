export function extractNuxtData(html, ...keys) {
    const match = html.match(/<script type="application\/json" data-nuxt-data[^>]*>([\s\S]*?)<\/script>/);
    if (!match)
        return null;
    let data;
    try {
        data = JSON.parse(match[1]);
    }
    catch {
        return null;
    }
    if (!Array.isArray(data) || data.length < 4)
        return null;
    const routeData = data[3];
    if (!routeData || typeof routeData !== 'object')
        return null;
    for (const key of keys) {
        if (key in routeData) {
            const idx = routeData[key];
            if (typeof idx === 'number') {
                return resolveNuxtRef(data, idx);
            }
        }
    }
    return null;
}
function resolveNuxtRef(data, index) {
    const val = data[index];
    if (val === null || val === undefined)
        return val;
    if (typeof val === 'number')
        return resolveNuxtRef(data, val);
    if (typeof val === 'string' || typeof val === 'boolean')
        return val;
    if (Array.isArray(val)) {
        return val.map(v => typeof v === 'number' ? resolveNuxtRef(data, v) : v);
    }
    if (typeof val === 'object') {
        const result = {};
        for (const [k, v] of Object.entries(val)) {
            if (k === '__ob__' || k === '__v_isRef')
                continue;
            result[k] = typeof v === 'number' ? resolveNuxtRef(data, v) : v;
        }
        return result;
    }
    return val;
}
export function searchDataByKeyword(data, keyword, limit = 10) {
    const results = [];
    const lower = keyword.toLowerCase();
    for (let i = 0; i < data.length; i++) {
        const val = resolveNuxtRef(data, i);
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            const str = JSON.stringify(val).toLowerCase();
            if (str.includes(lower)) {
                if (val.name || val.title || val.body) {
                    results.push(val);
                    if (results.length >= limit * 5)
                        break;
                }
            }
        }
    }
    return results.slice(0, limit);
}
//# sourceMappingURL=nuxt-utils.js.map