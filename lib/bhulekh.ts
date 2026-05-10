const BHULEKH_URLS: Record<string, string> = {
  'Uttar Pradesh': 'upbhulekh.gov.in',
  'Maharashtra': 'mahabhumi.gov.in',
  'Madhya Pradesh': 'mpbhulekh.gov.in',
  'Rajasthan': 'apnakhata.raj.nic.in',
  'Haryana': 'jamabandi.nic.in',
  'Karnataka': 'landrecords.karnataka.gov.in',
  'Gujarat': 'anyror.gujarat.gov.in',
  'Bihar': 'lrc.bih.nic.in'
};

export function getBhulekhUrl(state: string, district?: string, tehsil?: string, village?: string, khasra?: string) {
  const baseUrl = BHULEKH_URLS[state] || 'landrecords.gov.in'; // fallback
  
  if (state === 'Uttar Pradesh') {
    // Generate simulated UP link
    return `https://${baseUrl}/public/public_ror/Public_ROR.jsp?district=${district || ''}&tehsil=${tehsil || ''}&village=${village || ''}&khasra=${khasra || ''}`;
  }

  return `https://${baseUrl}`;
}

export async function verifyLandRecord(khasraNumber: string, state: string, landSize: number, landUnit: string, ownerName: string) {
  // Simulating 3-step verification or API response
  return {
    khasraNumber,
    ownerName,
    landSize,
    landUnit,
    verificationUrl: getBhulekhUrl(state),
    verified: true // Assuming farmer confirmed
  };
}
