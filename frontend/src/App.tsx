import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChannelInfo, VideosResponse, VideoStatsResponse, PageType, AISummary } from './types';

const API_BASE = 'http://127.0.0.1:5000';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<PageType>('home');
  
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<VideosResponse | null>(null);
  const [selectedVideoStats, setSelectedVideoStats] = useState<VideoStatsResponse | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE}/channel-info`);
      if (response.data) {
        setAuthenticated(true);
      }
    } catch (error) {
      setAuthenticated(false);
    }
  };

  const authenticate = async () => {
    const authWindow = window.open(`${API_BASE}/auth`, '_blank');
    if (!authWindow) {
      alert('Please allow popups for this site, or manually visit: http://127.0.0.1:5000/auth');
    }
    setTimeout(() => {
      checkAuth();
    }, 5000);
  };

  const fetchChannelInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ChannelInfo>(`${API_BASE}/channel-info`);
      setChannelInfo(response.data);
      setPage('channel');
    } catch (error) {
      console.error('Error fetching channel:', error);
      alert('Please authenticate first');
    }
    setLoading(false);
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<VideosResponse>(`${API_BASE}/my-videos`);
      setVideos(response.data);
      setPage('videos');
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Please authenticate first');
    }
    setLoading(false);
  };

  const fetchVideoStats = async (videoId: string) => {
    setLoading(true);
    setAiSummary(null);
    try {
      const response = await axios.get<VideoStatsResponse>(`${API_BASE}/video-stats/${videoId}`);
      setSelectedVideoStats(response.data);
    } catch (error) {
      console.error('Error fetching video stats:', error);
    }
    setLoading(false);
  };

  const generateAISummary = async (videoId: string) => {
    setLoadingAI(true);
    try {
      const response = await axios.get<AISummary>(`${API_BASE}/video-summary/${videoId}`);
      setAiSummary(response.data);
    } catch (error) {
      console.error('Error generating AI summary:', error);
      alert('Failed to generate AI summary');
    }
    setLoadingAI(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <h1 className="text-2xl font-bold text-red-600">Charles's YouTube Dashboard</h1>
            <nav className="flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => setPage('home')}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                Home
              </button>
              <button 
                onClick={fetchChannelInfo}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                Channel Info
              </button>
              <button 
                onClick={fetchVideos}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                My Videos
              </button>
              {!authenticated && (
                <button 
                  onClick={authenticate}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Authenticate
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Home Page */}
        {page === 'home' && !loading && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome to Your YouTube Dashboard
            </h2>
            {!authenticated ? (
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-600 mb-6">
                  Please authenticate to view your YouTube data
                </p>
                <button 
                  onClick={authenticate}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-lg font-semibold"
                >
                  Connect YouTube Account
                </button>
              </div>
            ) : (
              <div className="flex gap-4 justify-center flex-wrap">
                <button 
                  onClick={fetchChannelInfo}
                  className="px-8 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <span className="text-xl font-semibold text-gray-900">View Channel Info</span>
                </button>
                <button 
                  onClick={fetchVideos}
                  className="px-8 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <span className="text-xl font-semibold text-gray-900">View My Videos</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Channel Info Page */}
        {page === 'channel' && channelInfo && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Channel Information</h2>
            {channelInfo.items.map((channel, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img 
                  src={channel.snippet.thumbnails.default.url} 
                  alt="Channel thumbnail"
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {channel.snippet.title}
                </h3>
                <p className="text-gray-600 text-center max-w-2xl mb-6">
                  {channel.snippet.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parseInt(channel.statistics.subscriberCount).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parseInt(channel.statistics.viewCount).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Videos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {channel.statistics.videoCount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Page */}
        {page === 'videos' && videos && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.items.map((video, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.snippet.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {video.snippet.description}
                    </p>
                    <button 
                      onClick={() => fetchVideoStats(video.snippet.resourceId.videoId)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      View Stats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Stats Modal */}
        {selectedVideoStats && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedVideoStats(null);
              setAiSummary(null);
            }}
          >
            <div 
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  setSelectedVideoStats(null);
                  setAiSummary(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Statistics</h2>
              {selectedVideoStats.items.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {item.snippet.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Views</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {parseInt(item.statistics.viewCount).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Likes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {parseInt(item.statistics.likeCount).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {parseInt(item.statistics.commentCount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* AI Summary Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>🤖</span> AI Summary
                      </h3>
                      {!aiSummary && (
                        <button
                          onClick={() => generateAISummary(item.id)}
                          disabled={loadingAI}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
                        >
                          {loadingAI ? 'Generating...' : 'Generate AI Summary'}
                        </button>
                      )}
                    </div>

                    {loadingAI && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="mt-2 text-gray-600">AI is analyzing your video...</p>
                      </div>
                    )}

                    {aiSummary && (
                      <div className="space-y-4">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-purple-900 mb-2">Summary</p>
                          <p className="text-gray-700">{aiSummary.summary}</p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-blue-900 mb-2">Key Topics</p>
                          <div className="flex flex-wrap gap-2">
                            {aiSummary.topics.map((topic: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-green-900 mb-2">Target Audience</p>
                          <p className="text-gray-700">{aiSummary.audience}</p>
                        </div>

                        <button
                          onClick={() => generateAISummary(item.id)}
                          disabled={loadingAI}
                          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Regenerate Summary
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;