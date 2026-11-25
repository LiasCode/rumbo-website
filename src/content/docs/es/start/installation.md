---
title: Instalación
description: Instala rumbo en Linux o macOS desde un archivo de versión o con go install, y descubre dónde guarda su configuración, sus credenciales y sus sesiones.
---

rumbo es un único binario para Linux y macOS, en amd64 y arm64. Windows no está soportado.

## Desde una versión publicada

Cada [versión](https://github.com/LiasCode/rumbo/releases) tiene un archivo por plataforma, con el
binario, el README, el changelog y la licencia, y un archivo `SHA256SUMS` para comprobarlos. La última
es rumbo 0.11.0, del 2026-11-25.

| OS    | CPU           | `platform`     |
| ----- | ------------- | -------------- |
| Linux | x86-64        | `linux-amd64`  |
| Linux | ARM64         | `linux-arm64`  |
| macOS | Apple silicon | `darwin-arm64` |
| macOS | Intel         | `darwin-amd64` |

```sh
version=0.11.0
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

## Con Go

Con Go 1.27.3 o posterior:

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.11.0
```

## Compruébalo

```sh
rumbo version
```

Imprime la versión y la versión del protocolo de proveedores que habla: `rumbo 0.11.0 (protocol 1)`.

## Dónde guarda rumbo las cosas

Todo lo que guarda rumbo es un archivo que una persona puede leer.

| Qué                                                      | Linux                            | macOS                                              |
| -------------------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| Lo que configuras, en `config.yaml`                      | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Tus instrucciones y skills                               | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Claves e inicios de sesión de los proveedores integrados | `~/.config/rumbo/credentials/`   | `~/Library/Application Support/rumbo/credentials/` |
| Sesiones, un directorio cada una                         | `~/.local/share/rumbo/sessions/` | `~/.local/share/rumbo/sessions/`                   |

Para desinstalar rumbo, borra el binario, y estos directorios si ya no quieres lo que guardan.

## Siguiente

[Ejecuta tu primera tarea](/es/start/quick-start/), después de leer
[antes de ejecutarlo](/es/start/safety/).
