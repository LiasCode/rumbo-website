# rumbo design system: the printed manual

This is the design system for everything rumbo shows a person: the site, its documentation, and any
interface that carries the rumbo name. It says what the interface is made of and how to decide
when a case is not written here. The values live in the code; this page explains them.

## The idea

rumbo's documentation is a **manual page printed on continuous paper**. A reader who has used
`man` already knows where everything is: the name on top, the synopsis, the description, and what
to read next at the bottom. The paper gives it a body: tractor-feed holes down both edges, green
bars behind listings, black ink, and one red ribbon for what matters.

Five rules follow from that idea, and they settle most questions:

1. **Every page has the same skeleton.** A reader learns the layout once.
2. **One typeface, one size, one accent.** Hierarchy comes from weight, capitals, indentation, and
   space, never from a second font or a second color.
3. **Text first.** Everything is readable as plain text, top to bottom, with no script. Drawings
   and motion explain; they never carry something the text does not also say.
4. **The keyboard is a first-class way in**, and every key has a visible control that does the
   same.
5. **Nothing decorates.** A mark is on the page because it tells the reader where they are, what
   something is, or what to do. If it does none of these, it goes.

## Tokens

### Color

There are two ribbons: `paper`, the default, and `carbon`, the same sheet at night. A component
never names a color; it names a role, and the ribbon decides the value.

| Role    | What it is for                                                    | Paper     | Carbon    |
| ------- | ----------------------------------------------------------------- | --------- | --------- |
| `desk`  | What is behind the sheet, and the holes punched through it        | `#cfc9bb` | `#0c0c0b` |
| `paper` | The sheet: the background of everything that is read              | `#f8f5ec` | `#191816` |
| `band`  | The bars behind listings                                          | `#e9f0e4` | `#20241d` |
| `ink`   | Text, rules that structure, and the pager line                    | `#1c1c1a` | `#e9e4d6` |
| `dim`   | Secondary text: comments, captions, section numbers               | `#6f6b62` | `#99937f` |
| `rule`  | Hairlines that separate without structuring: leaders, perforation | `#bdb7a8` | `#3a382f` |
| `red`   | The one accent                                                    | `#b3261e` | `#ff6f61` |

Red is a ribbon, not a paint. It is used for exactly these things and no others: the current page
in the index, step numbers, link underlines, the notice, the part of a drawing that is acting, and
keyboard focus. If two red things on screen compete, one of them is wrong.

Measured contrast against `paper`, and the lowest against `band`:

| Pair           | Paper  | Carbon | On `band` (paper / carbon) |
| -------------- | ------ | ------ | -------------------------- |
| `ink` on paper | 15.7:1 | 14.0:1 | 14.7:1 / 12.4:1            |
| `dim` on paper | 4.9:1  | 5.8:1  | 4.6:1 / 5.1:1              |
| `red` on paper | 6.0:1  | 6.5:1  | not used on `band`         |
| `paper` on red | 6.0:1  | 6.5:1  |                            |

`rule` is below 3:1 on purpose and must never be the only thing that carries meaning. A new color
role needs this table extended, in both ribbons, with every pair at 4.5:1 or more.

### Type

One monospaced family, from the reader's system: `ui-monospace`, then JetBrains Mono, SF Mono,
Menlo, Consolas, `monospace`. No web font is loaded.

| Use                       | Size                    | Weight | Case      |
| ------------------------- | ----------------------- | ------ | --------- |
| Body, listings, tables    | 15px, line height 1.7   | 400    | as typed  |
| Page name                 | 1.9rem to 2.8rem, fluid | 800    | as typed  |
| Section head, index group | 15px                    | 800    | uppercase |
| Running header            | 15px                    | 400    | uppercase |
| Caption, pager line, copy | 13px to 13.5px          | 400    | as typed  |
| Labels in a drawing       | 12.5px; part names 15px | 400    | as typed  |

