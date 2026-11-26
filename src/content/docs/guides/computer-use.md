---
title: Computer use
description: Turn on rumbo's computer tool so the model can take screenshots and use the pointer and keyboard of your desktop, on Hyprland, Sway, X11, or macOS.
---

A shell starts programs, but cannot show the model what they draw or press their buttons. The
computer tool can: the model takes screenshots of the desktop rumbo runs in, and uses its pointer
and keyboard. It is off until you turn it on.

```sh
rumbo system set computer=on
```

> **Warning**
>
> With the tool on, the model acts on whatever has the focus, with your pointer and your keyboard.
> Read [before you run it](/start/safety/), and give it a desktop of its own when you can.

## What it needs

| Desktop                                        | Needs                                                                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| wlroots compositors, such as Hyprland and Sway | `grim`                                                                                                    |
| X11                                            | `xdotool`, and `maim` or ImageMagick                                                                      |
| macOS                                          | Screen Recording, Accessibility, and Automation of System Events, allowed for the program that runs rumbo |

On macOS the tool is written, and has not been tried yet. On Windows there is no screen to act on
yet: with `computer=on` the tool says so.

## How it behaves

- **It shows the monitor in use**, in screenshots of at most 1280×800, and maps the model's
  coordinates to the screen.
- **It acts only on the screen the model saw last.** When you move the pointer yourself, or turn to
  another monitor, it does nothing more until the model takes a new screenshot. Moving your mouse is
  how you take the desktop back.
- **Its keyboard is a US one**, whatever your layout, and it still types characters such a keyboard
  lacks.

## What it costs

A screenshot stays in the conversation, as any tool result does, and is sent again with every later
request: about 1,400 tokens each time, until the conversation is compacted.

## Without a desktop of your own

To keep the model away from what you are doing, give it a display of its own: a Sway started with
`WLR_BACKENDS=headless` shows nothing on your desktop, and a rootful `Xwayland :N` gives X11 a
server of its own. Run rumbo with that display in its environment.
