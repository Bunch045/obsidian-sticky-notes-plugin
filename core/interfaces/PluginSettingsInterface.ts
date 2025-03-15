export interface IPluginSettings {
	defaultSize: string;
	dimensions: string;
    defaultColor: string;
}

// - colors
// - defualt color
// - default size
// - enable resize
// - memorize sticky ntoes

export const DEFAULT_SETTINGS: IPluginSettings = {
	defaultSize: "default",
	dimensions: "300x300",
	defaultColor: "yellow",
};
