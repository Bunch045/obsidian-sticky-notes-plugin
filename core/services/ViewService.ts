import type { Plugin, ViewCreator } from "obsidian";

export class ViewService {
	plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
	}

	registerView(type: string, creator: ViewCreator) {
		this.plugin.registerView(type, creator);
	}
}
