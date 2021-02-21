"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdPreKrokiConfig = void 0;
/**
 * Kroki Inline Api Defaults
 */
const KROKI_API_PLUGINS = [
    'plantuml',
    'c4plantuml',
    'bpmn',
    'svgbob'
];
const MD_INLINE = '```';
const KROKI_API_URL = 'https://kroki.io/';
class mdPreKrokiConfig {
    static get apiPlugins() {
        return KROKI_API_PLUGINS;
    }
    static get mdInlne() {
        return MD_INLINE;
    }
    static get apiUrl() {
        return KROKI_API_URL;
    }
}
exports.mdPreKrokiConfig = mdPreKrokiConfig;
