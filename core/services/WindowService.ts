import { DEFAULT_SETTINGS, IPluginSettings } from "core/interfaces/PluginSettingsInterface";
import type { Plugin } from "obsidian";

export class WindowService {
    plugin: Plugin;

    constructor(plugin: Plugin) {
        this.plugin = plugin;
    }
    
 
}