#!/usr/bin/env python3
"""
Simulation Engine V2 - Accumulative Progress Tracking
Runs simulations and accumulates counts instead of replacing them
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
        
        # Load existing progress if available
        self.progress_file = "C:/Dev/simulation-results/progress-v2.json"
        self.results_file = "C:/Dev/simulation-results/simulation-results-v2.json"
        self.learning_file = "C:/Dev/simulation-results/learning-db-v2.json"
        
        self.load_progress()
        
        # Initial conditions (Daryl's current state)
        self.initial_conditions = {
            "skills": ["youtube", "finance", "organisation", "productivity", 
                      "antigravity", "spline", "websiteautomation", "himalaya", 
                      "coding-agent", "skill-creator"],
            "resources": {
                "cash_zar": 50000,  # Starting capital
                "monthly_income_zar": 15000,  # Current income
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
        
        # Decision categories
        self.decision_categories = {
            "business": ["start_youtube_channel", "scale_existing_channel", 
                        "start_web_dev_agency", "create_online_course",
                        "affiliate_marketing", "consulting_services"],
            
            "investment": ["invest_stock_market", "invest_crypto", 
                          "invest_real_estate", "invest_education",
                          "invest_equipment", "save_cash"],
            
            "skill_development": ["learn_advanced_web_dev", "learn_video_production",
                                 "learn_marketing", "learn_financial_analysis",
                                 "learn_ai_tools", "learn_business_management"],
            
            "time_allocation": ["focus_youtube", "focus_web_dev", 
                               "focus_learning", "focus_marketing",
                               "balance_all", "outsource_tasks"],
            
            "risk_taking": ["high_risk_high_reward", "moderate_risk", 
                           "low_risk_slow_growth", "diversified_approach"]
        }
        
        print(f"Simulation Engine V2 Initialized")
        print(f"Previously completed: {self.simulation_count:,} simulations")
        print(f"Target: {self.total_simulations:,} total simulations")
        print(f"Remaining: {self.total_simulations - self.simulation_count:,} simulations")
        print(f"Initial Capital: ZAR {self.initial_conditions['resources']['cash_zar']:,}")
        print(f"Success Metric: ZAR 75,000,000+ net worth")
    
    def load_progress(self):
        """Load existing progress from file"""
        try:
            if os.path.exists(self.progress_file):
                with open(self.progress_file, 'r') as f:
                    progress = json.load(f)
                    self.simulation_count = progress.get("completed", 0)
                    print(f"Loaded progress: {self.simulation_count:,} simulations completed")
            
            # Load existing results
            if os.path.exists(self.results_file):
                with open(self.results_file, 'r') as f:
                    data = json.load(f)
                    self.results = data.get("simulations", [])
                    print(f"Loaded {len(self.results):,} existing simulation results")
            
            # Load existing learning DB
            if os.path.exists(self.learning_file):
                with open(self.learning_file, 'r') as f:
                    data = json.load(f)
                    self.learning_db = data.get("learnings", [])
                    print(f"Loaded {len(self.learning_db):,} existing learning entries")
                    
        except Exception as e:
            print(f"Error loading progress: {e}")
            self.simulation_count = 0
            self.results = []
            self.learning_db = []
    
    def save_progress(self):
        """Save current progress to file"""
        try:
            progress_data = {
                "completed": self.simulation_count,
                "total": self.total_simulations,
                "timestamp": datetime.datetime.now().isoformat(),
                "remaining": self.total_simulations - self.simulation_count,
                "completion_percentage": (self.simulation_count / self.total_simulations * 100) if self.total_simulations > 0 else 0
            }
            
            with open(self.progress_file, 'w', encoding='utf-8') as f:
                json.dump(progress_data, f, indent=2, ensure_ascii=False)
            
            print(f"Progress saved: {self.simulation_count:,}/{self.total_simulations:,} simulations")
            
        except Exception as e:
            print(f"Error saving progress: {e}")
    
    def run_simulation(self, sim_id: int) -> Dict[str, Any]:
        """Run a single 5-year simulation"""
        sim_start = time.time()
        
        # Initialize simulation state
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
            "events": [],
            "skill_levels": {skill: 1.0 for skill in self.initial_conditions["skills"]},
            "time_allocations": {category: 0.2 for category in ["youtube", "web_dev", "learning", "marketing", "admin"]}
        }
        
        # Market conditions for this simulation
        market_conditions = {
            "youtube_cpm_zar": random.uniform(20, 100),
            "web_dev_hourly_rate_zar": random.uniform(300, 800),
            "stock_market_return_pct": random.uniform(5, 15),
            "crypto_volatility_pct": random.uniform(20, 80),
            "real_estate_appreciation_pct": random.uniform(3, 10),
            "inflation_pct": random.uniform(4, 8)
        }
        
        # Run 5 years (60 months)
        for month in range(1, 61):
            # Apply monthly market conditions
            state = self.apply_market_conditions(state, market_conditions, month)
            
            # Make monthly decisions (1-3 decisions per month)
            num_decisions = random.randint(1, 3)
            for _ in range(num_decisions):
                decision = self.make_decision(state, month)
                outcome = self.calculate_decision_outcome(decision, state, month, market_conditions)
                
                decision["outcome"] = outcome["result"]
                decision["impact_zar"] = outcome["impact"]
                decision["skill_impact"] = outcome.get("skill_impact", {})
                
                # Apply financial impact
                state["cash_zar"] += outcome["impact"]
                
                # Apply skill impacts
                for skill, impact in outcome.get("skill_impact", {}).items():
                    if skill in state["skill_levels"]:
                        state["skill_levels"][skill] = max(1.0, state["skill_levels"][skill] + impact)
                
                state["decisions"].append(decision)
            
            # Update net worth
            state["net_worth_zar"] = state["cash_zar"]
            
            # Check for milestone achievement
            if state["net_worth_zar"] >= 75000000:
                state["years_to_milestone"] = month / 12
                break
        
        # Calculate final statistics
        successful_decisions = sum(1 for d in state["decisions"] if d["outcome"] == "positive")
        total_decisions = len(state["decisions"])
        
        result = {
            "simulation_id": sim_id,
            "final_net_worth_zar": state["net_worth_zar"],
            "final_monthly_income_zar": state["monthly_income_zar"],
            "final_cash_zar": state["cash_zar"],
            "years_simulated": min(5, month / 12),
            "years_to_milestone": state.get("years_to_milestone", None),
            "total_decisions": total_decisions,
            "successful_decisions": successful_decisions,
            "success_rate": successful_decisions / total_decisions if total_decisions > 0 else 0,
            "final_skill_levels": state["skill_levels"],
            "processing_time_seconds": time.time() - sim_start,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        # Extract learning
        learning = self.extract_learning(result, state)
        self.learning_db.append(learning)
        
        return result
    
    def apply_market_conditions(self, state: Dict, market_conditions: Dict, month: int) -> Dict:
        """Apply monthly market conditions"""
        # YouTube revenue
        youtube_revenue = (state["monthly_views"] * market_conditions["youtube_cpm_zar"] / 1000)
        state["monthly_income_zar"] = youtube_revenue
        
        # Web development income (if skill level is high)
        web_dev_skill = state["skill_levels"].get("antigravity", 1.0) * state["skill_levels"].get("spline", 1.0)
        if web_dev_skill > 1.5:
            web_dev_hours = 20 * (web_dev_skill - 1.0)  # More hours with higher skill
            web_dev_income = web_dev_hours * market_conditions["web_dev_hourly_rate_zar"]
            state["monthly_income_zar"] += web_dev_income
        
        # Apply expenses with inflation
        inflation_multiplier = 1 + (market_conditions["inflation_pct"] / 100 * (month / 12))
        state["monthly_expenses_zar"] = self.initial_conditions["resources"]["monthly_expenses_zar"] * inflation_multiplier
        
        # Update cash
        state["cash_zar"] += state["monthly_income_zar"] - state["monthly_expenses_zar"]
        
        # Natural growth (subscribers, views)
        if month % 6 == 0:  # Every 6 months
            growth_rate = random.uniform(0.05, 0.15) * state["skill_levels"].get("youtube", 1.0)
            state["subscribers"] = int(state["subscribers"] * (1 + growth_rate))
            state["monthly_views"] = int(state["monthly_views"] * (1 + growth_rate * 2))
        
        return state
    
    def make_decision(self, state: Dict, month: int) -> Dict:
        """Generate a random decision based on current state"""
        # Choose category
        category = random.choice(list(self.decision_categories.keys()))
        decision_type = random.choice(self.decision_categories[category])
        
        decision = {
            "month": month,
            "category": category,
            "decision": decision_type,
            "investment_zar": random.randint(1000, 10000) if category in ["business", "investment"] else 0,
            "time_investment_hours": random.randint(5, 40) if category == "skill_development" else 0
        }
        
        return decision
    
    def calculate_decision_outcome(self, decision: Dict, state: Dict, month: int, market_conditions: Dict) -> Dict:
        """Calculate outcome of a decision"""
        base_success_prob = 0.5
        impact_multiplier = 1.0
        
        # Adjust probability based on relevant skills
        if decision["category"] == "business":
            relevant_skills = ["youtube", "websiteautomation", "skill-creator"]
            skill_bonus = sum(state["skill_levels"].get(skill, 1.0) - 1.0 for skill in relevant_skills) / len(relevant_skills)
            base_success_prob += skill_bonus * 0.2
            
            if "youtube" in decision["decision"]:
                impact_multiplier = state["skill_levels"].get("youtube", 1.0)
            elif "web_dev" in decision["decision"]:
                impact_multiplier = state["skill_levels"].get("antigravity", 1.0) * state["skill_levels"].get("spline", 1.0)
        
        elif decision["category"] == "investment":
            relevant_skills = ["finance"]
            skill_bonus = (state["skill_levels"].get("finance", 1.0) - 1.0) * 0.3
            base_success_prob += skill_bonus
            
            if "stock" in decision["decision"]:
                impact_multiplier = 1 + (market_conditions["stock_market_return_pct"] / 100)
            elif "crypto" in decision["decision"]:
                impact_multiplier = 1 + (market_conditions["crypto_volatility_pct"] / 100 * random.uniform(-1, 1))
            elif "real_estate" in decision["decision"]:
                impact_multiplier = 1 + (market_conditions["real_estate_appreciation_pct"] / 100)
        
        elif decision["category"] == "skill_development":
            skill = decision.get("skill", random.choice(list(state["skill_levels"].keys())))
            return {
                "result": "positive",
                "impact": -decision.get("investment_zar", 500),
                "skill_impact": {skill: random.uniform(0.05, 0.2)}
            }
        
        # Determine outcome
        success = random.random() < min(0.95, max(0.05, base_success_prob))
        
        if success:
            base_impact = decision.get("investment_zar", decision.get("amount_zar", 1000))
            impact = base_impact * impact_multiplier * random.uniform(0.5, 2.0)
            
            skill_impact = {}
            if decision["category"] == "business":
                primary_skill = "youtube" if "youtube" in decision["decision"] else "antigravity"
                skill_impact[primary_skill] = random.uniform(0.1, 0.3)
            
            return {
                "result": "positive",
                "impact": impact,
                "skill_impact": skill_impact
            }
        else:
            base_impact = decision.get("investment_zar", decision.get("amount_zar", 1000))
            loss_pct = random.uniform(0.2, 0.8)
            impact = -base_impact * loss_pct
            
            skill_impact = {}
            if decision["category"] in ["business", "investment"]:
                skill_impact["finance"] = random.uniform(0.05, 0.1)
            
            return {
                "result": "negative",
                "impact": impact,
                "skill_impact": skill_impact
            }
    
    def extract_learning(self, result: Dict, state: Dict) -> Dict:
        """Extract learning from simulation result"""
        successful = result["final_net_worth_zar"] >= 75000000
        
        # Analyze decisions for patterns
        business_decisions = [d for d in state["decisions"] if d["category"] == "business"]
        investment_decisions = [d for d in state["decisions"] if d["category"] == "investment"]
        
        # Find most effective skill
        skill_gains = {}
        for decision in state["decisions"]:
            for skill, gain in decision.get("skill_impact", {}).items():
                skill_gains[skill] = skill_gains.get(skill, 0) + gain
        
        most_effective_skill = max(skill_gains.items(), key=lambda x: x[1])[0] if skill_gains else "none"
        
        # Find most profitable category
        category_profits = {}
        for decision in state["decisions"]:
            category = decision["category"]
            profit = decision.get("impact_zar", 0)
            category_profits[category] = category_profits.get(category, 0) + profit
        
        most_profitable_category = max(category_profits.items(), key=lambda x: x[1])[0] if category_profits else "none"
        
        learning = {
            "simulation_id": result["simulation_id"],
            "successful": successful,
            "final_net_worth": result["final_net_worth_zar"],
            "success_rate": result["success_rate"],
            "years_to_milestone": result.get("years_to_milestone"),
            "most_effective_skill": most_effective_skill,
            "most_profitable_category": most_profitable_category,
            "total_business_decisions": len(business