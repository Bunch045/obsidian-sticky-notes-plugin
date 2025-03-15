import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import {
	DEFAULT_SETTINGS,
	IPluginSettings,
} from "core/interfaces/PluginSettingsInterface";

import { SettingService } from "core/services/SettingService";
import type StickyNotesPlugin from "main";

export enum defaultSize {
	Default = "default",
	Custom = "custom",
	rememberLastDimension = "rememberLastDimension",
}

export class StickyNotesSettingsTab extends PluginSettingTab {
	plugin: StickyNotesPlugin;

	constructor(app: App, plugin: StickyNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// Display the settings in the settings tab
	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass("StickyNotesSettingsTab");

		if (!this.plugin.globalSettings) {
			containerEl.createEl("p", {
				text: "falied-to-load-settings",
			});
			return;
		}

		new Setting(containerEl)
			.setName("Default size")
			.setDesc("Select what default size each new sticky notes window should take.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						[defaultSize.Default]: "Default",
						[defaultSize.rememberLastDimension]:
							"Remember last size",
						[defaultSize.Custom]: "Custom",
					})
					.setValue(this.plugin.globalSettings?.defaultSize)
					.onChange(async (value) => {
						this.plugin.globalSettings.defaultSize = value as defaultSize;
						await this.plugin.settingsManager.saveSettings(this.plugin.globalSettings);
						demensionsSetting.setDisabled(value !== defaultSize.Custom);
					})
			);

		const demensionsSetting = new Setting(containerEl)
			.setName("Custom dimensions")
			.setDesc(
				"Set the default dimensions for the sticky notes window. Use the format 'widthxheight'."
			)
			.addText((text) =>
				text
					.setPlaceholder("eg.: 300x300")
					.setValue(
						this.plugin.globalSettings.dimensions.toString() || ""
					)
					.onChange(async (value) => {
						if (value.trim() === "") {
							this.plugin.globalSettings.dimensions = '300x300';
						} else if (value.match(/^\d+x\d+$/)) {
							this.plugin.globalSettings.dimensions = value;
						} else {
							new Notice("Invalid number");
							return;
						}
						await this.plugin.settingsManager.saveSettings(this.plugin.globalSettings);
					})
			)
			.setDisabled(this.plugin.globalSettings.defaultSize !== defaultSize.Custom);
	}
}
