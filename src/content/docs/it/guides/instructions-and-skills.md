---
title: Istruzioni e skill
description: Spiega all'agente di rumbo come lavori con i file AGENTS.md e CLAUDE.md, e dagli skill nel formato Agent Skills che legge solo quando un compito ne ha bisogno.
---

rumbo invia al modello poche cose che non ha chiesto: l'ambiente in cui lavora, le tue istruzioni e a
cosa serve ciascuna delle tue skill. Tutto il resto su un compito il modello lo scopre con i suoi
strumenti. Le istruzioni e le skill sono il posto dove gli dici come va fatto il lavoro.

## Istruzioni

Il modello legge i file `AGENTS.md` o `CLAUDE.md`:

- della directory in cui è stato avviato rumbo, la radice della sessione, e di nessuna sopra di essa;
- i tuoi, in `~/.rumbo/`, che valgono ovunque.

Scrivi lì ciò che un compito non può mostrare da solo: come vuoi che sia fatto il lavoro, quali comandi
lo verificano e cosa non deve succedere mai.

```markdown title="AGENTS.md"
# Agent guide

- Run `make check` before saying a change is done, and report what it printed.
- Never commit; I review and commit myself.
- Write to me in Spanish; code and comments in English.
```

Avviato in una sottodirectory di un repository, rumbo legge solo la guida di quella sottodirectory, non
quella della radice: avvialo nella radice per lavorare con la guida del repository.

Le tue istruzioni prevalgono su quelle di rumbo: prima ciò che dici nella conversazione, poi il tuo
`AGENTS.md`. Un file lungo viene tagliato, indicando dove si trova il resto, così che il modello possa
leggerlo.

## Skill

Una skill è un insieme di istruzioni per un tipo di compito, nel formato
[Agent Skills](https://agentskills.io): una directory con un `SKILL.md` il cui frontmatter ha un `name`
e una `description` di a cosa serve e quando usarla.

```markdown title="~/.rumbo/skills/meeting-notes/SKILL.md"
---
name: meeting-notes
description: Write meeting notes in my format. Use for any summary of a meeting.
---

One heading per topic, decisions first, then who does what by when.
```

Le skill vanno in:

- `~/.rumbo/skills/<name>/`, le tue;
- `.agents/skills/<name>/` nella directory in cui è stato avviato rumbo, e in nessuna sopra. La sua
  skill sostituisce una tua con lo stesso nome.
- `skills/<name>/` in un [plugin](/it/guides/plugins/) che hai aggiunto. Una tua con lo stesso nome la
  sostituisce.

Con ogni richiesta vengono inviati solo il nome, la descrizione e il percorso. Il modello legge la skill
quando un compito ne ha bisogno, quindi una skill costa una riga finché non viene usata.

```sh
rumbo skills    # the skills the model is told of here, and those left out, with why
```

Nell'interfaccia da terminale, `/status` mostra lo stesso accanto alla conversazione. Una skill viene esclusa quando un'altra con lo
stesso nome l'ha sostituita, o quando il suo frontmatter manca, non è chiuso, non è YAML valido o non ha
una descrizione.

## L'ambiente

Al modello vengono detti anche la directory in cui lavora, la piattaforma e la data. Tutto qui: rumbo
non rileva progetti e non invia nulla su alcun linguaggio o framework.
