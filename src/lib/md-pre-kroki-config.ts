/**
 * Kroki Inline Api Defaults
 */
const KROKI_API_PLUGINS = [
    'plantuml',
    'c4plantuml',
    'bpmn',
    'svgbob',
    'ditaa'
];
const MD_INLINE = '```';
const KROKI_API_URL = 'https://kroki.io/';


export class mdPreKrokiConfig {

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