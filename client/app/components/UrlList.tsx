import { Link, Check, Copy, ExternalLink } from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";
import { UrlData } from "../interface/url-data";

export default function UrlList({ urls, onCopy, copiedCode }: { 
  urls: UrlData[], 
  onCopy: (code: string) => void,
  copiedCode: string 
}) {
  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <Link className="w-16 h-16 text-purple-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">No URLs shortened yet</p>
        <p className="text-gray-400 text-sm mt-2">Create your first short URL above!</p>
      </div>
    );
  }



  return (
    <div className="space-y-4">
      {urls.map((urlData, index) => (
        <div
          key={urlData.id}
          className="bg-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-lg transition-all animate-slide-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-mono text-sm font-bold shadow-lg">
                  /{urlData.short_code}
                </span>
                <button
                  onClick={() => onCopy(urlData.short_code)}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-all transform hover:scale-110 active:scale-95"
                  title="Copy to clipboard"
                >
                  {copiedCode === urlData.short_code ? (
                    <Check className="w-4 h-4 text-green-600 animate-bounce" />
                  ) : (
                    <Copy className="w-4 h-4 text-purple-400" />
                  )}
                </button>
                <a
                  href={urlData.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110 active:scale-95"
                  title="Open original URL"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </a>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-gray-600 text-sm font-medium mb-1">Original URL:</p>
                <p className="text-gray-800 text-sm break-all font-mono">
                  {urlData.original_url}
                </p>
              </div>
            </div>
          </div>

          <AnalyticsCard urlData={urlData} />
        </div>
      ))}
    </div>
  );
}