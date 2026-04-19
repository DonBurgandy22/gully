@echo off
setlocal enabledelayedexpansion

set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "C:\Dev\Claude_Code\Videos"
if exist goku-ssj-god rmdir /s /q goku-ssj-god
mkdir goku-ssj-god
cd goku-ssj-god

echo Creating package.json...
call npm init -y

echo Installing dependencies...
call npm install --save remotion @remotion/cli @remotion/transitions react react-dom

echo Installing dev dependencies...
call npm install --save-dev typescript @types/react @types/react-dom

echo Done!
dir
