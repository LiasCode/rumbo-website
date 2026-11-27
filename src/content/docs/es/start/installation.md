---
title: Instalación
description: Instala rumbo en Linux, macOS o Windows desde un archivo de versión o con go install, y descubre dónde guarda su configuración, sus credenciales y sus sesiones.
---

rumbo es un único binario para Linux, macOS y Windows, en amd64 y arm64.

> **Solo se usa a diario en Linux.** En macOS y Windows rumbo pasa sus comprobaciones de
> integración continua, pero nadie lo ha usado allí de verdad todavía: espera asperezas, y
> [cuéntanoslas](https://github.com/LiasCode/rumbo/issues).

## Desde una versión publicada

Cada [versión](https://github.com/LiasCode/rumbo/releases) tiene un archivo por plataforma, con el
binario, el README, el changelog y la licencia, y un archivo `SHA256SUMS` para comprobarlos. La última
es rumbo 0.13.0, del 2026-11-27.

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

Elige `platform` en la tabla. Si tu shell no encuentra `rumbo`, añade `~/.local/bin` a `PATH`. En Linux sin `shasum`, usa `sha256sum -c -`.

En Windows el archivo es un zip con `rumbo.exe`. En PowerShell:

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

Abre una terminal nueva para el `PATH` nuevo. En Windows el modelo ejecuta los comandos con
PowerShell, y la [herramienta computer](/es/guides/computer-use/) no está disponible.

## Con Go

Con Go 1.27.3 o posterior:

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.13.0
```

## Compruébalo

```sh
rumbo version
```

Imprime la versión y la versión del protocolo de proveedores que habla: `rumbo 0.13.0 (protocol 1)`.

## Dónde guarda rumbo las cosas

Todo lo que guarda rumbo es un archivo que una persona puede leer, en un solo directorio, el mismo
en todos los sistemas: `~/.rumbo/` (`%USERPROFILE%\.rumbo\` en Windows), o el que nombre `RUMBO_HOME`.

| Qué                                                      | En `~/.rumbo/`         |
| -------------------------------------------------------- | ---------------------- |
| Lo que configuras                                        | `config.yaml`          |
| Tus instrucciones y skills                               | `AGENTS.md`, `skills/` |
| Claves e inicios de sesión de los proveedores integrados | `credentials/`         |
| Sesiones, un directorio cada una                         | `sessions/`            |
| Plugins añadidos desde un repositorio Git                | `plugins/`             |
| Imágenes pegadas en la interfaz de terminal              | `pasted/`              |
| La skill propia de rumbo, que escribe él mismo           | `builtin/skills/`      |

rumbo 0.11.0 y anteriores guardaban esto en `~/.config/rumbo/` (`~/Library/Application Support/rumbo/`
en macOS) y `~/.local/share/rumbo/`. Las versiones posteriores no lo mueven: mueve a `~/.rumbo/` lo
que quieras conservar.

Para desinstalar rumbo, borra el binario, y `~/.rumbo/` si ya no quieres lo que guarda.

## Siguiente

[Ejecuta tu primera tarea](/es/start/quick-start/), después de leer
[antes de ejecutarlo](/es/start/safety/).
