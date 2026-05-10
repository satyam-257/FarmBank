import { getServiceSupabase } from './supabase';

export async function calculateFarmScore(farmerId: string) {
  const supabase = getServiceSupabase();
  const { data: farmer, error: farmerError } = await supabase
    .from('farmers')
    .select('*')
    .eq('id', farmerId)
    .single();

  if (farmerError || !farmer) {
    throw new Error('Farmer not found');
  }

  const { data: loans, error: loansError } = await supabase
    .from('loan_applications')
    .select('*')
    .eq('farmer_id', farmerId);

  const satelliteData = farmer.satellite_data as any;
  const soilData = farmer.soil_health_data as any;
  
  let score = 0;
  
  // 1. Crop History Score (30% = 270pts)
  const cropScore = satelliteData?.cropDetected ? 
    Math.min(270, satelliteData.ndvi * 270) : 135;
  score += cropScore;
  
  // 2. Repayment History (25% = 225pts)
  const repaidLoans = (loans || []).filter(l => l.status === 'repaid');
  const totalLoans = (loans || []).length;
  const repaymentRate = totalLoans > 0 ? repaidLoans.length / totalLoans : 0.5;
  score += Math.floor(repaymentRate * 225);
  
  // 3. Land Size & Ownership (20% = 180pts)
  const landScore = farmer.land_verified ? 
    Math.min(180, (farmer.land_size || 0) * 20 + (farmer.land_ownership?.toLowerCase() === 'owned' ? 50 : 20)) : 90;
  score += landScore;
  
  // 4. Soil Health Score (10% = 90pts)
  const soilScore = soilData ? Math.floor(soilData.soilHealthScore * 0.9) : 45;
  score += soilScore;
  
  // 5. Location Risk (10% = 90pts)
  const locationScore = 65; // Static for now based on district
  score += locationScore;
  
  // 6. Years Farming (5% = 45pts)
  const yearsScore = Math.min(45, (farmer.years_farming || 0) * 3);
  score += yearsScore;

  const breakdown = {
    cropHistory: Math.floor(cropScore),
    repaymentHistory: Math.floor(repaymentRate * 225),
    landOwnership: Math.floor(landScore),
    soilHealth: soilScore,
    locationRisk: locationScore,
    yearsFarming: Math.floor(yearsScore),
    total: Math.floor(score)
  };
  
  const finalScore = Math.floor(score);
  
  await supabase
    .from('farmers')
    .update({ 
      farm_score: finalScore,
      farm_score_breakdown: breakdown
    })
    .eq('id', farmerId);
  
  return {
    score: finalScore,
    category: finalScore > 750 ? 'Excellent' : finalScore > 600 ? 'Good' : finalScore > 450 ? 'Fair' : 'Building',
    maxLoanEligible: finalScore > 750 ? 100000 : finalScore > 600 ? 75000 : finalScore > 450 ? 25000 : 10000,
    breakdown
  };
}
