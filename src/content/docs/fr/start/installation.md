---
title: Installation
description: Installez rumbo sur Linux ou macOS depuis une archive de version ou avec go install, et découvrez où il garde sa configuration, ses identifiants et ses sessions.
---

rumbo est un binaire unique pour Linux et macOS, en amd64 et arm64. Windows n'est pas pris en charge.

## Depuis une version publiée

Chaque [version](https://github.com/LiasCode/rumbo/releases) a une archive par plateforme, avec le
binaire, le README, le changelog et la licence, et un fichier `SHA256SUMS` pour les vérifier. La
dernière est rumbo 0.10.0, du 2026-11-25.

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

Choisissez `platform` dans le tableau. Si le shell ne trouve pas `rumbo`, ajoutez `~/.local/bin` à `PATH`. Sous Linux sans `shasum`, utilisez `sha256sum -c -`.

## Avec Go

Avec Go 1.27.3 ou plus récent :

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.10.0
```

## Vérifier

```sh
rumbo version
```

Il affiche la version, et celle du protocole des fournisseurs qu'il parle : `rumbo 0.10.0 (protocol 1)`.

## Où rumbo garde les choses

Tout ce que rumbo garde est un fichier lisible par une personne.

| Quoi                                         | Linux                            | macOS                                              |
| -------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| Ce que vous réglez, dans `config.yaml`       | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Vos instructions et skills                   | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Clés et connexions des fournisseurs intégrés | `~/.config/rumbo/credentials/`   | `~/Library/Application Support/rumbo/credentials/` |
| Sessions, un répertoire chacune              | `~/.local/share/rumbo/sessions/` | `~/.local/share/rumbo/sessions/`                   |

Pour désinstaller rumbo, supprimez le binaire, et ces répertoires si vous ne voulez plus ce qu'ils
contiennent.

## Ensuite

[Lancez votre première tâche](/fr/start/quick-start/), après avoir lu
[avant de le lancer](/fr/start/safety/).
