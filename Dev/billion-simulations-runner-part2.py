        self.results["performance_metrics"] = {
            "total_simulations": self.results["total_simulations"],
            "total_duration_seconds": self.results["total_duration"],
            "simulations_per_second": self.results["total_simulations"] / self.results["total_duration"],
            "avg_batch_time": statistics.mean(self.batch_times) if self.batch_times else 0,
            "memory_usage_samples": len(self.memory_usage)
        }
        
        # Save to multiple formats
        with open(RESULTS_PATH, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        # Create bridge integration file
        bridge_data = {
            "simulation_complete": True,
            "timestamp": datetime.now().isoformat(),
            "total_simulations": self.results["total_simulations"],
            "success_rate": self.results["final_success_rate"],
            "avg_net_worth": self.results["final_avg_net_worth"],
            "key_learnings": self.extract_key_learnings(),
            "recommended_actions": self.generate_recommendations(),
            "integration_ready": True
        }
        
        with open(BRIDGE_INTEGRATION_PATH, 'w') as f:
            json.dump(bridge_data, f, indent=2)
        
        logger.info(f"Final results saved to {RESULTS_PATH}")
        logger.info(f"Bridge integration data saved to {BRIDGE_INTEGRATION_PATH}")
    
    def extract_key_learnings(self):
        """Extract key learnings from all patterns"""
        if not self.results["learning_patterns"]:
            return []
        
        latest_patterns = self.results["learning_patterns"][-1]
        
        key_learnings = [
            f"Overall success rate: {self.results['final_success_rate']:.1%}",
            f"Average net worth per simulation: R{self.results['final_avg_net_worth']:,.0f}",
            f"Total simulated net worth: R{self.results['total_net_worth']:,.0f}"
        ]
        
        # Add best scenarios
        for scenario in latest_patterns.get("best_scenarios", [])[:3]:
            key_learnings.append(
                f"Best scenario '{scenario['scenario_id']}': {scenario['success_rate']:.1%} success rate"
            )
        
        # Add best choices
        for choice in latest_patterns.get("best_choices", [])[:3]:
            key_learnings.append(
                f"Best choice '{choice['choice_id']}': {choice['success_rate']:.1%} success rate, {choice['avg_return']:.1f}x return"
            )
        
        return key_learnings
    
    def generate_recommendations(self):
        """Generate actionable recommendations based on simulations"""
        if not self.results["learning_patterns"]:
            return []
        
        latest_patterns = self.results["learning_patterns"][-1]
        recommendations = []
        
        # YouTube-focused recommendations
        youtube_scenarios = [s for s in latest_patterns.get("best_scenarios", []) 
                           if "youtube" in s["scenario_id"].lower()]
        if youtube_scenarios:
            best_youtube = youtube_scenarios[0]
            recommendations.append(
                f"Focus on YouTube {best_youtube['scenario_id'].replace('_', ' ')} scenarios "
                f"(success rate: {best_youtube['success_rate']:.1%})"
            )
        
        # Financial recommendations
        financial_choices = [c for c in latest_patterns.get("best_choices", []) 
                           if any(word in c["choice_id"] for word in ["balanced", "conservative", "aggressive"])]
        if financial_choices:
            best_financial = financial_choices[0]
            recommendations.append(
                f"Use {best_financial['choice_id'].replace('_', ' ')} financial strategy "
                f"(avg return: {best_financial['avg_return']:.1f}x)"
            )
        
        # Time allocation recommendations
        time_patterns = [p for p in latest_patterns.get("common_patterns", []) 
                        if "time" in p["pattern"].lower()]
        if time_patterns:
            best_time = time_patterns[0]
            recommendations.append(
                f"Adopt time allocation pattern: {best_time['pattern']} "
                f"(used in {best_time['percentage']:.1f}% of successful simulations)"
            )
        
        # General recommendation based on success rate
        if self.results["final_success_rate"] < 0.2:
            recommendations.append("Consider lowering success threshold or diversifying strategies")
        elif self.results["final_success_rate"] > 0.5:
            recommendations.append("Current strategies are effective - consider scaling successful approaches")
        
        return recommendations
    
    def run(self):
        """Main execution method"""
        logger.info("=" * 80)
        logger.info("🚀 STARTING 1 BILLION SIMULATIONS")
        logger.info("=" * 80)
        logger.info(f"Target: {SIMULATION_COUNT:,} simulations")
        logger.info(f"Success threshold: R{self.success_threshold:,}")
        logger.info(f"Batch size: {BATCH_SIZE:,}")
        logger.info(f"Output directory: {OUTPUT_PATH}")
        
        self.results["start_time"] = datetime.now().isoformat()
        start_time = time.time()
        
        try:
            total_batches = SIMULATION_COUNT // BATCH_SIZE
            
            for batch_num in range(total_batches):
                batch_start = time.time()
                
                # Run batch
                self.run_batch(BATCH_SIZE)
                
                # Calculate progress
                progress = (batch_num + 1) / total_batches * 100
                elapsed = time.time() - start_time
                rate = (batch_num + 1) * BATCH_SIZE / elapsed
                
                # Log progress
                if (batch_num + 1) % 10 == 0:  # Every 10 batches
                    logger.info(
                        f"Progress: {progress:.1f}% | "
                        f"Simulations: {self.results['total_simulations']:,} | "
                        f"Rate: {rate:,.0f}/sec | "
                        f"Success: {self.results['successful_simulations']:,} "
                        f"({self.results['successful_simulations']/self.results['total_simulations']:.1%}) | "
                        f"Avg Net Worth: R{self.results['total_net_worth']/self.results['total_simulations']:,.0f}"
                    )
                
                # Save checkpoint every 100 batches
                if (batch_num + 1) % 100 == 0:
                    self.save_checkpoint()
                
                # Estimate remaining time
                if batch_num % 50 == 0 and batch_num > 0:
                    remaining = (total_batches - batch_num) * (elapsed / (batch_num + 1))
                    logger.info(f"Estimated time remaining: {remaining/60:.1f} minutes")
            
            # Final save
            self.save_final_results()
            
            total_time = time.time() - start_time
            logger.info("=" * 80)
            logger.info("✅ 1 BILLION SIMULATIONS COMPLETE!")
            logger.info("=" * 80)
            logger.info(f"Total time: {total_time:.1f} seconds ({total_time/60:.1f} minutes)")
            logger.info(f"Final rate: {SIMULATION_COUNT/total_time:,.0f} simulations/second")
            logger.info(f"Success rate: {self.results['final_success_rate']:.1%}")
            logger.info(f"Average net worth: R{self.results['final_avg_net_worth']:,.0f}")
            logger.info(f"Total simulated net worth: R{self.results['total_net_worth']:,.0f}")
            
            # Print key learnings
            logger.info("\n🔑 KEY LEARNINGS:")
            for learning in self.extract_key_learnings():
                logger.info(f"  • {learning}")
            
            # Print recommendations
            logger.info("\n🎯 RECOMMENDED ACTIONS:")
            for recommendation in self.generate_recommendations():
                logger.info(f"  • {recommendation}")
            
            logger.info(f"\n📁 Results saved to: {OUTPUT_PATH}")
            logger.info(f"📊 Enhanced monitor: http://localhost:8007")
            
        except KeyboardInterrupt:
            logger.info("\n⚠️ Simulation interrupted by user")
            self.save_checkpoint()
            logger.info(f"Checkpoint saved at {self.results['total_simulations']:,} simulations")
        except Exception as e:
            logger.error(f"❌ Error during simulation: {e}")
            self.save_checkpoint()
            raise
        
        return self.results

def main():
    """Main entry point"""
    print("\n" + "="*80)
    print("🚀 BILLION SIMULATIONS RUNNER - ENHANCED")
    print("="*80)
    print(f"Target: 1,000,000,000 simulations")
    print(f"Output: C:\\Dev\\simulation-results-billion")
    print(f"Monitor: http://localhost:8007")
    print("="*80)
    
    # Get success threshold
    print("\nSelect success threshold:")
    print("1. Simple (R1,000,000)")
    print("2. Medium (R5,000,000)")
    print("3. Complex (R20,000,000)")
    print("4. Extreme (R75,000,000)")
    
    choice = input("\nEnter choice (1-4, default 2): ").strip()
    
    threshold_map = {"1": "simple", "2": "medium", "3": "complex", "4": "extreme"}
    threshold = threshold_map.get(choice, "medium")
    
    print(f"\nUsing {threshold} threshold: R{engine.SUCCESS_THRESHOLDS[threshold]:,}")
    
    # Confirm
    confirm = input("\nStart 1 BILLION simulations? (yes/no): ").strip().lower()
    if confirm not in ["yes", "y"]:
        print("Simulation cancelled.")
        return
    
    # Run simulation
    engine = BillionSimulationEngine(success_threshold=threshold)
    results = engine.run()
    
    return results

if __name__ == "__main__":
    main()