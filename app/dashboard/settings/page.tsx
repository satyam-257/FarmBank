import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-500" />
            Provider Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Active WhatsApp Provider
              </label>
              <select 
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                defaultValue={process.env.WHATSAPP_PROVIDER || 'twilio'}
              >
                <option value="twilio">Twilio Sandbox</option>
                <option value="meta">Meta Cloud API</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Change `WHATSAPP_PROVIDER` in your .env file to switch providers.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input 
                type="text" 
                readOnly 
                value="https://your-domain.com/api/whatsapp" 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
