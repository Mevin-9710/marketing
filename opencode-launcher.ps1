# ===== CONFIGURATION — EDIT THESE =====
$CHROME_PROFILE = "Default"
$OPENCODE_PROMPT = ""
# =======================================

# Resolve tool paths
$OPENTABS = if (Get-Command opentabs -ErrorAction SilentlyContinue) { "opentabs" } else { "$env:USERPROFILE\AppData\Roaming\npm\opentabs.cmd" }
$OPENCODE = if (Get-Command opencode -ErrorAction SilentlyContinue) { "opencode" } else { "$env:LOCALAPPDATA\opencode\opencode.exe" }

# Launch Chrome with profile
$chromeArgs = "--profile-directory=`"$CHROME_PROFILE`" --restore-last-session"
Start-Process "chrome" -ArgumentList $chromeArgs

# Open terminal with opentabs start (stays open)
Start-Process "cmd" -ArgumentList "/k $OPENTABS start"

# Open terminal with opencode prompt (stays open)
if ($OPENCODE_PROMPT -ne "") {
    Start-Process "cmd" -ArgumentList "/k $OPENCODE $OPENCODE_PROMPT"
} else {
    Start-Process "cmd" -ArgumentList "/k $OPENCODE"
}
