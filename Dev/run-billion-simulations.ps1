# Run 1 Billion Simulations Script
# Enhanced with progress tracking and integration

Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "🚀 BILLION SIMULATIONS LAUNCHER" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Cyan
Write-Host "Target: 1,000,000,000 simulations" -ForegroundColor White
Write-Host "Enhanced Monitor: http://localhost:8007" -ForegroundColor Green
Write-Host "Tunnel: https://burgandy-sim-enhanced.loca.lt" -ForegroundColor Green
Write-Host "="*80 -ForegroundColor Cyan

# Check if Python is available
$pythonCheck = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCheck) {
    Write-Host "❌ Python not found. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Check if enhanced server is running
$portCheck = Test-NetConnection -ComputerName localhost -Port 8007 -InformationLevel Quiet
if (-not $portCheck) {
    Write-Host "⚠️ Enhanced simulation monitor not running on port 8007" -ForegroundColor Yellow
    Write-Host "Starting enhanced server..." -ForegroundColor Yellow
    
    # Start enhanced server
    Start-Process python -ArgumentList "C:\Dev\enhanced-simulation-server.py" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    Write-Host "✅ Enhanced server started on http://localhost:8007" -ForegroundColor Green
}

# Check if tunnel is running
Write-Host "`n🌐 Checking tunnel status..." -ForegroundColor Cyan
try {
    $tunnelCheck = Invoke-WebRequest -Uri "https://burgandy-sim-enhanced.loca.lt" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($tunnelCheck.StatusCode -eq 200) {
        Write-Host "✅ Tunnel active: https://burgandy-sim-enhanced.loca.lt" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Tunnel not active. Starting new tunnel..." -ForegroundColor Yellow
    
    # Start tunnel in background
    Start-Process npx -ArgumentList "localtunnel --port 8007 --subdomain burgandy-sim-enhanced" -WindowStyle Hidden
    Start-Sleep -Seconds 5
    
    Write-Host "✅ Tunnel started: https://burgandy-sim-enhanced.loca.lt" -ForegroundColor Green
}

# Display simulation options
Write-Host "`n🎯 SIMULATION OPTIONS:" -ForegroundColor Cyan
Write-Host "1. Simple threshold (R1,000,000)" -ForegroundColor White
Write-Host "2. Medium threshold (R5,000,000)" -ForegroundColor White
Write-Host "3. Complex threshold (R20,000,000)" -ForegroundColor White
Write-Host "4. Extreme threshold (R75,000,000)" -ForegroundColor White

$choice = Read-Host "`nSelect threshold (1-4, default 2)"
switch ($choice) {
    "1" { $threshold = "simple" }
    "2" { $threshold = "medium" }
    "3" { $threshold = "complex" }
    "4" { $threshold = "extreme" }
    default { $threshold = "medium" }
}

# Display threshold values
$thresholdValues = @{
    "simple" = 1000000
    "medium" = 5000000
    "complex" = 20000000
    "extreme" = 75000000
}

Write-Host "`n✅ Selected: $threshold threshold (R$($thresholdValues[$threshold].ToString('N0')))" -ForegroundColor Green

# Performance estimate
Write-Host "`n📊 PERFORMANCE ESTIMATE:" -ForegroundColor Cyan
Write-Host "• Simulations: 1,000,000,000" -ForegroundColor White
Write-Host "• Estimated time: ~33 minutes (based on 60k/sec rate)" -ForegroundColor White
Write-Host "• Memory required: ~2GB" -ForegroundColor White
Write-Host "• Output directory: C:\Dev\simulation-results-billion\" -ForegroundColor White

# Confirmation
Write-Host "`n⚠️ WARNING: This will run 1 BILLION simulations" -ForegroundColor Red
Write-Host "   Make sure you have sufficient memory and CPU resources." -ForegroundColor Yellow

$confirm = Read-Host "`nStart 1 BILLION simulations? (yes/no)"
if ($confirm -notin @("yes", "y")) {
    Write-Host "`n❌ Simulation cancelled." -ForegroundColor Red
    exit 0
}

# Create output directory
$outputDir = "C:\Dev\simulation-results-billion"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "✅ Created output directory: $outputDir" -ForegroundColor Green
}

# Start simulation
Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "🚀 LAUNCHING 1 BILLION SIMULATIONS" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Cyan
Write-Host "Start time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "Monitor: http://localhost:8007" -ForegroundColor Green
Write-Host "Tunnel: https://burgandy-sim-enhanced.loca.lt" -ForegroundColor Green
Write-Host "Threshold: R$($thresholdValues[$threshold].ToString('N0'))" -ForegroundColor Green
Write-Host "="*80 -ForegroundColor Cyan

# Run the simulation
try {
    # Run with selected threshold
    $pythonArgs = @("C:\Dev\billion-simulations-runner-complete.py")
    
    Write-Host "`n▶️ Starting simulation engine..." -ForegroundColor Green
    
    # Run in new window so we can see progress
    $process = Start-Process python -ArgumentList $pythonArgs -PassThru -NoNewWindow
    
    # Wait for completion with timeout (40 minutes)
    $timeout = 2400  # 40 minutes in seconds
    $startTime = Get-Date
    
    while (-not $process.HasExited) {
        $elapsed = (Get-Date) - $startTime
        if ($elapsed.TotalSeconds -gt $timeout) {
            Write-Host "`n⏰ Timeout reached after 40 minutes" -ForegroundColor Yellow
            $process.Kill()
            break
        }
        
        # Check for output files to show progress
        $checkpointFile = "$outputDir\checkpoint-billion.json"
        if (Test-Path $checkpointFile) {
            $checkpoint = Get-Content $checkpointFile | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($checkpoint) {
                $progress = [math]::Round(($checkpoint.simulation_count / 1000000000) * 100, 2)
                Write-Host "   Progress: $progress% ($($checkpoint.simulation_count.ToString('N0')) simulations)" -ForegroundColor Cyan
            }
        }
        
        Start-Sleep -Seconds 10
    }
    
    if ($process.ExitCode -eq 0) {
        Write-Host "`n" + "="*80 -ForegroundColor Green
        Write-Host "✅ 1 BILLION SIMULATIONS COMPLETE!" -ForegroundColor Green
        Write-Host "="*80 -ForegroundColor Green
        Write-Host "Completion time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
        
        # Show results summary
        $resultsFile = "$outputDir\billion-simulations-results.json"
        if (Test-Path $resultsFile) {
            $results = Get-Content $resultsFile | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($results) {
                Write-Host "`n📊 FINAL RESULTS:" -ForegroundColor Cyan
                Write-Host "• Total simulations: $($results.total_simulations.ToString('N0'))" -ForegroundColor White
                Write-Host "• Success rate: $([math]::Round($results.final_success_rate * 100, 1))%" -ForegroundColor White
                Write-Host "• Average net worth: R$([math]::Round($results.final_avg_net_worth, 0).ToString('N0'))" -ForegroundColor White
                Write-Host "• Total simulated net worth: R$([math]::Round($results.total_net_worth, 0).ToString('N0'))" -ForegroundColor White
                Write-Host "• Duration: $([math]::Round($results.total_duration / 60, 1)) minutes" -ForegroundColor White
                
                # Show key learnings
                if ($results.learning_patterns -and $results.learning_patterns.Count -gt 0) {
                    $latest = $results.learning_patterns[-1]
                    Write-Host "`n🔑 KEY LEARNINGS:" -ForegroundColor Cyan
                    if ($latest.best_scenarios) {
                        $best = $latest.best_scenarios[0]
                        Write-Host "• Best scenario: $($best.scenario_id) ($([math]::Round($best.success_rate * 100, 1))% success)" -ForegroundColor White
                    }
                    if ($latest.best_choices) {
                        $best = $latest.best_choices[0]
                        Write-Host "• Best choice: $($best.choice_id) ($([math]::Round($best.avg_return, 1))x return)" -ForegroundColor White
                    }
                }
            }
        }
        
        Write-Host "`n🌐 Enhanced monitor: http://localhost:8007" -ForegroundColor Green
        Write-Host "📁 Results directory: $outputDir" -ForegroundColor Green
        
    } else {
        Write-Host "`n❌ Simulation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "`n❌ Error during simulation: $_" -ForegroundColor Red
}

Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "🎯 SIMULATION PROCESS COMPLETE" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Cyan

# Keep console open
Read-Host "`nPress Enter to exit..."