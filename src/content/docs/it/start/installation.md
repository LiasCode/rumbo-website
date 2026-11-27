---
title: Installazione
description: Installa rumbo su Linux, macOS o Windows da un archivio di rilascio o con go install, e scopri dove conserva la configurazione, le credenziali e le sessioni.
---

rumbo è un unico binario per Linux, macOS e Windows, su amd64 e arm64.

> **Usato ogni giorno solo su Linux.** Su macOS e Windows rumbo supera i controlli
> dell'integrazione continua, ma nessuno l'ha ancora usato davvero lì: aspettati qualche asperità, e
> [segnalala](https://github.com/LiasCode/rumbo/issues).

## Da un rilascio

Ogni [rilascio](https://github.com/LiasCode/rumbo/releases) ha un archivio per piattaforma, con il
binario, il README, il changelog e la licenza, e un file `SHA256SUMS` per verificarli. L'ultimo è
rumbo 0.13.0, del 2026-11-27.

| OS      | CPU           | `platform`      |
| ------- | ------------- | --------------- |
| Linux   | x86-64        | `linux-amd64`   |
| Linux   | ARM64         | `linux-arm64`   |
| macOS   | Apple silicon | `darwin-arm64`  |
| macOS   | Intel         | `darwin-amd64`  |
| Windows | x86-64        | `windows-amd64` |
| Windows | ARM64         | `windows-arm64` |

```sh
version=0.13.0
platform=linux-amd64
archive=rumbo-$version-$platform
base=https://github.com/LiasCode/rumbo/releases/download/v$version
curl -fLO "$base/$archive.tar.gz" &&
  curl -fLO "$base/SHA256SUMS" &&
  grep -F "./$archive.tar.gz" SHA256SUMS | shasum -a 256 -c - &&
  tar -xzf "$archive.tar.gz" &&
  mkdir -p "$HOME/.local/bin" &&
  install -m 755 "$archive/rumbo" "$HOME/.local/bin/rumbo"
```

Scegli `platform` dalla tabella. Se la shell non trova `rumbo`, aggiungi `~/.local/bin` a `PATH`. Su Linux senza `shasum`, usa `sha256sum -c -`.

Su Windows l'archivio è uno zip con `rumbo.exe`. In PowerShell:

```powershell
$version = "0.13.0"
$platform = "windows-amd64"
$archive = "rumbo-$version-$platform"
$base = "https://github.com/LiasCode/rumbo/releases/download/v$version"
Invoke-WebRequest "$base/$archive.zip" -OutFile "$archive.zip"
Invoke-WebRequest "$base/SHA256SUMS" -OutFile SHA256SUMS
$expected = (Select-String -SimpleMatch "./$archive.zip" SHA256SUMS).Line.Split(" ")[0]
if ((Get-FileHash "$archive.zip" -Algorithm SHA256).Hash -ne $expected) { throw "the archive does not match SHA256SUMS" }
Expand-Archive "$archive.zip" -DestinationPath .
$bin = "$env:LOCALAPPDATA\Programs\rumbo"
New-Item -ItemType Directory -Force $bin | Out-Null
Copy-Item "$archive\rumbo.exe" $bin
$path = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$path;$bin", "User")
```

Apri un nuovo terminale per il nuovo `PATH`. Su Windows il modello esegue i comandi con PowerShell, e
lo [strumento computer](/it/guides/computer-use/) non è disponibile.

## Con Go

Con Go 1.27.3 o successivo:

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.13.0
```

## Verifica

```sh
rumbo version
```

Stampa la versione, e quella del protocollo dei provider che parla: `rumbo 0.13.0 (protocol 1)`.

## Dove rumbo conserva le cose

Tutto ciò che rumbo conserva è un file che una persona può leggere, in una sola directory, la stessa
su ogni sistema: `~/.rumbo/` (`%USERPROFILE%\.rumbo\` su Windows), o quella che indica `RUMBO_HOME`.

| Cosa                                    | In `~/.rumbo/`         |
| --------------------------------------- | ---------------------- |
| Ciò che imposti                         | `config.yaml`          |
| Le tue istruzioni e skill               | `AGENTS.md`, `skills/` |
| Chiavi e accessi dei provider integrati | `credentials/`         |
| Sessioni, una directory ciascuna        | `sessions/`            |
| Plugin aggiunti da un repository Git    | `plugins/`             |
| Immagini incollate nell'interfaccia     | `pasted/`              |
| La skill di rumbo, che scrive da sé     | `builtin/skills/`      |

rumbo 0.11.0 e precedenti conservavano tutto in `~/.config/rumbo/` (`~/Library/Application Support/rumbo/`
su macOS) e `~/.local/share/rumbo/`. Le versioni successive non lo spostano: sposta in `~/.rumbo/` ciò
che vuoi tenere.

Per disinstallare rumbo, elimina il binario, e `~/.rumbo/` se non vuoi più ciò che contiene.

## Poi

[Esegui il tuo primo compito](/it/start/quick-start/), dopo aver letto
[prima di eseguirlo](/it/start/safety/).
