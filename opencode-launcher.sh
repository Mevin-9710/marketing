#!/bin/bash

# ===== CONFIGURATION — EDIT THESE =====
CHROME_PROFILE="Default"
OPENCODE_PROMPT=""
# =======================================

# Resolve tool paths
OPENCODE=$(command -v opencode 2>/dev/null || echo "/home/mevin/.opencode/bin/opencode")
OPENTABS=$(command -v opentabs 2>/dev/null || echo "/home/mevin/.nvm/versions/node/v26.2.0/bin/opentabs")

OS=$(uname -s)

# ---- Chrome ----
launch_chrome() {
  case "$OS" in
    Linux)
      if command -v google-chrome &>/dev/null; then
        google-chrome --profile-directory="$CHROME_PROFILE" --restore-last-session &
      elif command -v chromium &>/dev/null; then
        chromium --profile-directory="$CHROME_PROFILE" --restore-last-session &
      elif command -v chromium-browser &>/dev/null; then
        chromium-browser --profile-directory="$CHROME_PROFILE" --restore-last-session &
      fi
      ;;
    Darwin)
      open -a "Google Chrome" --args --profile-directory="$CHROME_PROFILE" --restore-last-session
      ;;
  esac
}

# ---- New terminal that stays open ----
open_terminal() {
  local cmd="$1"
  case "$OS" in
    Darwin)
      osascript -e "tell app \"Terminal\" to do script \"$cmd\""
      return
      ;;
  esac

  # Linux: try terminal emulators in order
  if command -v gnome-terminal &>/dev/null; then
    gnome-terminal -- bash -c "$cmd; exec bash"
    return
  fi
  if command -v xfce4-terminal &>/dev/null; then
    xfce4-terminal -e "bash -c '$cmd; exec bash'"
    return
  fi
  if command -v mate-terminal &>/dev/null; then
    mate-terminal -- bash -c "$cmd; exec bash"
    return
  fi
  if command -v konsole &>/dev/null; then
    konsole --hold -e bash -c "$cmd"
    return
  fi
  if command -v lxterminal &>/dev/null; then
    lxterminal -e "bash -c '$cmd; exec bash'"
    return
  fi
  if command -v alacritty &>/dev/null; then
    alacritty -e bash -c "$cmd; exec bash" &
    return
  fi
  if command -v kitty &>/dev/null; then
    kitty bash -c "$cmd; exec bash" &
    return
  fi
  if command -v xterm &>/dev/null; then
    xterm -hold -e "bash -c '$cmd; exec bash'" &
    return
  fi
  # fallback
  x-terminal-emulator -e "bash -c '$cmd; exec bash'" &
}

launch_chrome
open_terminal "$OPENTABS start"
open_terminal "$OPENCODE $OPENCODE_PROMPT"
