# Obsidian Sticky Note Plugin

This is a simple plugin that essentially builds on the popout functionality of obsidian. **_It adds a new popout window that resembles sticky notes_** that haves a much simpler look and adds a pin functionality. 

You can open this popout window using the ribbon action, command, or context menus.

## Demo

![Demo Video](https://github.com/Abdo-reda/obsidian-sticky-notes-plugin/blob/main/assets/demo.gif?raw=true)

## Possible Issues & Limitations.

- Windows (sticky note windows) don't close themselves when obsidian shutsdown, and unfortunely reopen as normal popups when obsidian restarts. (hopefully can be fixed in the future.)

- Currently there is no Settings (might change in the future), Default values:
    - **Sticky Note default color:** `Yellow color (250, 240, 208)`
    - **Sticky Note default window dimension**: `300x300`


- The plugin relies on `@electorn/remote` to work, as the pin functionality and resizing require access to the node/main process apis. This is not the recommended approach, but the only one that worked with me after some research.

- The plugin relies on customizing certain obsidian elements (like the titlebar) and relies on their classes, there is _**no guarentee that this will continue working in future releases of obsidian**_ (if they ever decided to rename their classes for example).







