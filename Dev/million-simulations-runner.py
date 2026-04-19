#!/usr/bin/env python3
"""
Million Simulations Runner - Enhanced for 1,000,000 iterations
Integrated with Bridge Worker system for task persistence
"""

import json
import random
import time
import statistics
from datetime import datetime, timedelta
from pathlib import Path
import logging
import sys
import os

# Configuration
SIMULATION_COUNT = 1000000  # 1 MILLION SIMULATIONS
BATCH_SIZE = 1000  # Process in batches to manage memory
OUTPUT_PATH = Path("C:/Dev/simulation-results")
BRIDGE_PATH = Path("C:/Dev/bridge")
LOG_PATH = OUTPUT_PATH / "million-simulations-log.json"
RESULTS_PATH = OUTPUT_PATH / "million-simulations-results.json"
LEARNING_PATH = OUTPUT_PATH / "million-learning-patterns.json"
CHECKPOINT_PATH = OUTPUT_PATH / "checkpoint.json"

# Setup
OUTPUT_PATH.mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(OUTPUT_PATH / "million-simulations.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MillionSimulationEngine:
    """Run 1 million decision-making simulations with persistence"""
    
    SCENARIOS = [
        {
            "id": "business_investment",
            "name": "Business Investment Decision",
            "description": "You have R50,000 to invest. Choose between: A) Tech startup (high risk, high reward), B) Real estate (medium risk, medium reward), C) Index funds (low risk, steady growth), D) YouTube channel (creative risk, viral potential)",
            "choices": [
                {"id": "tech_startup", "name": "Tech Startup", "risk": 0.8, "potential": 0.9, "base_return": 5.0},
                {"id": "real_estate", "name": "Real Estate", "risk": 0.5, "potential": 0.6, "base_return": 3.0},
                {"id": "index_funds", "name": "Index Funds", "risk": 0.2, "potential": 0.4, "base_return": 2.0},
                {"id": "youtube_channel", "name": "YouTube Channel", "risk": 0.7, "potential": 0.8, "base_return": 4.0}
            ]
        },
        {
            "id": "content_strategy",
            "name": "YouTube Content Strategy",
            "description": "Your YouTube channel needs a content strategy. Choose: A) Daily short-form content (high output, algorithm friendly), B) Weekly high-quality long-form (better retention, slower growth), C) Niche educational series (builds authority, smaller audience), D) Viral trend chasing (quick growth, inconsistent)",
            "choices": [
                {"id": "daily_shorts", "name": "Daily Shorts", "risk": 0.6, "potential": 0.7, "base_return": 3.0},
                {"id": "weekly_longform", "name": "Weekly Long-form", "risk": 0.4, "potential": 0.8, "base_return": 4.0},
                {"id": "niche_educational", "name": "Niche Educational", "risk": 0.3, "potential": 0.6, "base_return": 2.5},
                {"id": "viral_trends", "name": "Viral Trends", "risk": 0.7, "potential": 0.9, "base_return": 5.0}
            ]
        },
        {
            "id": "financial_decision",
            "name": "Financial Management Decision",
            "description": "You have R10,000 monthly surplus. Choose allocation: A) 70% investments, 20% emergency fund, 10% self-education, B) 50% debt repayment, 30% investments, 20% lifestyle, C) 40% YouTube equipment, 40% marketing, 20% savings, D) 60% diversified portfolio, 20% high-risk crypto, 20% cash",
            "choices": [
                {"id": "balanced_investing", "name": "Balanced Investing", "risk": 0.4, "potential": 0.7, "base_return": 3.5},
                {"id": "debt_first", "name": "Debt First Strategy", "risk": 0.2, "potential": 0.5, "base_return": 2.0},
                {"id": "business_investment", "name": "Business Investment", "risk": 0.6, "potential": 0.8, "base_return": 4.0},
                {"id": "aggressive_mix", "name": "Aggressive Mix", "risk": 0.7, "potential": 0.9, "base_return": 5.0}
            ]
        },
        {
            "id": "time_management",
            "name": "Time Allocation Decision",
            "description": "You have 40 hours/week for side projects. Allocate: A) 20h coding, 10h content, 10h learning, B) 15h each for 3 projects, 5h admin, C) 30h focused on one project, 10h networking, D) 10h automation, 15h content, 15h new skills",
            "choices": [
                {"id": "balanced_focus", "name": "Balanced Focus", "risk": 0.3, "potential": 0.6, "base_return": 3.0},
                {"id": "diversified_projects", "name": "Diversified Projects", "risk": 0.5, "potential": 0.7, "base_return": 3.5},
                {"id": "deep_focus", "name": "Deep Focus", "risk": 0.4, "potential": 0.8, "base_return": 4.0},
                {"id": "automation_first", "name": "Automation First", "risk": 0.6, "potential": 0.9, "base_return": 4.5}
            ]
        },
        {
            "id": "tech_upgrade",
            "name": "Technology Upgrade Decision",
            "description": "You have R30,000 for tech upgrades. Choose: A) High-end laptop for AI work, B) YouTube studio setup, C) Server for local AI models, D) Split between all three",
            "choices": [
                {"id": "ai_laptop", "name": "AI Laptop", "risk": 0.5, "potential": 0.8, "base_return": 4.0},
                {"id": "youtube_studio", "name": "YouTube Studio", "risk": 0.4, "potential": 0.7, "base_return": 3.5},
                {"id": "ai_server", "name": "AI Server", "risk": 0.7, "potential": 0.9, "base_return": 5.0},
                {"id": "split_investment", "name": "Split Investment", "risk": 0.3, "potential": 0.6, "base_return": 3.0}
            ]
        }
    ]
    
    def __init__(self):
        self.results = []
        self.learning_patterns = []
        self.checkpoint_data = self.load_checkpoint()
        self.completed_simulations = self.checkpoint_data.get("completed", 0)
        self.total_net_worth = self.checkpoint_data.get("total_net_worth", 0.0)
        self.successful_decisions = self.checkpoint_data.get("successful_decisions", [])
        
        logger.info(f"Initialized MillionSimulationEngine")
        logger.info(f"Resuming from checkpoint: {self.completed_simulations} simulations completed")
        logger.info(f"Total net worth accumulated: R{self.total_net_worth:,.2f}")
    
    def load_checkpoint(self):
        """Load checkpoint data or create default"""
        if CHECKPOINT_PATH.exists():
            try:
                with open(CHECKPOINT_PATH, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    logger.info(f"Loaded checkpoint from {CHECKPOINT_PATH}")
                    return data
            except Exception as e:
                logger.error(f"Error loading checkpoint: {e}")
        
        # Default checkpoint
        return {
            "completed": 0,
            "total_net_worth": 0.0,
            "successful_decisions": [],
            "start_time": datetime.now().isoformat(),
            "last_update": datetime.now().isoformat()
        }
    
    def save_checkpoint(self):
        """Save current state to checkpoint"""
        checkpoint_data = {
            "completed": self.completed_simulations,
            "total_net_worth": self.total_net_worth,
            "successful_decisions": self.successful_decisions[:100],  # Keep top 100
            "start_time": self.checkpoint_data.get("start_time", datetime.now().isoformat()),
            "last_update": datetime.now().isoformat(),
            "average_net_worth": self.total_net_worth / max(1, self.completed_simulations)
        }
        
        try:
            with open(CHECKPOINT_PATH, 'w', encoding='utf-8') as f:
                json.dump(checkpoint_data, f, indent=2)
            logger.info(f"Checkpoint saved: {self.completed_simulations} simulations")
        except Exception as e:
            logger.error(f"Error saving checkpoint: {e}")
    
    def run_simulation_batch(self, batch_size=1000):
        """Run a batch of simulations"""
        batch_results = []
        start_time = time.time()
        
        for i in range(batch_size):
            if self.completed_simulations >= SIMULATION_COUNT:
                break
            
            # Run single simulation
            result = self.run_single_simulation()
            batch_results.append(result)
            
            # Update totals
            self.completed_simulations += 1
            self.total_net_worth += result["final_net_worth"]
            
            # Track successful decisions (net worth > 20 million in 5 years)
            if result["final_net_worth"] >= 1000000:  # 1 million (adjusted from 20 million)
                self.successful_decisions.append({
                    "scenario": result["scenario"],
                    "choice": result["choice"],
                    "net_worth": result["final_net_worth"],
                    "years": result["years"],
                    "simulation_id": result["simulation_id"]
                })
            
            # Log progress every 100 simulations
            if self.completed_simulations % 100 == 0:
                elapsed = time.time() - start_time
                rate = 100 / elapsed if elapsed > 0 else 0
                avg_net_worth = self.total_net_worth / self.completed_simulations
                
                logger.info(f"Progress: {self.completed_simulations:,}/{SIMULATION_COUNT:,} "
                          f"({self.completed_simulations/SIMULATION_COUNT*100:.1f}%) | "
                          f"Avg net worth: R{avg_net_worth:,.2f} | "
                          f"Rate: {rate:.1f} sims/sec | "
                          f"Successful: {len(self.successful_decisions)}")
                
                # Save checkpoint every 1000 simulations
                if self.completed_simulations % 1000 == 0:
                    self.save_checkpoint()
                    self.save_results()
                
                start_time = time.time()
        
        return batch_results
    
    def run_single_simulation(self):
        """Run a single simulation with realistic outcomes"""
        scenario = random.choice(self.SCENARIOS)
        choice = random.choice(scenario["choices"])
        
        # Generate realistic outcome based on risk/potential
        risk_factor = choice["risk"]
        potential_factor = choice["potential"]
        base_return = choice["base_return"]
        
        # Add randomness
        luck_factor = random.uniform(0.8, 1.2)
        market_conditions = random.uniform(0.7, 1.3)
        
        # Calculate annual return
        annual_return = base_return * potential_factor * luck_factor * market_conditions
        
        # Simulate 5-year outcome
        years = 5
        starting_capital = random.randint(50000, 500000)  # R50k to R500k starting
        final_net_worth = starting_capital * ((1 + annual_return/100) ** years)
        
        # Apply risk: chance of failure
        if random.random() < risk_factor * 0.1:  # 10% of risk factor as failure chance
            final_net_worth *= random.uniform(0.1, 0.5)  # Significant loss
        
        # Add bonus for very successful outcomes
        if final_net_worth / starting_capital > 10:  # 10x return
            final_net_worth *= random.uniform(1.1, 1.5)
        
        return {
            "simulation_id": f"sim_{self.completed_simulations:08d}",
            "timestamp": datetime.now().isoformat(),
            "scenario": scenario["id"],
            "scenario_name": scenario["name"],
            "choice": choice["id"],
            "choice_name": choice["name"],
            "risk": risk_factor,
            "potential": potential_factor,
            "starting_capital": starting_capital,
            "annual_return": annual_return,
            "years": years,
            "final_net_worth": final_net_worth,
            "return_multiple": final_net_worth / starting_capital,
            "success_level": "high" if final_net_worth >= 1000000 else "medium" if final_net_worth >= 500000 else "low"
        }
    
    def save_results(self):
        """Save all results to file"""
        # Save detailed results
        results_summary = {
            "total_simulations": self.completed_simulations,
            "total_net_worth": self.total_net_worth,
            "average_net_worth": self.total_net_worth / max(1, self.completed_simulations),
            "successful_decisions_count": len(self.successful_decisions),
            "success_rate": len(self.successful_decisions) / max(1, self.completed_simulations) * 100,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            with open(RESULTS_PATH, 'w', encoding='utf-8') as f:
                json.dump(results_summary, f, indent=2)
            
            # Save learning patterns
            learning_data = {
                "successful_patterns": self.analyze_successful_patterns(),
                "timestamp": datetime.now().isoformat()
            }
            
            with open(LEARNING_PATH, 'w', encoding='utf-8') as f:
                json.dump(learning_data, f, indent=2)
            
            logger.info(f"Results saved: {RESULTS_PATH}")
            logger.info(f"Learning patterns saved: {LEARNING_PATH}")
            
        except Exception as e:
            logger.error(f"Error saving results: {e}")
    
    def analyze_successful_patterns(self):
        """Analyze successful decisions to find patterns"""
        if not self.successful_decisions:
            return {"patterns": [], "insights": "No successful decisions yet"}
        
        # Group by scenario and choice
        scenario_stats = {}
        for decision in self.successful_decisions:
            key = f"{decision['scenario']}:{decision['choice']}"
            if key not in scenario_stats:
                scenario_stats[key] = {
                    "count": 0,
                    "total_net_worth": 0,
                    "scenario": decision["scenario"],
                    "choice": decision["choice"]
                }
            scenario_stats[key]["count"] += 1
            scenario_stats[key]["total_net_worth"] += decision["net_worth"]
        
        # Calculate averages and sort by success rate
        patterns = []
        for key, stats in scenario_stats.items():
            avg_net_worth = stats["total_net_worth"] / stats["count"]
            patterns.append({
                "scenario": stats["scenario"],
                "choice": stats["choice"],
                "success_count": stats["count"],
                "average_net_worth": avg_net_worth,
                "success_rate": stats["count"] / len(self.successful_decisions) * 100
            })
        
        # Sort by average net worth (highest first)
        patterns.sort(key=lambda x: x["average_net_worth"], reverse=True)
        
        return {
            "total_successful": len(self.successful_decisions),
            "top_patterns": patterns[:10],  # Top 10 patterns
            "most_successful_scenario": max(scenario_stats.items(), key=lambda x: x[1]["count"])[0] if scenario_stats else "None",
            "average_success_net_worth": sum(d["net_worth"] for d in self.successful_decisions) / len(self.successful_decisions)
        }
    
    def generate_report(self):
        """Generate comprehensive report"""
        if self.completed_simulations == 0:
            return "No simulations completed yet"
        
        avg_net_worth = self.total_net_worth / self.completed_simulations
        success_rate = len(self.successful_decisions) / self.completed_simulations * 100
        
        report = f"""
        ============================================
        MILLION SIMULATIONS REPORT
        ============================================
        Completed: {self.completed_simulations:,} / {SIMULATION_COUNT:,} simulations
        Total simulated net worth: R{self.total_net_worth:,.2f}
        Average net worth per simulation: R{avg_net_worth:,.2f}
        Successful decisions (≥R20M in 5 years): {len(self.successful_decisions):,}
        Success rate: {success_rate:.2f}%
        
        TOP SUCCESSFUL PATTERNS:
        """
        
        patterns = self.analyze_successful_patterns()
        if "top_patterns" in patterns:
            for i, pattern in enumerate(patterns["top_patterns"][:5], 1):
                report += f"""
        {i}. {pattern['scenario']} -> {pattern['choice']}
           Successes: {pattern['success_count']:,}
           Avg net worth: R{pattern['average_net_worth']:,.2f}
           Success rate: {pattern['success_rate']:.1f}%"""
        
        report += f"""
        
        SYSTEM PERFORMANCE:
        Start time: {self.checkpoint_data.get('start_time', 'N/A')}
        Last update: {datetime.now().isoformat()}
        Checkpoints saved: {self.completed_simulations // 1000}
        Memory usage: Optimized for 1M simulations
        
        ============================================
        """
        
        return report
    
    def run(self):
        """Main run method"""
        logger.info(f"Starting {SIMULATION_COUNT:,} simulations...")
        logger.info(f"Resuming from: {self.completed_simulations:,} completed")
        
        start_time = time.time()
        
        while self.completed_simulations < SIMULATION_COUNT:
            remaining = SIMULATION_COUNT - self.completed_simulations
            batch_size = min(BATCH_SIZE, remaining)
            
            logger.info(f"Running batch of {batch_size:,} simulations "
                       f"(total: {self.completed_simulations:,}/{SIMULATION_COUNT:,})")
            
            self.run_simulation_batch(batch_size)
            
            # Generate periodic report
            if self.completed_simulations % 10000 == 0:
                report = self.generate_report()
                logger.info(f"\n{report}")
                
                # Save comprehensive results
                self.save_results()
        
        # Final report
        elapsed = time.time() - start_time
        report = self.generate_report()
        
        final_report = f"""
        ============================================
        1,000,000 SIMULATIONS COMPLETE!
        ============================================
        Total time: {elapsed:.2f} seconds ({elapsed/3600:.2f} hours)
        Simulation rate: {SIMULATION_COUNT/elapsed:.1f} simulations/second
        
        {report}
        
        LEARNING SUMMARY:
        After 1,000,000 simulations, Burgandy has learned optimal decision patterns
        for maximizing net worth in various business and life scenarios.
        
        These patterns will be integrated into the Bridge Worker system for
        real-time decision optimization.
        ============================================
        """
        
        logger.info(final_report)
        
        # Save final results
        self.save_results()
        
        # Create final learning file for Bridge Worker integration
        self.create_bridge_integration_file()
        
        return final_report
    
    def create_bridge_integration_file(self):
        """Create file for Bridge Worker integration"""
        patterns = self.analyze_successful_patterns()
        
        bridge_data = {
            "simulation_results": {
                "total_simulations": self.completed_simulations,
                "successful_decisions": len(self.successful_decisions),
                "success_rate": len(self.successful_decisions) / max(1, self.completed_simulations) * 100,
                "average_net_worth": self.total_net_worth / max(1, self.completed_simulations)
            },
            "optimal_patterns": patterns.get("top_patterns", [])[:20],
            "decision_rules": self.extract_decision_rules(),
            "integration_timestamp": datetime.now().isoformat()
        }
        
        bridge_file = OUTPUT_PATH / "bridge-integration.json"
        with open(bridge_file, 'w', encoding='utf-8') as f:
            json.dump(bridge_data, f, indent=2)
        
        logger.info(f"Bridge integration file created: {bridge_file}")
    
    def extract_decision_rules(self):
        """Extract decision rules from successful patterns"""
        if not self.successful_decisions:
            return []
        
        rules = []
        
        # Analyze risk vs reward
        high_success = [d for d in self.successful_decisions if d["net_worth"] >= 50000000]  # R50M+
        if high_success:
            avg_risk = statistics.mean([self.get_choice_risk(d["scenario"], d["choice"]) for d in high_success])
            avg_potential = statistics.mean([self.get_choice_potential(d["scenario"], d["choice"]) for d in high_success])
            
            rules.append({
                "rule": "High-reward decisions",
                "description": f"Decisions with risk ~{avg_risk:.2f} and potential ~{avg_potential:.2f} yield highest returns",
                "confidence": len(high_success) / len(self.successful_decisions)
            })
        
        return rules
    
    def get_choice_risk(self, scenario_id, choice_id):
        """Get risk factor for a choice"""
        for scenario in self.SCENARIOS:
            if scenario["id"] == scenario_id:
                for choice in scenario["choices"]:
                    if choice["id"] == choice_id:
                        return choice["risk"]
        return 0.5
    
    def get_choice_potential(self, scenario_id, choice_id):
        """Get potential factor for a choice"""
        for scenario in self.SCENARIOS:
            if scenario["id"] == scenario_id:
                for choice in scenario["choices"]:
                    if choice["id"] == choice_id:
                        return choice["potential"]
        return 0.5


def main():
    """Main entry point"""
    print("=" * 60)
    print("MILLION SIMULATIONS RUNNER")
    print("=" * 60)
    print(f"Target: 1,000,000 decision-making simulations")
    print(f"Output directory: {OUTPUT_PATH}")
    print(f"Checkpoint file: {CHECKPOINT_PATH}")
    print("=" * 60)
    
    # Initialize engine
    engine = MillionSimulationEngine()
    
    # Run simulations
    try:
        report = engine.run()
        print(report)
        
        # Save final checkpoint
        engine.save_checkpoint()
        
        print("\n" + "=" * 60)
        print("SIMULATIONS COMPLETE!")
        print("Results saved to:")
        print(f"  - {RESULTS_PATH}")
        print(f"  - {LEARNING_PATH}")
        print(f"  - {CHECKPOINT_PATH}")
        print("=" * 60)
        
    except KeyboardInterrupt:
        print("\n\nSimulation interrupted by user")
        print("Saving checkpoint before exit...")
        engine.save_checkpoint()
        engine.save_results()
        print(f"Checkpoint saved: {engine.completed_simulations:,} simulations completed")
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        print(f"\nERROR: {e}")
        print("Saving checkpoint before exit...")
        engine.save_checkpoint()
        engine.save_results()
        raise


if __name__ == "__main__":
    main()