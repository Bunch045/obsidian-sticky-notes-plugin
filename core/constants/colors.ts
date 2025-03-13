export enum Colors {
	DEFAULT = "Default",
	RED = "Red",
	ORANGE = "Orange",
	YELLOW = "Yellow",
	GREEN = "Green",
	CYAN = "Cyan",
	BLUE = "Blue",
	PURPLE = "Purple",
	PINK = "Pink",
}

export function getColorVariable(color: Colors) {
	return color === Colors.DEFAULT ? `--color-base-00` : `--sticky-note-${color.toLowerCase()}`
}

export function getColorCSS(color: Colors) {
	const colorVar = getColorVariable(color);
	return color === Colors.DEFAULT ? `var(${colorVar})` : `rgb(var(${colorVar}))`
}

export function getColorTextClass(color: Colors) {
	return `sticky-note-text-${color.toLowerCase()}`
}

export const COLORS = Object.values(Colors).map(c => ({
	color: getColorCSS(c),
	label: c,
}))
