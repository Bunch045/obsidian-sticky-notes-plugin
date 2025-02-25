// import { DEFAULT_SETTINGS, IPluginSettings } from "core/interfaces/PluginSettingsInterface";
// import type { Plugin } from "obsidian";

// export class SettingService {
//     plugin: Plugin;
// 	settings: IPluginSettings;

//     constructor(plugin: Plugin) {
//         this.plugin = plugin;
//     }
    
// 	async loadSettings() {
// 		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData());
// 	}

// 	async saveSettings() {
// 		await this.plugin.saveData(this.settings);
// 	}
// }