The page name is the only text larger than the body. Emphasis in running text is weight 800;
inline code is also weight 800 with no background, as a terminal prints it. Italics are not used:
what would be italic is underlined, as a terminal prints it too.

### Space

Horizontal space is counted in characters (`ch`) and vertical space in lines (1.7em), so the page
keeps the grid of a printout.

| Measure          | Value                 | Under 860px      |
| ---------------- | --------------------- | ---------------- |
| Sheet            | at most 136ch         | full width       |
| Hole margin      | 2.6rem each side      | none             |
| Index column     | 33ch                  | opens on request |
| Text column      | at most 86ch          | full width       |
| Body indent      | 7ch from the heads    | 2ch              |
| Between blocks   | one line              | one line         |
| Before a section | two lines             | two lines        |
| Listing bars     | two lines on, two off | the same         |

Section heads sit flush left and their content is indented: that offset is the whole hierarchy.
Subsections are weight 800 at the indent, not a third level of indentation; deeper than that,
split the page instead. Figures are the one exception to the indent: they span the whole measure,
from the heads' edge, so a drawing gets the width it needs.

### Line, corner, shadow, motion

- Corners are square, always.
- `ink` lines structure: under the running header, left of a listing (3px), around a figure.
  `rule` lines only separate: dotted leaders, the perforation, table rows.
- There are two shadows: the sheet lifts off the desk with a soft one, and the notice casts a hard
  4px offset in red. Nothing else has a shadow, and nothing has a gradient or a blur; the holes and
  the listing bars are hard-edged patterns.
- Only opacity, visibility, transforms, and stroke offsets move. Nothing moves to be noticed; a
  drawing moves to show an order of events. Under `prefers-reduced-motion` every drawing shows its
  final state and a sentence that says the same.

## The page

### Anatomy

| Part           | What it holds                                                                 |
| -------------- | ----------------------------------------------------------------------------- |
| Sheet          | Everything. Holes down both edges, a dashed perforation inside them           |
| Index          | `rumbo(1)`, the languages, the search, and every page in numbered sections    |
| Running header | `TITLE(n)`, the manual and group name, `TITLE(n)` again, over an `ink` rule   |
| Sections       | Uppercase heads with a dotted guide to the right edge, content indented       |
| Running footer | The release (a link to the changelog), its date, and `TITLE(n)` again         |
| Pager line     | A fixed inverse bar: where you are, how far down, the keys, the ribbon switch |

The number in `TITLE(n)` is the page's group in the navigation, in its order there. It is the
same number shown beside the page in the index.

### Skeleton

Every documentation page has these sections, in this order. The head is translated; the order is
not.

| Section      | Holds                                                              |
| ------------ | ------------------------------------------------------------------ |
| NAME         | The page title, large, and its description in one or two sentences |
| IN THIS PAGE | A numbered list of the page's own sections, each a link            |
| The content  | The article's figure, if it has one, then its sections as written  |
| SEE ALSO     | The previous and next page, with the keys that open them           |

The front page is the manual page of rumbo itself: NAME (with the two lines that install and run
it), SYNOPSIS (the commands a reader runs first, exactly as they are typed), DESCRIPTION (with the
drawing of the whole), EXAMPLES (one run, then what the parts make together), YOUR OWN PARTS (what
to build), and SEE ALSO. It sells nothing a manual would not say.

## Components

