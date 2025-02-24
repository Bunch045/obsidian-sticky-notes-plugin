// import { MarkdownView, setIcon, setTooltip, WorkspaceLeaf } from "obsidian";
// import {
// 	BrowserWindow,
// } from "@electron/remote";
// import { LoggingService } from "core/services/LogginService";

// export const STICKY_NOTE_VIEW_ID = "sticky-note-view";


// export class StickyNoteView extends MarkdownView { 
// 	browserWindow: Electron.BrowserWindow;
// 	isPinned = false;
// 	pinActionElement: HTMLElement;

// 	// constructor(leaf: WorkspaceLeaf) {
// 	// 	super(leaf);
// 	// 	this.leaf = leaf;
// 	// }

// 	getViewType() {
// 		return STICKY_NOTE_VIEW_ID;
// 	}

// 	getDisplayText() {
// 		return "Custom Popout";
// 	}

// 	async onOpen() {
// 		await super.onOpen();
// 		LoggingService.info("Sticky Note View opening ...");
// 		this.isPinned = false;
// 		const activeWindow = this.containerEl.win.activeWindow;
// 		activeWindow.document.title = STICKY_NOTE_VIEW_ID;

// 		const windows = BrowserWindow.getAllWindows();

// 		windows.forEach((w) => {
// 			if (
// 				w.webContents.getURL() === activeWindow.location.href &&
// 				w.title === STICKY_NOTE_VIEW_ID
// 			) {
// 				this.browserWindow = w;
// 			}
// 		});

// 		this.pinActionElement = this.addAction(
// 			"pin",
// 			"Pin Window",
// 			this.handlePinClick.bind(this)
// 		);

// 		// this.initWindow()
// 	}

// 	async onClose() {
// 		await super.onClose();
// 		LoggingService.info("Sticky Note View closing ...");
// 		// Nothing to clean up.
// 	}

// 	initWindow() {
// 		LoggingService.info("initing sticky note window ...")
// 		this.browserWindow.setSize(300, 300);
// 		this.browserWindow.setResizable(false);
// 		// this.browserWindow.setAutoHideMenuBar(true);
// 		// this.setPin(true);
// 	}

// 	handlePinClick(event: MouseEvent) {
// 		this.togglePin();
// 	}

// 	togglePin() {
// 		this.isPinned = this.browserWindow.isAlwaysOnTop();
// 		this.isPinned = !this.isPinned;
// 		this.setPin(this.isPinned);
// 	}

// 	setPin(pin: boolean) {
// 		this.isPinned = pin;
// 		this.browserWindow.setAlwaysOnTop(pin);
// 		setIcon(this.pinActionElement, pin ? "pin-off" : "pin");
// 		setTooltip(this.pinActionElement, pin ? "UnPin" : "Pin");
// 	}
// }
