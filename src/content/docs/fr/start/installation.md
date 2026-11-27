---
title: Installation
description: Installez rumbo sur Linux, macOS ou Windows depuis une archive de version ou avec go install, et découvrez où il garde sa configuration, ses identifiants et ses sessions.
---

rumbo est un binaire unique pour Linux, macOS et Windows, en amd64 et arm64.

> **Utilisé au quotidien sous Linux seulement.** Sous macOS et Windows, rumbo passe ses
> vérifications d'intégration continue, mais personne ne l'y a encore vraiment utilisé : attendez-vous
> à des aspérités, et [signalez-les](https://github.com/LiasCode/rumbo/issues).

## Depuis une version publiée

Chaque [version](https://github.com/LiasCode/rumbo/releases) a une archive par plateforme, avec le
binaire, le README, le changelog et la licence, et un fichier `SHA256SUMS` pour les vérifier. La
dernière est rumbo 0.13.0, du 2026-11-27.

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

Choisissez `platform` dans le tableau. Si le shell ne trouve pas `rumbo`, ajoutez `~/.local/bin` à `PATH`. Sous Linux sans `shasum`, utilisez `sha256sum -c -`.

Sous Windows, l'archive est un zip avec `rumbo.exe`. Dans PowerShell :

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

Ouvrez un nouveau terminal pour le nouveau `PATH`. Sous Windows, le modèle lance les commandes avec
PowerShell, et l'[outil computer](/fr/guides/computer-use/) n'est pas disponible.

## Avec Go

Avec Go 1.27.3 ou plus récent :

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.13.0
```

## Vérifier

```sh
rumbo version
```

Il affiche la version, et celle du protocole des fournisseurs qu'il parle : `rumbo 0.13.0 (protocol 1)`.

## Où rumbo garde les choses

Tout ce que rumbo garde est un fichier lisible par une personne, dans un seul répertoire, le même sur
tous les systèmes : `~/.rumbo/` (`%USERPROFILE%\.rumbo\` sous Windows), ou celui que nomme `RUMBO_HOME`.

| Quoi                                         | Dans `~/.rumbo/`       |
| -------------------------------------------- | ---------------------- |
| Ce que vous réglez                           | `config.yaml`          |
| Vos instructions et skills                   | `AGENTS.md`, `skills/` |
| Clés et connexions des fournisseurs intégrés | `credentials/`         |
| Sessions, un répertoire chacune              | `sessions/`            |
| Plugins ajoutés depuis un dépôt Git          | `plugins/`             |
| Images collées dans l'interface terminal     | `pasted/`              |
| La skill de rumbo, qu'il écrit lui-même      | `builtin/skills/`      |

rumbo 0.11.0 et antérieurs gardaient cela dans `~/.config/rumbo/` (`~/Library/Application Support/rumbo/`
sous macOS) et `~/.local/share/rumbo/`. Les versions suivantes ne le déplacent pas : déplacez dans
`~/.rumbo/` ce que vous voulez garder.

Pour désinstaller rumbo, supprimez le binaire, et `~/.rumbo/` si vous ne voulez plus ce qu'il
contient.

## Ensuite

[Lancez votre première tâche](/fr/start/quick-start/), après avoir lu
[avant de le lancer](/fr/start/safety/).
