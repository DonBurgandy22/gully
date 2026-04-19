$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Dev\Claude_Code\Videos\goku-ssj-god"
New-Item -ItemType Directory -Force -Path out
& npx remotion render GokuSSJGod out/goku-ssj-god.mp4
