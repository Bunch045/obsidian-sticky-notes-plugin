# Sticky Notes Plugin Extended

This is a modified version of the original plugin by NoPoint, primarily for my personal use and learning. I had never used JavaScript or TypeScript before starting this project, so I cannot guarantee the quality, stability, or safety of any of my changes.

## Changes from the original plugin
### Implemented
- A command that creates a new note and opens it as a sticky note in the same action
- Resizable sticky note windows, as well as a settings option to change the default size
- A frontmatter property designating a note as a sticky note, which the plugin will recognize such that reopening that note will do so in a sticky note window and return the main view to the previously-open note
- Hide the properties section of a note in sticky note windows 
- Shrink margins of sticky note windows and adjust text size for greater information density 
- More legible and visually pleasing dark mode colors

### Planning/hoping to implement if possible
- Save the color of a sticky note in a frontmatter property and reopening the note in the saved color
- Expand settings menu with configuration options for CSS formatting
- Integrate with the Tray plugin to enable global hotkeys for sticky note creation

# Original Description

This is a simple plugin that essentially builds on the popout functionality of obsidian. **_It adds a new popout window that resembles sticky notes_** that haves a much simpler look and adds a pin functionality. 

You can open this popout window using the ribbon action, command, or context menus.

## Demo

![Demo Video](https://github.com/Abdo-reda/obsidian-sticky-notes-plugin/blob/main/assets/demo.gif?raw=true)

## Possible Issues & Limitations.

- Windows (sticky note windows) don't close themselves when obsidian shutsdown, and unfortunely reopen as normal popups when obsidian restarts. (hopefully can be fixed in a future release.)

- Currently there is no Settings (might change in the future), Default values:
    - **Sticky Note default color:** `Yellow color (250, 240, 208)`
    - **Sticky Note default window dimension**: `300x300`


- The plugin relies on `@electorn/remote` to work, as the pin functionality and resizing require access to the node/main process apis. This is not the recommended approach, but the only one that worked with me after some research.

- The plugin relies on customizing certain obsidian elements (like the titlebar) and relies on their classes, there is _**no guarentee that this will continue working in future releases of obsidian**_ (if they ever decided to rename their classes for example).

## Installation

- Go to [latest release](https://github.com/Abdo-reda/obsidian-sticky-notes-plugin/releases/latest).
- Download the `sticky-notes.zip` file and extract it inside of your obsidian vault plugins folder `<vault>\.obsidian\plugins`.
- Reload obsidian and make sure to enable the plugin in the `community plugins` section in vault settings.

> [WARNING] make sure to copy and backup your obsidian notes. This is a just a precaution.

## Version Workflow

**Creating a Release**
- Bump Vesrion `node version-bump.mjs <version>`
- Push Code.
- Create Tag:
    - `git tag -a <version> -m "<version>"`
    - `git push origin <version>`
- Edit and Publish Release Notes on Github.


## ENHANCEMENTS
- Add Support for different settings.
    - colors
    - defualt color
    - default size
    - enable resize
    - memorize sticky ntoes
- Fix the bug where sticky notes don't reopen as sticky notes. (close them before obsidian closes, and memorize them in local storage maybe)
    //add settings for remember sticky notes