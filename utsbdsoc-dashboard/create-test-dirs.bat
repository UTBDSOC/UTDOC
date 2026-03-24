@echo off
cd /d "%~dp0"

echo Creating directories...
echo.

mkdir .vscode 2>nul && echo Created: .vscode || echo Already exists: .vscode
mkdir .husky 2>nul && echo Created: .husky || echo Already exists: .husky
mkdir tests 2>nul && echo Created: tests || echo Already exists: tests
mkdir tests\unit 2>nul && echo Created: tests\unit || echo Already exists: tests\unit
mkdir tests\unit\components 2>nul && echo Created: tests\unit\components || echo Already exists: tests\unit\components
mkdir tests\integration 2>nul && echo Created: tests\integration || echo Already exists: tests\integration
mkdir tests\e2e 2>nul && echo Created: tests\e2e || echo Already exists: tests\e2e
mkdir tests\utils 2>nul && echo Created: tests\utils || echo Already exists: tests\utils

echo.
echo All directories ready!
