import { LoggingService } from "core/services/LogginService";
import { StickyNoteLeaf } from "core/views/StickyNoteLeaf";
import {
	App,
	Menu,
	Plugin,
	setTooltip,
	TFile,
	Notice,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
	getFrontMatterInfo,
	TAbstractFile,
} from "obsidian";

interface StickyNotesSettings {
	noteSize: number;
	newStickyFilePath: string;
}

const DEFAULT_SETTINGS: StickyNotesSettings = {
	noteSize: 300,
	newStickyFilePath: "/Sticky Notes"
}

export default class StickyNotesPlugin extends Plugin {

	settings: StickyNotesSettings;

	private fromFileBrowser = false;
	private oldFile: TFile | null;

	async onload() {
		LoggingService.disable();
		LoggingService.info("plugin loading....");

		this.addStickyNoteRibbonAction();
		this.addStickNoteCommand();
		this.addStickyNoteMenuOptions();
		this.addLeafChangeListner();

		this.addSettingTab(new StickySettingTab(this.app, this));
		await this.loadSettings();

		//Checks for files being opened from the file browser
		this.registerEvent(
			this.app.workspace.on("file-open", (file: TFile | null) => { //Triggers on active file change
				if(file && this.fromFileBrowser == true) { //Triggers if file is not null and browser flag is active
					this.fromFileBrowser = false;
					this.handleNoteOpen(file);
				}
			})
		);

		//Set a flag when files are clicked in the file browser
		this.registerDomEvent(
			document,
			"click",
			(evt: MouseEvent) => {
			  const target = evt.target as HTMLElement;
			  if (target.closest(".nav-file")) {
				this.fromFileBrowser = true;
			  }
			}
		  );
	}

	onunload() {
		LoggingService.info("plugin UN-loading ....");
	}

	private async handleNoteOpen(newFile: TFile | null) {
		let abstractLastFile: TAbstractFile | null = null;
		let lastFile: TFile;
		let isSticky: boolean = false;
		const currentLeaf = this.app.workspace.getLeaf(false);
		await this.checkIfSticky(newFile) //Checks whether opened file is a sticky note
			.then((value) => {
				isSticky = value;
			})
			.catch((error) => {
				console.log(error);
			});
		if(isSticky) { //Triggers if opened file is a sticky note
			abstractLastFile = this.app.vault.getAbstractFileByPath(this.app.workspace.getLastOpenFiles()[0]);
			// ** Check whether note is already open
			// *** if it is, just focus the open window
			await this.openStickyNotePopup(newFile);
		}
		if(abstractLastFile instanceof TFile) {
			await currentLeaf.openFile(abstractLastFile);
		}	
	}


	private async checkIfSticky(file: TFile | null = null): Promise<boolean> {
		file = file ?? this.app.workspace.getActiveFile();
		let content: string = "";
		if(file == null) {
			console.log("Sticky note check failed");
			return false;
		}
		await this.app.vault.cachedRead(file)
			.then((value) => {
				content = value;
			})
			.catch((error) => {
				console.log("File read failed " + error);
				return false;
			})
		
		if (getFrontMatterInfo(content).frontmatter.includes("stickynote: true")) {
			return true;
		}
		else return false;
	}

	private destroyAllStickyNotes() {
		StickyNoteLeaf.leafsList.forEach(l => l.leaf.detach())
	}

	private addStickNoteCommand() {
		this.addCommand({
			id: "open-sticky-note-view",
			name: "Open sticky note window",
			icon: "sticky-note",
			callback: () => this.openStickyNotePopup(),
		});
		this.addCommand({
			id: "destroy-sticky-note-views",
			name: "Destroy all sticky notes",
			icon: "copy-x",
			callback: () => this.destroyAllStickyNotes(),
		});
		this.addCommand({
			id: "create-new-sticky-note",
			name: "Create a sticky note",
			icon: "sticky-note",
			callback: () => this.createNewStickyNote(),
		});
	}

	private addStickyNoteRibbonAction() {
		const stickyNoteRibbon = this.addRibbonIcon(
			"sticky-note",
			"Create new sticky note",
			() => this.createNewStickyNote()
		);

		setTooltip(stickyNoteRibbon, "Create new sticky note");
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
			item.setTitle("Open sticky note")
				.setIcon("sticky-note")
				.onClick(() => this.openStickyNotePopup(file));
		});
		menu.addItem((item) => {
			item.setTitle("Create new sticky note")
				.setIcon("sticky-note")
				.onClick(() => this.createNewStickyNote(file));
		});
	}

	// private addPopoutClosedListner() {
	// 	const closeEvent = this.app.workspace.on('window-close', (win: WorkspaceWindow, window: Window) => {
	// 		const noteId = win.doc.documentElement.getAttribute('note-id');
	// 		if (noteId) {
	// 			StickyNoteManager.removeBrowserWindow(noteId);
	// 		}
	// 	});
	// 	this.registerEvent(closeEvent);
	// }

	private addLeafChangeListner() {
		const leafChangeEvent = this.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf | null) => {
			const noteId = leaf?.getContainer().win.activeDocument.documentElement.getAttribute('note-id');
			StickyNoteLeaf.leafsList.forEach(l => {
				if (l.title === noteId) l.initView()
			})
		})
		this.registerEvent(leafChangeEvent);
	}

	private async openStickyNotePopup(file: TFile | null = null) {
		LoggingService.info("Opened Sticky Note Popup");
		file = file ?? this.app.workspace.getActiveFile();
		const popoutLeaf = this.app.workspace.openPopoutLeaf({
			size: {
				height: this.settings.noteSize,
				width: this.settings.noteSize,
			},
		});
		const stickNoteLeaf = new StickyNoteLeaf(popoutLeaf, this.settings.noteSize);
		await stickNoteLeaf.initStickyNote(file);
	}

	private async createNewStickyNote(file: TFile | null = null) {
		const pad = (n: number) => n.toString().padStart(2, '0');
		const now = new Date();
		const formatted =
			now.getFullYear().toString() +
			pad(now.getMonth() + 1) +
			pad(now.getDate()) +
			pad(now.getHours()) +
			pad(now.getMinutes()) +
			pad(now.getSeconds());

		await this.app.vault.create(this.settings.newStickyFilePath + "/Sticky Note " + formatted + ".md", "---\nstickynote: true\n---")
			.then((value) => {
				file = value;
			})
			.catch((error) => {
				new Notice("Sticky note creation failed.");
			});
		
			this.openStickyNotePopup(file);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class StickySettingTab extends PluginSettingTab {
	plugin: StickyNotesPlugin;

	constructor(app: App, plugin: StickyNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Sticky Note Size')
			.setDesc('Height and width value of new sticky note windows')
			.addText(text => text
				.setPlaceholder('Enter value')
				.setValue(this.plugin.settings.noteSize.toString())
				.onChange(async (value) => {
					this.plugin.settings.noteSize = parseInt(value.replace(/\D/g, ''));
					text.setValue(this.plugin.settings.noteSize.toString());
					if (text.getValue() == "NaN") {
						this.plugin.settings.noteSize = 300;
                        text.setValue("300");
                    }
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Sticky Note Directory')
			.setDesc('Folder in which to place new sticky notes')
			.addText(text => text
				.setPlaceholder('Enter path')
				.setValue(this.plugin.settings.newStickyFilePath)
				.onChange(async (value) => {
					this.plugin.settings.newStickyFilePath = value;
					await this.plugin.saveSettings();
				}));
	}
}

