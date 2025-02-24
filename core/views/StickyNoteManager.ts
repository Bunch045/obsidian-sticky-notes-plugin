// import { LoggingService } from "core/services/LogginService";
// import {
// 	ItemView,
// 	Menu,
// 	setIcon,
// 	setTooltip,
// 	View,
// 	WorkspaceLeaf,
// } from "obsidian";
// import { BrowserWindow } from "@electron/remote";
// import { COLORS } from "core/constants/colors";

// //I FUCKING HATE THIS!!!
// export class StickyNoteManager {
// 	// private static stickNoteId = 0;
// 	// private static stickyNoteWindowMap = new Map<
// 	// 	string,
// 	// 	Electron.BrowserWindow
// 	// >([]);

// 	static initStickyNote(leaf: WorkspaceLeaf) {
// 		// LoggingService.info(`Init Sticky Note ${this.stickNoteId} ...`);
// 		// const noteId = `sticky-note-${this.stickNoteId}`;
// 		// const activeDocument = leaf.getContainer().win.activeDocument;
// 		// activeDocument.title = noteId;
// 		// activeDocument.documentElement.setAttribute("note-id", noteId);
// 		// this.addBrowserWindow(noteId);
// 		// this.initView(leaf, noteId);
// 		// this.buildMenu(activeDocument.body);
// 		// this.setToYellowColor(activeDocument.body);
// 		// this.stickNoteId++;
// 	}

// 	// static initView(leaf: WorkspaceLeaf, noteId: string) {
// 	// 	const view = leaf.view;
// 	// 	this.removeDefaultActionsMenu(view);
// 	// 	this.removeHeader(leaf);
// 	// 	if (view instanceof ItemView) {
// 	// 		this.addStickyNoteActions(leaf, view, noteId);
// 	// 		this.pinAction(view, noteId, true);
// 	// 	}
// 	// }

// 	// static removeBrowserWindow(noteId: string) {
// 	// 	this.stickyNoteWindowMap.delete(noteId);
// 	// }

// 	// private static removeDefaultActionsMenu<T extends View>(view: T) {
// 	// 	const actionsEl = view.containerEl.querySelector(".view-actions");
// 	// 	const leftAcionsEl =
// 	// 		view.containerEl.querySelector(".view-header-left");
// 	// 	actionsEl?.empty();
// 	// 	leftAcionsEl?.empty();
// 	// }

// 	// private static removeHeader(leaf: WorkspaceLeaf) {
// 	// 	const headerEl = leaf
// 	// 		.getContainer()
// 	// 		.win.activeDocument.querySelector(
// 	// 			".workspace-tab-header-container"
// 	// 		);
// 	// 	const titleEl = leaf
// 	// 		.getContainer()
// 	// 		.win.activeDocument.querySelector(".titlebar");
// 	// 	headerEl?.remove();
// 	// 	titleEl?.empty();
// 	// }

// 	// private static addStickyNoteActions<T extends ItemView>(
// 	// 	leaf: WorkspaceLeaf,
// 	// 	view: T,
// 	// 	noteId: string
// 	// ) {
// 	// 	const activeDocument = leaf.getContainer().win.activeDocument;
// 	// 	const headerContainerEl = activeDocument.querySelector<HTMLElement>(
// 	// 		".view-header-title-container"
// 	// 	);
// 	// 	headerContainerEl?.setCssProps({
// 	// 		"app-region": "drag",
// 	// 		"-webkit-app-region": "drag",
// 	// 	});
// 	// 	view.addAction("x", "Close", () => leaf.detach());
// 	// 	view.addAction("minus", "Minimize", () => this.minimizeAction(noteId));
// 	// 	view.addAction("pin", "Pin", () =>
// 	// 		this.pinAction(view, noteId)
// 	// 	).addClass("pinButton");
// 	// 	view.addAction("palette", "Color", (event) => {
// 	// 		const colorMenu = this.buildMenu(activeDocument.body);
// 	// 		colorMenu.showAtMouseEvent(event);
// 	// 	});
// 	// }

// 	// private static addBrowserWindow(viewTitle: string) {
// 	// 	const windows = BrowserWindow.getAllWindows();
// 	// 	const stickyWindow = windows.find((w) => w.title === viewTitle);
// 	// 	if (!stickyWindow) {
// 	// 		LoggingService.warn(
// 	// 			`Sticky note ${viewTitle} does not have an electron window`
// 	// 		);
// 	// 		return;
// 	// 	}
// 	// 	this.stickyNoteWindowMap.set(viewTitle, stickyWindow);
// 	// 	this.initWindow(stickyWindow);
// 	// }

// 	// private static pinAction(view: ItemView, viewTitle: string, pin?: boolean) {
// 	// 	const activeWindow = this.stickyNoteWindowMap.get(viewTitle);
// 	// 	if (!activeWindow) return;
// 	// 	const isPinned =
// 	// 		pin !== undefined ? pin : !activeWindow.isAlwaysOnTop();
// 	// 	activeWindow.setAlwaysOnTop(isPinned);
// 	// 	const pinButton =
// 	// 		view.containerEl.querySelector<HTMLElement>(".pinButton");
// 	// 	if (!pinButton) return;
// 	// 	setIcon(pinButton, isPinned ? "pin-off" : "pin");
// 	// 	setTooltip(pinButton, isPinned ? "UnPin" : "Pin");
// 	// }

// 	private static minimizeAction(viewTitle: string) {
// 		const activeWindow = this.stickyNoteWindowMap.get(viewTitle);
// 		if (!activeWindow) return;
// 		activeWindow.minimize();
// 	}

// 	// private static buildMenu(body: HTMLElement) {
// 	// 	const menu = new Menu();

// 	// 	document.documentElement.style.setProperty("--my-variable", "red");
// 	// 	const defaultColor = body.style.getPropertyValue(
// 	// 		"--background-primary"
// 	// 	);
// 	// 	menu.addItem((item) =>
// 	// 		item
// 	// 			.setTitle("DEFAULT")
// 	// 			.onClick(() =>
// 	// 				body.style.setProperty("--background-primary", defaultColor)
// 	// 			)
// 	// 	);

// 	// 	for (const color of COLORS) {
// 	// 		menu.addItem((item) =>
// 	// 			item
// 	// 				.setTitle(color.label)
// 	// 				.onClick(() =>
// 	// 					body.style.setProperty(
// 	// 						"--background-primary",
// 	// 						`rgba(var(${color.color}), 0.04)`
// 	// 					)
// 	// 				)
// 	// 		);
// 	// 	}

// 	// 	return menu;
// 	// }

// 	private static setToYellowColor(body: HTMLElement) {
// 		body.style.setProperty(
// 			"--background-primary",
// 			`rgba(var(--color-yellow-rgb), 0.04)`
// 		);
// 	}

// 	private static initWindow(window: Electron.BrowserWindow) {
// 		LoggingService.info("initing sticky note window ...");
// 		window.setSize(300, 300);
// 		window.setResizable(false);
// 	}
// }
