# Security Skill
System security monitoring and threat detection for Daryl's machine.

## Trigger phrases
"Security check", "Am I hacked", "Check processes", "System scan", "Who's connected"

## Standard security check — run all of these:

### 1. Suspicious processes
Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name, CPU, WorkingSet, Path
Compare against known good list. Flag anything with no path, high CPU, or unknown name.

### 2. Network connections
netstat -ano | findstr ESTABLISHED
For each connection, resolve the remote IP:
Get-NetTCPConnection -State Established | Select-Object LocalPort, RemoteAddress, RemotePort, OwningProcess

### 3. Startup items
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location
Get-ScheduledTask | Where-Object {$_.State -eq "Ready"} | Select-Object TaskName, TaskPath

### 4. Recent logins
Get-EventLog -LogName Security -InstanceId 4624 -Newest 20 | Select-Object TimeGenerated, Message

### 5. Failed login attempts
Get-EventLog -LogName Security -InstanceId 4625 -Newest 20 | Select-Object TimeGenerated, Message

### 6. Open listening ports
netstat -an | findstr LISTENING

### 7. Recently modified system files
Get-ChildItem C:\Windows\System32 -File | Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-7)} | Select-Object Name, LastWriteTime

### 8. Resource usage summary
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 Name, CPU, @{N='RAM(MB)';E={[math]::Round($_.WorkingSet/1MB,1)}}

## Reporting format
- Flag anything suspicious in RED with reason
- Normal items in plain text
- Save full report to C:\Users\dkmac\Documents\Burgandy\Personal\security-report-[date].md
- WhatsApp Daryl summary: top 3 concerns or "All clear"

## Known safe processes for this machine
openclaw, node, python, chrome, msedge, explorer, svchost, system, registry, smss, csrss, wininit, services, lsass, winlogon, dwm, taskhostw, sihost, ctfmon, searchhost, runtimebroker, dllhost, conhost, powershell, cmd, code, cursor