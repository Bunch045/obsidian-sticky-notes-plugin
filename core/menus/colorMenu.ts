import { COLORS, getColorTextClass } from "core/constants/colors";
import { Menu, MenuItem } from "obsidian";

export class ColorMenu extends Menu {
	body: HTMLElement;
	items: MenuItem[] = [];
	tempState = false;

	constructor(body: HTMLElement) {
		super();
		this.body = body;
		this.addColorItems();
	}

	addColorItems() {
		for (const color of COLORS) {
			this.addItem((item) =>
				this.items.push(
					item.setTitle(color.label).onClick(() => {
						this.body.setCssProps({
							"--background-primary": color.color,
						});
					})
				)
			);
		}

	}

	override onload(): void {
		super.onload();
		const menuContainer = this.body.querySelector(".menu-scroll");
		if (!menuContainer) return;
		menuContainer.addClass("color-menu");
		for (let i = 0; i < menuContainer.children.length; i++) {
			const itemMenu = menuContainer.children.item(i);
			itemMenu?.addClasses([
				getColorTextClass(COLORS[i].label),
				"color-menu-item",
			]);
		}
	}
}
