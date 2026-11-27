---
title: Installation
description: Install rumbo on Linux, macOS, or Windows from a release archive or with go install, and find where it keeps its configuration, credentials, and sessions.
---

rumbo is a single binary for Linux, macOS, and Windows, on amd64 and arm64.

> **Used every day on Linux only.** On macOS and Windows rumbo passes its checks in continuous
> integration, but nobody has used it there for real yet: expect rough edges, and please
> [report them](https://github.com/LiasCode/rumbo/issues).

## From a release

Each [release](https://github.com/LiasCode/rumbo/releases) has an archive per platform, with the
binary, the README, the changelog, and the license, and a `SHA256SUMS` file to check them. The
latest is rumbo 0.13.0, from 2026-11-27.

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

Set `platform` from the table. Add `~/.local/bin` to `PATH` if your shell cannot find `rumbo`. On Linux without `shasum`, use `sha256sum -c -` instead.

On Windows the archive is a zip with `rumbo.exe`. In PowerShell:

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

Open a new terminal for the new `PATH`. On Windows the model runs commands with PowerShell, and
the [computer tool](/guides/computer-use/) is not available.

## With Go

With Go 1.27.3 or later:

```sh
go install github.com/LiasCode/rumbo/cmd/rumbo@v0.13.0
```

## Check it

```sh
rumbo version
```

It prints the version, and the version of the provider protocol it speaks: `rumbo 0.13.0 (protocol 1)`.

## Where rumbo keeps things

Everything rumbo keeps is a file a person can read, in one directory, the same on every system:
`~/.rumbo/` (`%USERPROFILE%\.rumbo\` on Windows), or the one `RUMBO_HOME` names.

| What                                        | In `~/.rumbo/`         |
| ------------------------------------------- | ---------------------- |
| What you set                                | `config.yaml`          |
| Your instructions and skills                | `AGENTS.md`, `skills/` |
| Keys and sign-ins of the built-in providers | `credentials/`         |
| Sessions, one directory each                | `sessions/`            |
| Plugins added from a Git repository         | `plugins/`             |
| Images pasted in the terminal UI            | `pasted/`              |
| rumbo's own skill, which it writes itself   | `builtin/skills/`      |

rumbo 0.11.0 and earlier kept these in `~/.config/rumbo/` (`~/Library/Application Support/rumbo/`
on macOS) and `~/.local/share/rumbo/`. Later releases do not move them: move what you want to keep
into `~/.rumbo/`.

To uninstall rumbo, delete the binary, and `~/.rumbo/` if you no longer want what it holds.

## Next

[Run your first task](/start/quick-start/), after reading [before you run it](/start/safety/).
