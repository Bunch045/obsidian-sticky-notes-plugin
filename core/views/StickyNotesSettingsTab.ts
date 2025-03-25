import {
	App,
	Notice,
	PluginSettingTab,
	Setting,
	TextComponent,
	ToggleComponent,
} from "obsidian";

import { SettingService } from "core/services/SettingService";
import { SizeOptions } from "core/enums/sizeOptionEnum";
import type StickyNotesPlugin from "main";

export class StickyNotesSettingsTab extends PluginSettingTab {
	settingService: SettingService;
	dimensionTextSetting: TextComponent;
	resizableSettingContainer: ToggleComponent;

	constructor(
		app: App,
		plugin: StickyNotesPlugin,
		settingService: SettingService
	) {
		super(app, plugin);
		this.settingService = settingService;
	}

	async display(): Promise<void> {
		this.containerEl.empty();

		if (!this.settingService.settings) {
			this.containerEl.createEl("p", {
				text: "falied-to-load-settings",
			});
			return;
		}

		this.addSizeSetting();

		this.addResizableSetting();
	}

	addSizeSetting() {
		return new Setting(this.containerEl)
			.setName("Default size")
			.setDesc(
				"Select what default size each new sticky note window should take."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						Object.fromEntries(
							Object.values(SizeOptions).map((value) => [
								value,
								value,
							])
						)
					)
					.setValue(this.settingService.settings.sizeOption)
					.onChange(async (value) => {
						this.settingService.updateSettings({
							sizeOption: value as SizeOptions,
						});
						this.dimensionTextSetting?.setDisabled(
							value !== SizeOptions.CUSTOM
						);
						if (value === SizeOptions.DEFAULT) {
							this.settingService.updateWindowDimensions(
								300,
								300
							);
							this.dimensionTextSetting.setValue(
								this.settingService.settings.dimensions
							);
						}
						if (value === SizeOptions.REMEMBER_LAST) {
							this.settingService.updateSettings({
								resizable: true,
							});
							this.resizableSettingContainer.setValue(true);
							this.resizableSettingContainer.setDisabled(true);
						} else {
							this.resizableSettingContainer.setDisabled(false);
						}
					})
			)
			.addText((text) => {
				this.dimensionTextSetting = text
					.setPlaceholder("eg.: 300x300")
					.setValue(this.settingService.settings.dimensions)
					.onChange(async (value) => {
						let newDimensions = "300x300";
						if (value.trim() === "") {
							newDimensions = "300x300";
						} else if (value.match(/^\d+x\d+$/)) {
							newDimensions = value;
						} else {
							new Notice("Invalid number");
							return;
						}
						await this.settingService.updateSettings({
							dimensions: newDimensions,
						});
					})
					.setDisabled(
						this.settingService.settings.sizeOption !==
							SizeOptions.CUSTOM
					);
				return this.dimensionTextSetting;
			});
	}

	addResizableSetting() {
		return new Setting(this.containerEl)
			.setName("Resizable Window")
			.setDesc("Enable or disable window resizing for new sticky notes.")
			.addToggle(
				(toggle) =>
					(this.resizableSettingContainer = toggle
						.setValue(this.settingService.settings.resizable || this.settingService.settings.sizeOption === SizeOptions.REMEMBER_LAST)
						.onChange(async (value) => {
							await this.settingService.updateSettings({
								resizable: value,
							});
						})
						.setDisabled(
							this.settingService.settings.sizeOption ===
								SizeOptions.REMEMBER_LAST
						))
			);
	}
}
