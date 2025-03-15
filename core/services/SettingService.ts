import { DEFAULT_SETTINGS, IPluginSettings } from "core/interfaces/PluginSettingsInterface";

import type StickyNotesPlugin from "main";

export class SettingService {
    plugin: StickyNotesPlugin;
	settings: IPluginSettings;

    constructor(plugin: StickyNotesPlugin) {
        this.plugin = plugin;
		this.loadSettings();
    }
    
	async loadSettings() {
		this.settings = await Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData());
		this.plugin.globalSettings = this.settings;
	}

	async saveSettings() {
		await this.plugin.saveData(this.settings);
	}
}