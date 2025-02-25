import { BrowserWindow } from "@electron/remote";
import { COLORS } from "core/constants/colors";
import { LoggingService } from "core/services/LogginService";
import {
	ItemView,
	Menu,
	setIcon,
	setTooltip,
	TFile,
	View,
	WorkspaceLeaf,
} from "obsidian";

export class StickyNoteLeaf {
	private static stickyNoteId = 0;
	public static leafsList = new Set<StickyNoteLeaf>();


	id: number;
	leaf: WorkspaceLeaf;
	view: View;
	document: Document;
	mainWindow: Electron.BrowserWindow | undefined;
	colorMenu: Menu;

	constructor(leaf: WorkspaceLeaf) {
		this.leaf = leaf;
		this.view = leaf.view;
		this.document = this.leaf.getContainer().win.activeDocument;
		this.id = StickyNoteLeaf.stickyNoteId;
		StickyNoteLeaf.stickyNoteId++;
        StickyNoteLeaf.leafsList.add(this);
	}

	get title() {
		return `sticky-note-${this.id}`;
	}

	async initStickyNote(file: TFile|null = null) {
		LoggingService.info(`Init Sticky Note ${this.id} ...`);
		this.document.title = this.title;
		this.document.documentElement.setAttribute("note-id", this.title);
		this.buildColorMenu();
		this.initMainWindow();
		this.initView();
        if (file) await this.leaf.openFile(file);
	}

	initView() {
        LoggingService.info("Updaing Sticky Note view")
        this.view = this.leaf.view;
		this.removeDefaultActionsMenu();
		this.removeHeader();
		this.addStickyNoteActions();
		this.pinAction(true);
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
		this.mainWindow.setSize(300, 300);
		this.mainWindow.setResizable(false);
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
		this.view.addAction("x", "Close", () => this.leaf.detach());
		this.view.addAction("minus", "Minimize", () =>
			this.mainWindow?.minimize()
		);
		this.view
			.addAction("pin", "Pin", () => this.pinAction())
			.addClass("pinButton");
		this.view.addAction("palette", "Color", (event) =>
			this.colorMenu.showAtMouseEvent(event)
		);
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

	private buildColorMenu() {
		this.colorMenu = new Menu();

		const defaultColor = this.document.body.style.getPropertyValue(
			"--background-primary"
		);

		this.colorMenu.addItem((item) =>
			item
				.setTitle("DEFAULT")
				.onClick(() =>
					this.document.body.style.setProperty(
						"--background-primary",
						defaultColor
					)
				)
		);

		for (const color of COLORS) {
			this.colorMenu.addItem((item) =>
				item
					.setTitle(color.label)
					.onClick(() =>
						this.document.body.style.setProperty(
							"--background-primary",
							`rgb(${color.color})`
						)
					)
			);
		}

		this.document.body.style.setProperty(
			"--background-primary",
			`rgba(250, 240, 208)`
		);
	}
}
