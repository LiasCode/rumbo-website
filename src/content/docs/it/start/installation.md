---
title: Installazione
description: Installa rumbo su Linux o macOS da un archivio di rilascio o con go install, e scopri dove conserva la configurazione, le credenziali e le sessioni.
---

rumbo è un unico binario per Linux e macOS, su amd64 e arm64. Windows non è supportato.

## Da un rilascio

Ogni [rilascio](https://github.com/LiasCode/rumbo/releases) ha un archivio per piattaforma, con il
binario, il README, il changelog e la licenza, e un file `SHA256SUMS` per verificarli. L'ultimo è
rumbo 0.10.0, del 2026-11-25.

| OS    | CPU           | `platform`     |
| ----- | ------------- | -------------- |
| Linux | x86-64        | `linux-amd64`  |
| Linux | ARM64         | `linux-arm64`  |
| macOS | Apple silicon | `darwin-arm64` |
| macOS | Intel         | `darwin-amd64` |

```sh
version=0.10.0
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

## Con Go

Con Go 1.27.3 o successivo:

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.10.0
```

## Verifica

```sh
rumbo version
```

Stampa la versione, e quella del protocollo dei provider che parla: `rumbo 0.10.0 (protocol 1)`.

## Dove rumbo conserva le cose

Tutto ciò che rumbo conserva è un file che una persona può leggere.

| Cosa                                    | Linux                            | macOS                                              |
| --------------------------------------- | -------------------------------- | -------------------------------------------------- |
| Ciò che imposti, in `config.yaml`       | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Le tue istruzioni e skill               | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Chiavi e accessi dei provider integrati | `~/.config/rumbo/credentials/`   | `~/Library/Application Support/rumbo/credentials/` |
| Sessioni, una directory ciascuna        | `~/.local/share/rumbo/sessions/` | `~/.local/share/rumbo/sessions/`                   |

Per disinstallare rumbo, elimina il binario, e queste directory se non vuoi più ciò che contengono.

## Poi

[Esegui il tuo primo compito](/it/start/quick-start/), dopo aver letto
[prima di eseguirlo](/it/start/safety/).
