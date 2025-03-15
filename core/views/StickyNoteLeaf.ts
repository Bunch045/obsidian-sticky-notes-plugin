import { Colors, getColorCSS } from "core/constants/colors";
import {
	ItemView,
	Menu,
	TFile,
	View,
	WorkspaceLeaf,
	setIcon,
	setTooltip,
} from "obsidian";

import { BrowserWindow } from "@electron/remote";
import { ColorMenu } from "core/menus/colorMenu";
import { LoggingService } from "core/services/LogginService";
import type StickyNotesPlugin from "main";
import { defaultSize } from "./SettingsTab";

export class StickyNoteLeaf {
	private static stickyNoteId = 0;
	public static leafsList = new Set<StickyNoteLeaf>();

	DEFAULT_DIMENSION = 300;
	DEFAULT_COLOR = Colors.YELLOW;

	id: number;
	plugin: StickyNotesPlugin;
	leaf: WorkspaceLeaf;
	view: View;
	document: Document;
	mainWindow: Electron.BrowserWindow | undefined;
	colorMenu: Menu;

	constructor(leaf: WorkspaceLeaf, plugin: StickyNotesPlugin) {
		this.leaf = leaf;
		this.plugin = plugin;
		this.view = leaf.view;
		this.document = this.leaf.getContainer().win.activeDocument;
		this.id = StickyNoteLeaf.stickyNoteId;
		StickyNoteLeaf.stickyNoteId++;
		StickyNoteLeaf.leafsList.add(this);
	}

	get title() {
		return `sticky-note-${this.id}`;
	}

	async initStickyNote(file: TFile | null = null) {
		LoggingService.info(`Init Sticky Note ${this.id} ...`);
		this.document.title = this.title;
		this.document.documentElement.setAttribute("note-id", this.title);
		this.initColorMenu();
		this.initView();
		this.initMainWindow();
		if (file) await this.leaf.openFile(file);
	}

	initView() {
		LoggingService.info("Updaing Sticky Note view");
		this.view = this.leaf.view;
		this.removeDefaultActionsMenu();
		this.removeHeader();
		this.addStickyNoteActions();
	}

	private initMainWindow() {
		const windows = BrowserWindow.getAllWindows();
		const mainWindow = windows.find((w) => w.title === this.title);
		if (!mainWindow) {
			LoggingService.warn(
				`Sticky note ${this.title} does not have an electron window`
			);
			return;
		}

		this.mainWindow = mainWindow;

		// Extract dimensions from settings
		const [width, height] = this.plugin.settingsManager.settings.dimensions
			.split("x")
			.map(Number);

		this.mainWindow.setSize(
			width || this.DEFAULT_DIMENSION,
			height || this.DEFAULT_DIMENSION
		);
		this.mainWindow.setResizable(true);

		if (
			this.plugin.settingsManager.settings.defaultSize ===
			defaultSize.rememberLastDimension
		) {
			// Save updated dimensions when resized
			this.mainWindow.on("resize", () => this.saveDimensions());
		}

		this.pinAction(true);
	}

	private saveDimensions() {
		if (!this.mainWindow) return;

		const [width, height] = this.mainWindow.getSize();
		const newDimensions = `${width}x${height}`;

		this.plugin.settingsManager.settings.dimensions = newDimensions;
		this.plugin.settingsManager.saveSettings(this.plugin.settingsManager.settings);

		LoggingService.info(`Updated dimensions saved: ${newDimensions}`);
	}

	private removeDefaultActionsMenu() {
		const actionsEl = this.view.containerEl.querySelector(".view-actions");
		const leftAcionsEl =
			this.view.containerEl.querySelector(".view-header-left");
		actionsEl?.empty();
		leftAcionsEl?.empty();
	}

	private removeHeader() {
		const headerEl = this.document.querySelector(
			".workspace-tab-header-container"
		);
		const titleEl = this.document.querySelector(".titlebar");
		headerEl?.remove();
		titleEl?.empty();
	}

	private addStickyNoteActions() {
		if (!(this.view instanceof ItemView)) return;
		const headerContainerEl = this.document.querySelector<HTMLElement>(
			".view-header-title-container"
		);
		headerContainerEl?.setCssProps({
			"app-region": "drag",
			"-webkit-app-region": "drag",
		});
		this.view
			.addAction("x", "Close", () => this.leaf.detach())
			.addClass("sticky-note-button");
		this.view
			.addAction("minus", "Minimize", () => this.mainWindow?.minimize())
			.addClass("sticky-note-button");
		this.view
			.addAction(
				this.mainWindow?.isAlwaysOnTop() ? "pin-off" : "pin",
				"Pin",
				() => this.pinAction()
			)
			.addClasses(["pinButton", "sticky-note-button"]);
		this.view
			.addAction("palette", "Color", (event) =>
				this.colorMenu.showAtMouseEvent(event)
			)
			.addClass("sticky-note-button");
	}

	private pinAction(pin?: boolean) {
		if (!this.mainWindow) return;
		const isPinned =
			pin !== undefined ? pin : !this.mainWindow.isAlwaysOnTop();
		this.mainWindow.setAlwaysOnTop(isPinned);
		const pinButton =
			this.view.containerEl.querySelector<HTMLElement>(".pinButton");
		if (!pinButton) return;
		setIcon(pinButton, isPinned ? "pin-off" : "pin");
		setTooltip(pinButton, isPinned ? "UnPin" : "Pin");
	}

	private initColorMenu() {
		this.colorMenu = new ColorMenu(this.document.body);
		this.setDefaultColor();
	}

	private setDefaultColor() {
		this.document.body.setCssProps({
			"--background-primary": getColorCSS(this.DEFAULT_COLOR),
		});
	}
}
