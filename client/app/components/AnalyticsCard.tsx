import { MousePointerClick, Clock, BarChart3, Sparkles } from "lucide-react";
import { UrlData } from "../interface/url-data";


export default function AnalyticsCard({ urlData }: { urlData: UrlData }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-gray-800">Analytics</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 font-medium">Total Clicks</span>
          </div>
          <span className="text-lg font-bold text-blue-600 animate-pulse">
            {urlData.click_count}
          </span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 font-medium">Last Visited</span>
          </div>
          <span className="text-xs font-semibold text-green-600">
            {formatDate(urlData.last_accessed)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600 font-medium">Created</span>
          </div>
          <span className="text-xs font-semibold text-purple-600">
            {formatDate(urlData.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}