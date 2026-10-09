@echo off
echo Starting Blackwater University Server...
echo =======================================

:: Add standard bun/node paths to the temporary session PATH just in case
set PATH=%PATH%;C:\Users\ACER\.bun\bin;C:\Program Files\nodejs\

:: Run the development server
bun run dev

:: If bun fails, fallback to npm
if %ERRORLEVEL% neq 0 (
    echo.
    echo Bun failed, trying with npm...
    npm run dev
)

pause
