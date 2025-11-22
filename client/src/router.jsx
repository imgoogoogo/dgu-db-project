import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PlayerManagement from "./pages/PlayerManagement";
import LogsSecurity from "./pages/LogsSecurity";
import GameBalancing from "./pages/GameBalancing";
import SystemSettings from "./pages/SystemSettings";
import NoticeOperations from "./pages/NoticeOperations";
import RankingManagement from "./pages/RankingManagement";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 대시보드 */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 유저 관리 */}
        <Route path="/users" element={<PlayerManagement />} />

        {/* 로그 */}
        <Route path="/logs" element={<LogsSecurity />} />

        {/* 게임 밸런스 */}
        <Route path="/balance" element={<GameBalancing />} />

        {/* 공지 / 운영 */}
        <Route path="/notices" element={<NoticeOperations />} />

        {/* 랭킹 관리 */}
        <Route path="/ranking" element={<RankingManagement />} />

        {/* 시스템 설정 */}
        <Route path="/settings" element={<SystemSettings />} />

        {/* 404 처리 */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
