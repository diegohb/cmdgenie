## 1. Analyze Current Execution Logic
- [ ] Review current command execution in CmdGenie.GenerateCommand
- [ ] Identify why shell detection doesn't affect execution
- [ ] Test execution behavior on Windows with different shells

## 2. Implement Shell-Aware Execution
- [ ] Create shell-specific execution wrapper functions
- [ ] Add PowerShell command wrapping (powershell.exe -Command)
- [ ] Add bash/zsh command execution support
- [ ] Ensure cmd.exe fallback for Windows cmd

## 3. Update Command Execution
- [ ] Modify execAsync calls to use detected shell
- [ ] Handle shell-specific escaping and quoting
- [ ] Add shell validation before execution

## 4. Error Handling Improvements
- [ ] Enhance error messages for shell execution failures
- [ ] Add shell-specific error detection
- [ ] Provide helpful troubleshooting for shell issues

## 5. Testing and Validation
- [ ] Test PowerShell command execution on Windows
- [ ] Test bash/zsh execution on Unix-like systems
- [ ] Add unit tests for shell-aware execution
- [ ] Verify error handling for invalid shells