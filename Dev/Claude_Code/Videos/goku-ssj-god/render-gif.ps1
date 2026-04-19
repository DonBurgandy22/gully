$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Dev\Claude_Code\Videos\goku-ssj-god"
New-Item -ItemType Directory -Force -Path out
# Render as MP4
& npx remotion render GokuSSJGodGif out/goku-ssj-god-gif.mp4
# Also render HD version
& npx remotion render GokuSSJGodGif-HD out/goku-ssj-god-gif-hd.mp4
