#!/usr/bin/env python3
"""
Simulation Engine V2 - Complete with Accumulative Progress
Runs simulations and accumulates counts for 1 million simulations
"""

import json
import random
import time
import datetime
import math
from typing import Dict, List, Tuple, Any
import sys
import os

class SimulationEngineV2:
    def __init__(self, total_simulations=1000000):
        self.start_time = time.time()
        self.simulation_count = 0
        self.total_simulations = total_simulations
        self.results = []
        self.learning_db = []
        
        # File paths
        self.progress_file = "C:/Dev/simulation-results/progress-v2.json"
        self.results_file = "C:/Dev/simulation-results/simulation-results-v2.json"
        self.learning_file = "C:/Dev/simulation-results/learning-db-v2.json"
        self.summary_file = "C:/Dev/simulation-results/simulation-summary-v2.md"
        
        # Load existing progress
        self.load_progress()
        
        # Initial conditions
        self.initial_conditions = {
            "skills": ["youtube", "finance", "organisation", "productivity", 
                      "antigravity", "spline", "websiteautomation", "himalaya", 
                      "coding-agent", "skill-creator"],
            "resources": {
                "cash_zar": 50000,
                "monthly_income_zar": 15000,
                "monthly_expenses_zar": 12000,
                "equipment": ["laptop", "phone", "basic_recording_gear"],
                "knowledge": ["web_dev", "video_editing", "basic_finance"]
            },
            "channels": {
                "youtube_channels": 4,
                "subscribers": 1000,
                "monthly_views": 5000
            },
            "time_available_hours_week": 40
        }
        
        print(f"Simulation Engine V2 Initialized")
        print(f"Previously completed: {self.simulation_count:,} simulations")
        print(f"Target: {self.total_simulations:,} total simulations")
        print(f"Remaining: {self.total_simulations - self.simulation_count:,} simulations")
    
    def load_progress(self):
        """Load existing progress from files"""
        try:
            # Load progress
            if os.path.exists(self.progress_file):
                with open(self.progress_file, 'r') as f:
                    progress = json.load(f)
                    self.simulation_count = progress.get("completed", 0)
                    print(f"Loaded progress: {self.simulation_count:,} simulations completed")
            
            # Load results
            if os.path.exists(self.results_file):
                with open(self.results_file, 'r') as f:
                    data = json.load(f)
                    self.results = data.get("simulations", [])
                    print(f"Loaded {len(self.results):,} existing results")
            
            # Load learning DB
            if os.path.exists(self.learning_file):
                with open(self.learning_file, 'r') as f:
                    data = json.load(f)
                    self.learning_db = data.get("learnings", [])
                    print(f"Loaded {len(self.learning_db):,} learning entries")
                    
        except Exception as e:
            print(f"Error loading progress: {e}")
            self.simulation_count = 0
            self.results = []
            self.learning_db = []
    
    def save_progress(self):
        """Save all progress to files"""
        try:
            # Save progress
            progress_data = {
                "completed": self.simulation_count,
                "total": self.total_simulations,
                "timestamp": datetime.datetime.now().isoformat(),
                "remaining": self.total_simulations - self.simulation_count,
                "completion_percentage": (self.simulation_count / self.total_simulations * 100) if self.total_simulations > 0 else 0
            }
            
            with open(self.progress_file, 'w', encoding='utf-8') as f:
                json.dump(progress_data, f, indent=2, ensure_ascii=False)
            
            # Save results
            results_data = {
                "timestamp": datetime.datetime.now().isoformat(),
                "total_simulations": len(self.results),
                "processing_time_seconds": time.time() - self.start_time,
                "successful_simulations": len([r for r in self.results if r.get("final_net_worth_zar", 0) >= 75000000]),
                "simulations": self.results
            }
            
            with open(self.results_file, 'w', encoding='utf-8') as f:
                json.dump(results_data, f, indent=2, ensure_ascii=False)
            
            # Save learning DB
            learning_data = {
                "timestamp": datetime.datetime.now().isoformat(),
                "total_entries": len(self.learning_db),
                "learnings": self.learning_db
            }
            
            with open(self.learning_file, 'w', encoding='utf-8') as f:
                json.dump(learning_data, f, indent=2, ensure_ascii=False)
            
            print(f"Progress saved: {self.simulation_count:,}/{self.total_simulations:,} simulations")
            
        except Exception as e:
            print(f"Error saving progress: {e}")
    
    def run_batch(self, batch_size=100):
        """Run a batch of simulations"""
        print(f"\nRunning batch of {batch_size} simulations...")
        batch_start = time.time()
        
        for i in range(batch_size):
            sim_id = self.simulation_count + i + 1
            
            # Run simulation
            result = self.run_single_simulation(sim_id)
            self.results.append(result)
            
            # Progress update
            if (i + 1) % 10 == 0:
                elapsed = time.time() - batch_start
                sims_per_second = (i + 1) / elapsed
                remaining = batch_size - (i + 1)
                eta = remaining / sims_per_second if sims_per_second > 0 else 0
                
                print(f"  Progress: {i + 1}/{batch_size} | {sims_per_second:.1f} sims/sec | ETA: {eta:.1f}s")
        
        # Update counts
        self.simulation_count += batch_size
        
        # Save progress
        self.save_progress()
        
        batch_time = time.time() - batch_start
        print(f"Batch completed in {batch_time:.2f} seconds ({batch_time/batch_size:.3f} sec/sim)")
    
    def run_single_simulation(self, sim_id: int) -> Dict[str, Any]:
        """Run a single 5-year simulation"""
        # Initialize state
        state = {
            "year": 0,
            "cash_zar": self.initial_conditions["resources"]["cash_zar"],
            "monthly_income_zar": self.initial_conditions["resources"]["monthly_income_zar"],
            "monthly_expenses_zar": self.initial_conditions["resources"]["monthly_expenses_zar"],
            "net_worth_zar": self.initial_conditions["resources"]["cash_zar"],
            "skills": self.initial_conditions["skills"].copy(),
            "youtube_channels": self.initial_conditions["channels"]["youtube_channels"],
            "subscribers": self.initial_conditions["channels"]["subscribers"],
            "monthly_views": self.initial_conditions["channels"]["monthly_views"],
            "decisions": [],
            "skill_levels": {skill: 1.0 for skill in self.initial_conditions["skills"]}
        }
        
        # Market conditions
        market = {
            "youtube_cpm_zar": random.uniform(20, 100),
            "web_dev_rate_zar": random.uniform(300, 800),
            "stock_return_pct": random.uniform(5, 15),
            "crypto_vol_pct": random.uniform(20, 80),
            "real_estate_pct": random.uniform(3, 10),
            "inflation_pct": random.uniform(4, 8)
        }
        
        # Decision categories
        categories = {
            "business": ["youtube_channel", "web_dev_agency", "online_course", "consulting"],
            "investment": ["stocks", "crypto", "real_estate", "education", "equipment"],
            "skill_dev": ["web_dev", "video_editing", "marketing", "finance", "ai_tools"],
            "time_mgmt": ["focus_youtube", "focus_web_dev", "balance", "outsource"],
            "risk": ["high_risk", "moderate_risk", "low_risk", "diversified"]
        }
        
        # Run 5 years (60 months)
        milestone_reached = False
        for month in range(1, 61):
            # Monthly market effects
            state = self.apply_monthly_effects(state, market, month)
            
            # Make decisions (1-3 per month)
            for _ in range(random.randint(1, 3)):
                decision = self.make_random_decision(categories)
                outcome = self.calculate_outcome(decision, state, market)
                
                # Apply outcome
                state["cash_zar"] += outcome["impact"]
                for skill, gain in outcome.get("skill_gain", {}).items():
                    if skill in state["skill_levels"]:
                        state["skill_levels"][skill] += gain
                
                decision["outcome"] = outcome["result"]
                decision["impact"] = outcome["impact"]
                state["decisions"].append(decision)
            
            # Update net worth
            state["net_worth_zar"] = state["cash_zar"]
            
            # Check milestone
            if state["net_worth_zar"] >= 75000000:
                milestone_reached = True
                years_to_milestone = month / 12
                break
        
        # Calculate statistics
        successful_decisions = sum(1 for d in state["decisions"] if d.get("outcome") == "positive")
        total_decisions = len(state["decisions"])
        
        result = {
            "simulation_id": sim_id,
            "final_net_worth_zar": state["net_worth_zar"],
            "final_monthly_income_zar": state["monthly_income_zar"],
            "years_simulated": min(5, month / 12),
            "years_to_milestone": years_to_milestone if milestone_reached else None,
            "total_decisions": total_decisions,
            "successful_decisions": successful_decisions,
            "success_rate": successful_decisions / total_decisions if total_decisions > 0 else 0,
            "milestone_reached": milestone_reached,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        # Extract learning
        self.extract_learning(result, state)
        
        return result
    
    def apply_monthly_effects(self, state: Dict, market: Dict, month: int) -> Dict:
        """Apply monthly market effects"""
        # YouTube revenue
        youtube_revenue = (state["monthly_views"] * market["youtube_cpm_zar"] / 1000)
        state["monthly_income_zar"] = youtube_revenue
        
        # Web dev income
        web_dev_skill = state["skill_levels"].get("antigravity", 1.0)
        if web_dev_skill > 1.2:
            hours = 20 * (web_dev_skill - 1.0)
            state["monthly_income_zar"] += hours * market["web_dev_rate_zar"]
        
        # Expenses with inflation
        inflation = 1 + (market["inflation_pct"] / 100 * (month / 12))
        state["monthly_expenses_zar"] = self.initial_conditions["resources"]["monthly_expenses_zar"] * inflation
        
        # Update cash
        state["cash_zar"] += state["monthly_income_zar"] - state["monthly_expenses_zar"]
        
        # Natural growth
        if month % 6 == 0:
            growth = random.uniform(0.05, 0.15) * state["skill_levels"].get("youtube", 1.0)
            state["subscribers"] = int(state["subscribers"] * (1 + growth))
            state["monthly_views"] = int(state["monthly_views"] * (1 + growth * 1.5))
        
        return state
    
    def make_random_decision(self, categories: Dict) -> Dict:
        """Make a random decision"""
        category = random.choice(list(categories.keys()))
        decision = random.choice(categories[category])
        
        return {
            "category": category,
            "decision": decision,
            "investment": random.randint(1000, 10000) if category in ["business", "investment"] else 0
        }
    
    def calculate_outcome(self, decision: Dict, state: Dict, market: Dict) -> Dict:
        """Calculate decision outcome"""
        base_prob = 0.5
        multiplier = 1.0
        
        # Skill bonuses
        if decision["category"] == "business":
            skill_bonus = sum(state["skill_levels"].get(skill, 1.0) - 1.0 
                            for skill in ["youtube", "antigravity", "websiteautomation"]) / 3
            base_prob += skill_bonus * 0.2
            
            if "youtube" in decision["decision"]:
                multiplier = state["skill_levels"].get("youtube", 1.0)
            elif "web_dev" in decision["decision"]:
                multiplier = state["skill_levels"].get("antigravity", 1.0)
        
        elif decision["category"] == "investment":
            finance_skill = state["skill_levels"].get("finance", 1.0)
            base_prob += (finance_skill - 1.0) * 0.3
            
            if "stocks" in decision["decision"]:
                multiplier = 1 + (market["stock_return_pct"] / 100)
            elif "crypto" in decision["decision"]:
                multiplier = 1 + (market["crypto_vol_pct"] / 100 * random.uniform(-1, 1))
            elif "real_estate" in decision["decision"]:
                multiplier = 1 + (market["real_estate_pct"] / 100)
        
        elif decision["category"] == "skill_dev":
            skill = decision["decision"]
            return {
                "result": "positive",
                "impact": -500,  # Learning cost
                "skill_gain": {skill: random.uniform(0.05, 0.2)}
            }
        
        # Determine success
        success = random.random() < min(0.9, max(0.1, base_prob))
        
        if success:
            impact = decision.get("investment", 1000) * multiplier * random.uniform(0.5, 2.0)
            skill_gain = {}
            
            if decision["category"] == "business":
                primary = "youtube" if "youtube" in decision["decision"] else "antigravity"
                skill_gain[primary] = random.uniform(0.1, 0.3)
            
            return {
                "result": "positive",
                "impact": impact,
                "skill_gain": skill_gain
            }
        else:
            loss = decision.get("investment", 1000) * random.uniform(0.2, 0.8)
            skill_gain = {"finance": random.uniform(0.05, 0.1)}  # Learn from failure
            
            return {
                "result": "negative",
                "impact": -loss,
                "skill_gain": skill_gain
            }
    
    def extract_learning(self, result: Dict, state: Dict):
        """Extract learning from simulation"""
        # Analyze skill effectiveness
        skill_gains = {}
        for decision in state["decisions"]:
            gains = decision.get("skill_gain", {})
            for skill, gain in gains.items():
                skill_gains[skill] = skill_gains.get(skill, 0) + gain
        
        most_effective = max(skill_gains.items(), key=lambda x: x[1])[0] if skill_gains else "none"
        
        # Analyze category profitability
        category_profits = {}
        for decision in state["decisions"]:
            category = decision["category"]
            profit = decision.get("impact", 0)
            category_profits[category] = category_profits.get(category, 0) + profit
        
        most_profitable = max(category_profits.items(), key=lambda x: x[1])[0] if category_profits else "none"
        
        learning = {
            "simulation_id": result["simulation_id"],
            "successful": result["milestone_reached"],
            "net_worth": result["final_net_worth_zar"],
            "success_rate": result["success_rate"],
            "most_effective_skill": most_effective,
            "most_profitable_category": most_profitable,
            "total_decisions": result["total_decisions"]
        }
        
        self.learning_db.append(learning)
    
    def generate_summary(self):
        """Generate summary report"""
        total_time = time.time() - self.start_time
        
        successful = [r for r in self.results if r.get("milestone_reached", False)]
        millionaires = [r for r in self.results if r.get("final_net_worth_zar", 0) >= 1000000]
        
        summary = f"""# Simulation Training Report - V2
## Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Overview
- Total simulations: {len(self.results):,}
- Processing time: {total_time:.1f} seconds ({total_time/3600:.2f} hours)
- Average time per simulation: {total_time/len(self.results):.3f} seconds
- Simulations per second: {len(self.results)/total_time:.1f}

## Success Metrics
- Successful simulations (ZAR 75M+): {len(successful):,} ({len(successful)/len(self.results)*100:.1f}%)
- Millionaires (ZAR 1M+): {len(millionaires):,} ({len(millionaires)/len(self.results)*100:.1f}%)
- Average final net worth: ZAR {sum(r["final_net_worth_zar"] for r in self.results)/len(self.results):,.0f}

## Learning Insights
- Most common effective skill: {self.get_most_common_skill()}
- Most profitable category: {self.get_most_profitable_category()}
- Average success rate: {sum(r["success_rate"] for r in self.results)/len(self.results)*100:.1f}%

## Files
- Results: simulation-results-v2.json
- Progress: progress-v2.json
- Learning: learning-db-v2.json
- This report: simulation-summary-v2.md
"""

        with open(self.summary_file, 'w', encoding='utf-8') as f:
            f.write(summary)
        
        print(f"\nSummary saved to: {self.summary_file}")
    
    def get_most_common_skill(self):
        """Get most common effective skill"""
        skill_counts = {}
        for learning in self.learning_db:
            skill = learning.get("most_effective_skill")
            if skill and skill != "none":
                skill_counts[skill] = skill_counts.get(skill, 0) + 1
        
        if skill_counts:
            return max(skill_counts.items(), key=lambda x: x[1])[0]
        return "None"
    
    def get_most_profitable_category(self):
        """Get most profitable category"""
        category_counts = {}
        for learning in self.learning_db:
            category = learning.get("most_profitable_category")
            if category and category != "none":
                category_counts[category] = category_counts.get(category, 0) + 1
        
        if category_counts:
            return max(category_counts.items(), key=lambda x: x[1])[0]
        return "None"

def main():
    """Main entry point"""
    import sys
    
    print("Burgundy Simulation Engine V2")
    print("=" * 50)
    
    # Get batch size from command line
    batch_size = 100
    if len(sys.argv) > 1:
        try:
            batch_size = int(sys.argv[1])
        except ValueError:
            print(f"Invalid batch size: {sys.argv[1]}, using default 100")
    
    # Create engine
    engine = SimulationEngineV2(total_simulations=1000000)
    
    # Run batch
    engine.run_batch(batch_size)
    
    # Generate summary
    engine.generate_summary()
    
    print(f"\n[COMPLETE] Batch of {batch_size} simulations finished!")
    print(f"Total simulations completed: {engine.simulation_count:,}")
    print(f"Target: 1,000,000 simulations")
    print(f"Progress: {(engine.simulation_count/1000000*100):.2f}%")

if __name__ == "__main__":
    main()