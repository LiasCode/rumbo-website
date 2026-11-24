---
title: Installation
description: Install rumbo on Linux or macOS from a release archive or with go install, and find where it keeps its configuration, credentials, and sessions.
---

rumbo is a single binary for Linux and macOS, on amd64 and arm64. Windows is not supported.

## From a release

Each [release](https://github.com/LiasCode/rumbo/releases) has an archive per platform, with the
binary, the README, the changelog, and the license, and a `SHA256SUMS` file to check them. The
latest is rumbo 0.9.0, from 2026-11-24.

| OS    | CPU           | `platform`     |
| ----- | ------------- | -------------- |
| Linux | x86-64        | `linux-amd64`  |
| Linux | ARM64         | `linux-arm64`  |
| macOS | Apple silicon | `darwin-arm64` |
| macOS | Intel         | `darwin-amd64` |

```sh
version=0.9.0
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

Set `platform` from the table. Add `~/.local/bin` to `PATH` if your shell cannot find `rumbo`. On Linux without `shasum`, use `sha256sum -c -` instead.

## With Go

With Go 1.27.3 or later:

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.9.0
```

## Check it

```sh
rumbo version
```

It prints the version, and the version of the provider protocol it speaks: `rumbo 0.9.0 (protocol 1)`.

## Where rumbo keeps things

Everything rumbo keeps is a file a person can read.

| What                                        | Linux                            | macOS                                              |
| ------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| What you set, in `config.yaml`              | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Your instructions and skills                | `~/.config/rumbo/`               | `~/Library/Application Support/rumbo/`             |
| Keys and sign-ins of the built-in providers | `~/.config/rumbo/credentials/`   | `~/Library/Application Support/rumbo/credentials/` |
| Sessions, one directory each                | `~/.local/share/rumbo/sessions/` | `~/.local/share/rumbo/sessions/`                   |

To uninstall rumbo, delete the binary, and these directories if you no longer want what they hold.

## Next

[Run your first task](/start/quick-start/), after reading [before you run it](/start/safety/).