| Component   | Rule                                                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link        | `ink` text with a `red` underline; `red` text on hover. Never color alone, never a button shape                                                                                                         |
| Inline code | Weight 800, no background, no backticks                                                                                                                                                                 |
| Listing     | A 3px `ink` rule on the left and `band` bars behind. Comments in `dim`. A `[Copy]` control above its right edge. Long lines scroll, they never wrap                                                     |
| Step        | A numbered section head: the number in a `red` square with `paper` digits. Only for things done in order                                                                                                |
| Notice      | A `red` border, the hard red shadow, and a label in red capitals. One kind only; at most one per section                                                                                                |
| Table       | `ink` rules above and below, a rule under the header, dotted rows. The first column names the row in weight 800; a short name stays on one line, a long one wraps between words. No word is ever broken |
| Figure      | An `ink` border across the whole measure, the drawing, and a caption that starts `Fig. n ·` and states what the drawing shows                                                                           |
| Index entry | Title, dotted leader, section number. The current page is weight 800 in `red` with a marker before it                                                                                                   |
| Search      | An input written as a command, `$ man -k`, with an `ink` rule under it. It filters the index as you type and gives each match its description; Enter opens the first match                              |
| Control     | Text in square brackets, `[Copy]`, in `dim`; `red` on hover. There are no filled buttons anywhere                                                                                                       |
| Choice      | A row of controls, one per option; the chosen one is `ink` in weight 800                                                                                                                                |
| Position    | A range: a 1px `ink` track and a square `ink` thumb, for where a drawing is in its growth                                                                                                               |
| Entries     | A link in weight 800 and, beside it in `dim`, what it leads to. One per line; stacked under 860px                                                                                                       |
| Pager line  | `ink` background, `paper` text, keys in weight 800. It is the only inverse surface                                                                                                                      |

A new component is justified only when none of these can say what is needed. It uses the tokens
above, and it is added to this table in the same change.

## Drawings

Drawings are how rumbo explains itself, and they are printed on the same paper.

- They are SVG, drawn in `ink` strokes on `paper`, with labels in the body typeface. Box-drawing
  characters are not used: they break with the reader's font.
- A part is a square-cornered box with a name in weight 800 and one line under it in `dim`. The
  same part has the same name, place, and shape in every drawing.
- `red` marks the part that is acting, and only that. At most one part is red at a time.
- Every drawing has two layouts, wide and tall, and shows the one that fits its container.
  Shrinking a wide drawing until its text is unreadable is not a layout.
- A drawing that plays through steps shows, beside it, the sentence for the current step, and can
  be read in full with motion off.
- A drawing of a protocol shows the frames rumbo really sends. An example that is made up says so
  in its caption.

## Behavior

| Key   | Does                   | Visible control         |
| ----- | ---------------------- | ----------------------- |
| `/`   | Moves to the search    | The search field        |
| `j`   | Next page              | SEE ALSO                |
| `k`   | Previous page          | SEE ALSO                |
| `q`   | Back to the front page | `rumbo(1)` in the index |
| `t`   | Switches the ribbon    | The switch in the pager |
| `Esc` | Leaves the search      |                         |

- Keys act only when no field has focus, and never override the browser's own.
- The pager line reports how far down the page the reader is, as a pager does, and `(END)` on a
  page that does not scroll.
- The ribbon follows the reader's system preference on a first visit, and the reader's own choice
  after that.
- Focus is always visible: a 2px `red` outline, offset by 2px.
- Copying confirms in place, on the control, and returns after a moment.

## Small screens

Under 860px the sheet is the whole screen: the holes go, the index opens from `[index]` in the
pager line, the indent drops to 2ch, the running header keeps only its first title, and drawings
take their tall layout. Everything must work at 320px with no horizontal scroll of the page;
only listings and wide tables scroll, inside their own frame.

## Words

- Section heads are nouns, short, and the same on every page that has them.
- Steps are imperatives: what the reader does, not what the page explains.
- A page's description says what the reader will be able to do after reading it.
- Interface words are the pager's and the manual's: index, page, see also. No marketing voice, no
  exclamation marks, no emoji.
- Code, commands, and their comments stay in English in every locale.

## What this system forbids

- A second typeface, a second accent color, or a color outside the two ribbons.
- Rounded corners, gradients, blurs, glows, and filled buttons.
- Icons where a word fits. Arrows are drawn once and shared, and markers are drawn, never typed.
- A page that skips the skeleton, or reorders it.
- Motion that does not explain an order of events.
- A drawing, a color, or a key as the only way to learn or do something.
