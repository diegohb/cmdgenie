## Context
The current implementation detects the user's shell environment (PowerShell, bash, etc.) but executes commands using Node.js child_process.exec, which defaults to the system shell (cmd.exe on Windows). This causes PowerShell-generated commands to fail when executed in cmd.exe.

## Goals / Non-Goals
- Goals: Execute commands in the detected shell environment, fix PowerShell execution
- Non-Goals: Change shell detection logic, modify command generation

## Decisions
- **Shell Execution**: Use shell-specific execution commands (powershell.exe, bash -c, etc.)
- **Cross-Platform**: Maintain compatibility with Windows cmd, PowerShell, and Unix shells
- **Error Handling**: Preserve existing error handling while adding shell-specific context
- **Security**: Ensure proper command escaping to prevent injection

## Risks / Trade-offs
- **Complexity**: Adding shell-aware execution increases complexity
- **Compatibility**: Different shells have different escaping rules
- **Performance**: Shell invocation may have slight performance overhead
- **Testing**: Requires testing across multiple shell environments

## Migration Plan
1. Implement shell-aware execution functions
2. Update command execution to use detected shell
3. Test across Windows (cmd/PowerShell) and Unix (bash/zsh) environments
4. Add shell validation and error handling