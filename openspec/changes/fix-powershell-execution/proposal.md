# Change: Fix PowerShell Command Execution

## Why
Commands generated for PowerShell are failing to execute because they are being run in cmd.exe instead of PowerShell. The shell detection correctly identifies PowerShell, but the command execution uses the system's default shell (cmd.exe on Windows), causing PowerShell-specific commands like Get-ChildItem to fail.

## What Changes
- Modify command execution to use the detected shell instead of the default system shell
- Add shell-specific command wrapping for PowerShell and other shells
- Ensure cross-platform compatibility for command execution
- Update error handling for shell-specific execution failures

## Impact
- Affected specs: functional-core (command execution scenarios)
- Affected code: CmdGenie.GenerateCommand execution logic
- Breaking changes: None (improves execution reliability)