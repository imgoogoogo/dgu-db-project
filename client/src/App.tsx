import { useState } from 'react';
import Dashboard  from './pages/Dashboard';
import  PlayerManagement  from './pages/PlayerManagement';
import  GameBalancing  from './pages/GameBalancing';
import  LogsSecurity from './pages/LogsSecurity';
import SystemSettings from './pages/SystemSettings';
import { 
  LayoutDashboard, 
  Users, 
  Sliders, 
  Shield, 
  Settings 
} from 'lucide-react';

export default function App() {
  const [currentMenu, setCurrentMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'players', label: '유저 관리', icon: Users },
    { id: 'balancing', label: '게임 밸런스', icon: Sliders },
    { id: 'logs', label: '로그/보안', icon: Shield },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  const renderContent = () => {
    switch (currentMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'players':
        return <PlayerManagement />;
      case 'balancing':
        return <GameBalancing />;
      case 'logs':
        return <LogsSecurity />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e]">
      {/* Header */}
      <header className="bg-[#14161C] border-b border-[#2a2d36] sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-white">🎮 게임 관리자 페이지</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Admin</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">GM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#14161C] min-h-[calc(100vh-73px)] border-r border-[#2a2d36]">
          <nav className="p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    currentMenu === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-[#1a1d24] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}