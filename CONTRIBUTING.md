# Contributing to Wozniak

This guide takes you from a clean computer to a working development
environment, step by step. No prior Docker experience is needed.

The whole toolchain runs inside a **Dev Container**: a Docker container that
VS Code opens the project in. You only install **Docker**, **VS Code** and
**Git** on your computer. Everything else comes inside the container:

| Tool | Version | What it is for |
|------|---------|----------------|
| Go | 1.27.4 | server and `jobrun` wrapper |
| Bun | 1.4.4 | web panel: packages, scripts, dev server |
| GitHub CLI (`gh`) | latest | pull requests from the terminal |
| `psql` | Debian package | poking at the database |
| PostgreSQL 18 + TimescaleDB 2.32 | separate `db` container | development database |

Steps:

1. [Install Docker](#1-install-docker)
2. [Install VS Code and the Dev Containers extension](#2-install-vs-code-and-the-dev-containers-extension)
3. [Set up Git and clone the repository](#3-set-up-git-and-clone-the-repository)
4. [Open the project in the Dev Container](#4-open-the-project-in-the-dev-container)
5. [Check that everything works](#5-check-that-everything-works)

Then read [how we work with branches and pull requests](#workflow-branches-commits-pull-requests).

---

## 1. Install Docker

Pick your operating system.

### macOS: OrbStack

[OrbStack](https://orbstack.dev) is a fast, lightweight Docker for macOS
(works on both Apple Silicon and Intel).

1. Install it. Either download it from <https://orbstack.dev/download>
   and drag it into Applications, or, if you use Homebrew:

   ```bash
   brew install orbstack
   ```

2. Open **OrbStack** from Applications once. Accept the prompts it shows.
   After that it lives in the menu bar and starts by itself.
3. Open **Terminal** and check that Docker works:

   ```bash
   docker run --rm hello-world
   ```

   You should see `Hello from Docker!`.

> If you also have Docker Desktop installed, quit it. Two Docker engines at
> the same time only cause confusion.

### Windows: Docker Desktop + WSL 2

On Windows all development happens inside **WSL** (Windows Subsystem for
Linux), a real Ubuntu running next to Windows. Docker Desktop uses it too.

1. Install WSL. Right-click the Start button → **Terminal (Admin)** (or
   **PowerShell (Admin)**) and run:

   ```powershell
   wsl --install
   ```

   Reboot when asked. After the reboot an **Ubuntu** window opens and asks
   for a new Linux username and password. Pick anything and remember the
   password: `sudo` will ask for it.
2. Download **Docker Desktop** from
   <https://www.docker.com/products/docker-desktop/> and install it. Keep the
   option **Use WSL 2 instead of Hyper-V** checked.
3. Start Docker Desktop and open **Settings** (gear icon):
   - **General** → **Use the WSL 2 based engine** is on.
   - **Resources** → **WSL integration** → turn on **Ubuntu**.
   - Click **Apply & restart**.
4. Open **Ubuntu** from the Start menu and check that Docker works:

   ```bash
   docker run --rm hello-world
   ```

   You should see `Hello from Docker!`.

> From now on, type every command in this guide into the **Ubuntu**
> terminal, not into PowerShell or `cmd`.

### Linux (Ubuntu 24.04): Docker Engine

These are the commands from the
[official guide](https://docs.docker.com/engine/install/ubuntu/).

1. Remove old or conflicting packages (it is fine if this says nothing is
   installed):

   ```bash
   sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc docker-buildx podman-docker containerd runc | cut -f1)
   ```

2. Add Docker's package repository:

   ```bash
   sudo apt update
   sudo apt install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   ```

   ```bash
   sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
   Types: deb
   URIs: https://download.docker.com/linux/ubuntu
   Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
   Components: stable
   Architectures: $(dpkg --print-architecture)
   Signed-By: /etc/apt/keyrings/docker.asc
   EOF
   ```

3. Install Docker:

   ```bash
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

4. Allow your user to run Docker without `sudo`:

   ```bash
   sudo usermod -aG docker $USER
   ```

   **Log out and log back in** (or reboot) so this takes effect.
5. Check that Docker works, without `sudo`:

   ```bash
   docker run --rm hello-world
   ```

   You should see `Hello from Docker!`.

---

## 2. Install VS Code and the Dev Containers extension

1. Install **Visual Studio Code** from <https://code.visualstudio.com/>.
   On macOS with Homebrew you can instead run:

   ```bash
   brew install --cask visual-studio-code
   ```

   On Windows install the normal Windows version. It works with WSL
   automatically.
2. Open VS Code, click the **Extensions** icon in the left bar (or press
   `Ctrl+Shift+X`, on macOS `Cmd+Shift+X`) and install:
   - **Dev Containers** (`ms-vscode-remote.remote-containers`)
   - Windows only: **WSL** (`ms-vscode-remote.remote-wsl`)
3. macOS only: make the `code` command available in Terminal. In VS Code
   press `Cmd+Shift+P`, type **Shell Command: Install 'code' command in
   PATH** and press Enter.

You do **not** need to install Go, Bun or any VS Code extensions for them:
the Dev Container brings them.

---

## 3. Set up Git and clone the repository

Run these commands in your terminal: **Terminal** on macOS, **Ubuntu** on
Windows, your usual terminal on Linux.

1. Make sure Git is installed:

   ```bash
   git --version
   ```

   If it is missing: on macOS run `xcode-select --install`, on Ubuntu run
   `sudo apt install git`.
2. Tell Git who you are. Use the email of your GitHub account:

   ```bash
   git config --global user.name "Your Name"
   ```

   ```bash
   git config --global user.email "you@example.com"
   ```

3. Install the GitHub CLI and log in. VS Code passes this login into the
   Dev Container, so `git push` will work there without passwords.
   - macOS: `brew install gh`
   - Ubuntu / WSL: `sudo apt install gh`

   ```bash
   gh auth login
   ```

   Answer the questions: **GitHub.com** → **HTTPS** → **Yes** (authenticate
   Git) → **Login with a web browser**, then follow the browser.
4. Clone the repository and open it in VS Code:

   ```bash
   mkdir -p ~/projects && cd ~/projects
   gh repo clone kewldan/Wozniak
   cd Wozniak
   code .
   ```

> **Windows:** clone into your Linux home (`~/projects`), never into
> `/mnt/c/...`. Projects on the Windows disk are many times slower inside
> containers and file changes may go unnoticed.

---

## 4. Open the project in the Dev Container

1. VS Code shows a notification: *"Folder contains a Dev Container
   configuration file…"*. Click **Reopen in Container**.

   No notification? Press `F1` (or `Ctrl+Shift+P` / `Cmd+Shift+P`), type
   **Dev Containers: Reopen in Container** and press Enter.
2. Wait. The **first** start takes 3 to 10 minutes: Docker downloads the
   images, builds the container and installs dependencies. Click
   **show log** in the notification if you want to watch. Later starts take
   seconds.
3. You are in when the bottom-left corner of VS Code says
   **Dev Container: Wozniak**. Open a terminal with `` Ctrl+` `` (backtick).
   The prompt looks like `vscode ➜ /workspaces/wozniak`.

Every terminal you open in this window now runs **inside the container**.
Files are shared with your computer: edits show up in both places.

---

## 5. Check that everything works

Run these in the VS Code terminal (inside the container):

1. Build and run the Go code:

   ```bash
   make build
   ```

   ```bash
   ./bin/server
   ```

   Expected output: `wozniak server: hello world`.
2. Start the web panel in development mode:

   ```bash
   make web-dev
   ```

   Open <http://localhost:3000> in your browser. You should see
   *Hello world!*. VS Code forwards the port from the container
   automatically (see the **Ports** tab next to the terminal). Press
   `Ctrl+C` in the terminal to stop it.
3. Talk to the development database:

   ```bash
   psql "$WOZNIAK_DATABASE_URL" -c 'select version();'
   ```

   You should see `PostgreSQL 18...`.

All three work? Your environment is ready.

---

## Everyday commands

Inside the Dev Container, from the repository root:

| Task | Command |
|------|---------|
| Build Go binaries into `bin/` | `make build` |
| Run Go tests | `make test` |
| Regenerate API code from `api/openapi.yaml` | `make generate-api` |
| Regenerate database code (sqlc) | `make generate-db` |
| Regenerate all code | `make generate` |
| Lint the API spec | `make api-lint` |
| Web panel dev server (port 3000) | `make web-dev` |
| Lint and check formatting (web) | `cd web && bun run lint` |
| Fix formatting and imports (web) | `cd web && bun run format` |
| Add a web dependency | `cd web && bun add <package>` |
| Add a Go dependency | `go get <module>@latest` then `go mod tidy` |
| Open the dev database | `psql "$WOZNIAK_DATABASE_URL"` |

Files are formatted on save: Go with `gofmt`, the web panel with Biome.

### Web panel data

The panel uses contract-shaped mock data by default. Run `make web-dev`
and open <http://localhost:3000> to browse jobs, run history and run
details without the Go API.

Once the Go API is running, set `NEXT_PUBLIC_API_MODE=real` in the root
`.env` and rebuild the Compose stack with `docker compose up -d --build`.
Open the panel through nginx (port 8080 by default), which forwards
`/api/` to Go. The setting is read when the web image is built.

Regenerate the panel's TypeScript API types after OpenAPI changes:

```bash
cd web
bunx openapi-typescript ../api/openapi.yaml -o src/lib/api-types.ts
```

### Running the full stack

To see the system the way it runs in production (nginx + server + web +
database), use Docker Compose **from your computer's terminal**, not from
the VS Code terminal. The Dev Container has no Docker inside it.

```bash
cp .env.example .env
```

```bash
docker compose up -d --build
```

Open <http://localhost:8080>. Stop it with `docker compose down`. The
database is kept between restarts; `docker compose down -v` deletes it.

If port 8080 is busy (for example, by the Dev Container's forwarded
port), change `WOZNIAK_HTTP_PORT` in `.env`.

---

## Workflow: branches, commits, pull requests

`main` is protected. Nobody can push to it directly, not even
administrators. Every change goes through a pull request (PR), and a PR can
be merged only when:

- all CI checks are green: **Go**, **Web** and **Docker images**;
- the branch is up to date with `main`;
- all review conversations are resolved.

### Step by step

1. Start from a fresh `main`:

   ```bash
   git switch main
   git pull
   ```

2. Create a branch for your change:

   ```bash
   git switch -c feat/event-ingestion
   ```

3. Make your changes and check them:

   ```bash
   make test
   ```

   ```bash
   cd web && bun run lint && cd ..
   ```

4. Commit (see the message format below):

   ```bash
   git add -A
   git commit -m "feat(server): add event ingestion endpoint"
   ```

5. Push the branch and open a pull request:

   ```bash
   git push -u origin HEAD
   ```

   ```bash
   gh pr create --fill
   ```

6. Wait for CI on the PR page. If it fails, fix, commit and push again;
   the PR updates by itself.
7. If GitHub says the branch is out of date, click **Update branch** on
   the PR page.
8. When everything is green, click **Merge pull request**. Then:

   ```bash
   git switch main
   git pull
   ```

### Branch names

`<type>/<short-description>` in lowercase with dashes, for example
`feat/missed-start-detection`, `fix/duplicate-finish-event`,
`docs/event-format`.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/), in
English:

```
<type>(<optional scope>): <what the change does>
```

- **Types:** `feat` (new functionality), `fix` (bug fix), `docs`, `test`,
  `refactor` (no behavior change), `style` (formatting only), `build`
  (Dockerfiles, build setup), `ci`, `chore` (everything else, such as
  dependencies).
- **Scopes:** `server`, `jobrun`, `web`, `db`, `deploy`, `ci`.
- Write the summary in the imperative mood, lowercase, no period at the end:
  `fix(jobrun): keep the command exit code when delivery fails`.

---

## Troubleshooting

**"Cannot connect to the Docker daemon"**
Docker is not running. Start OrbStack (macOS) or Docker Desktop (Windows).
On Linux run `sudo systemctl start docker`.

**"permission denied … docker.sock" (Linux)**
You skipped step 4 of the Linux install, or did not log out and back in
after it.

**The container is outdated after `git pull`**
If someone changed files in `.devcontainer/`, press `F1` → **Dev
Containers: Rebuild Container**.

**I want a clean development database**
From your computer's terminal (not inside the container):

```bash
docker compose -p wozniak-dev down -v
```

This deletes the dev database. Then reopen the project in the container.

**Port 3000 or 8080 is already in use**
Stop the program that uses it, or check the **Ports** tab in VS Code: it
shows which local port the container port was forwarded to.

**Windows: everything is slow, or the dev server misses file changes**
The project is on the Windows disk (`/mnt/c/...`). Clone it again into
`~/projects` inside Ubuntu (step 3).

**`git push` asks for a username or password inside the container**
Run `gh auth login` on your computer (step 3), then **Dev Containers:
Rebuild Container**.
