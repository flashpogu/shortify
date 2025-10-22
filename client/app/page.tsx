'use client'

import React, { useState, useEffect } from 'react';
import { Link, Copy, Check, Sparkles, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import UrlList from './components/UrlList';
import { UrlData } from './interface/url-data';


const API_BASE_URL = "https://shortify-2f18.onrender.com"; 


export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [copiedCode, setCopiedCode] = useState('');
  const [loadingUrls, setLoadingUrls] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoadingUrls(true);
      const response = await fetch(`${API_BASE_URL}/urls`);
      if (response.ok) {
        const data = await response.json();
        setUrls(data);
      }
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoadingUrls(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowResult(false);

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.short);
        setTimeout(() => setShowResult(true), 100);
        fetchUrls(); // Refresh the list
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code?: string) => {
    const urlToCopy = code ? `https://shortify-2f18.onrender.com/${code}` : shortUrl;
    navigator.clipboard.writeText(urlToCopy);
    
    if (code) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewUrl = () => {
    setUrl('');
    setShortUrl('');
    setShowResult(false);
    setCopied(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
        <div className="bubble bubble-7"></div>
        <div className="bubble bubble-8"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl animate-float">
            <Link className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg animate-text-pop">
            Shortify
          </h1>
          <p className="text-xl text-white font-medium animate-fade-in-delay">
            Transform long URLs into magic links ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - URL Shortener */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
              {!showResult ? (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <label htmlFor="url" className="block text-gray-800 font-bold mb-3 text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 animate-spin-slow" />
                      Paste your long URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/very-long-url"
                        required
                        disabled={loading}
                        className="w-full px-6 py-5 bg-purple-50 rounded-2xl focus:ring-4 focus:ring-purple-300 outline-none transition-all text-lg border-2 border-purple-200 focus:border-purple-500 disabled:opacity-50 hover:border-purple-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !url}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group animate-bubble-pop"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Shortening...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 animate-bounce" />
                        Shorten URL
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="mt-6 p-5 bg-red-100 border-2 border-red-400 rounded-2xl animate-shake">
                      <p className="text-red-700 font-semibold text-center">{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-pop-in">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce-success">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-text-pop">Success! 🎉</h2>
                    <p className="text-gray-600">Your short URL is ready to share</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 border-2 border-purple-300 animate-glow">
                    <p className="text-purple-800 text-sm font-bold mb-3 uppercase tracking-wide">
                      Short URL
                    </p>
                    <div className="bg-white rounded-xl p-4 mb-4 break-all shadow-inner border-2 border-purple-200">
                      <p className="text-gray-800 font-mono text-lg font-semibold">
                        {shortUrl}
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard()}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                    >
                      {copied ? (
                        <>
                          <Check className="w-6 h-6 animate-bounce" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5 mb-6 border-2 border-gray-200">
                    <p className="text-gray-600 text-sm font-bold mb-2">Original URL:</p>
                    <p className="text-gray-800 text-sm break-all">{url}</p>
                  </div>

                  <button
                    onClick={handleNewUrl}
                    className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-purple-700 transform hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Shorten Another URL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - URL List */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-7 h-7 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Your URLs</h2>
              </div>

              {loadingUrls ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading URLs...</p>
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  <UrlList 
                    urls={urls} 
                    onCopy={copyToClipboard}
                    copiedCode={copiedCode}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white animate-fade-in-delay-2">
          <p className="text-sm font-medium"><a href="https://rahul23-portfolio.vercel.app/">🙎visit me</a></p>
        </div>
      </div>
    </div>
  );
}