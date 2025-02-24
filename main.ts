import { LoggingService } from "core/services/LogginService";
import { StickyNoteManager } from "core/views/StickyNoteManager";
import {
	Menu,
	Plugin,
	setTooltip,
	TFile,
	WorkspaceLeaf,
	WorkspaceWindow,
} from "obsidian";

//--------- I have two options:
//-> only open sticky note views for editor views (that means the user can't open a sticky ntoe for a graph view for example)
//-> allow the user to open anything as a sticky note window <--- this is better. //no need for a custom view

export default class StickyNotesPlugin extends Plugin {

	leafList = new Set<WorkspaceLeaf>();

	async onload() {
		LoggingService.enable();
		LoggingService.info("plugin loading....");

		this.addStickyNoteRibbonAction();
		this.addStickNoteCommand();
		this.addStickyNoteMenuOptions();
		this.addPopoutClosedListner();
		this.addLeafChangeListner();
	}

	onunload() {
		LoggingService.info("plugin UN-loading ....");
		this.destroyAllStickyNotes();
	}

	private destroyAllStickyNotes() {
		this.leafList.forEach(l => l.detach())
	}

	private addStickNoteCommand() {
		this.addCommand({
			id: "open-sticky-note-view",
			name: "Open Sticky Note Window",
			icon: "sticky-note",
			callback: () => this.openStickyNotePopup(),
		});
	}

	private addStickyNoteRibbonAction() {
		const stickyNoteRibbon = this.addRibbonIcon(
			"sticky-note",
			"Open Sticky Note",
			() => this.openStickyNotePopup()
		);

		setTooltip(stickyNoteRibbon, "StickyNote Popup");
	}

	private addStickyNoteMenuOptions() {
		const fileMenuEvent = this.app.workspace.on(
			"file-menu",
			(menu, file) =>
				file instanceof TFile && this.addStickyNoteMenuItem(menu, file)
		);
		const editorMenuEvent = this.app.workspace.on(
			"editor-menu",
			(menu, editor, view) => this.addStickyNoteMenuItem(menu, view.file)
		);
		this.registerEvent(fileMenuEvent);
		this.registerEvent(editorMenuEvent);
	}

	private addStickyNoteMenuItem(menu: Menu, file: TFile | null) {
		menu.addItem((item) => {
			item.setTitle("Open Sticky Note")
				.setIcon("sticky-note")
				.onClick(() => this.openStickyNotePopup(file));
		});
	}

	private addPopoutClosedListner() {
		const closeEvent = this.app.workspace.on('window-close', (win: WorkspaceWindow, window: Window) => {
			const noteId = win.doc.documentElement.getAttribute('note-id');
			if (noteId) {
				StickyNoteManager.removeBrowserWindow(noteId);
			}
		});
		this.registerEvent(closeEvent);
	}

	private addLeafChangeListner() {
		const leafChangeEvent = this.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf | null) => {
			const noteId = leaf?.getContainer().win.activeDocument.documentElement.getAttribute('note-id');
			if (noteId && leaf) StickyNoteManager.initView(leaf, noteId);
		})
		this.registerEvent(leafChangeEvent);
	}

	private async openStickyNotePopup(file: TFile | null = null) {
		LoggingService.info("Opened Sticky Note Popup");
		file = file ?? this.app.workspace.getActiveFile();
		const popoutLeaf = this.app.workspace.openPopoutLeaf({
			size: {
				height: 300,
				width: 300,
			},
		});
		StickyNoteManager.initStickyNote(popoutLeaf);
		if (file) await popoutLeaf.openFile(file); 
		this.leafList.add(popoutLeaf);
	}
}
