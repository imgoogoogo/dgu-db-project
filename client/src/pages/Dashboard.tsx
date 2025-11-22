import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import {
  Users,
  UserPlus,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getDashboardSummary,
  getSignupStats,
  getStageStats,
  getRecentLogins,
} from "../api/api";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [signupStats, setSignupStats] = useState<any>({ labels: [], values: [] });
  const [stageStats, setStageStats] = useState<any>({ labels: [], values: [] });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const s = await getDashboardSummary();
      const sign = await getSignupStats();
      const stage = await getStageStats();
      const last = await getRecentLogins();

      setSummary(s.data || { todaySignup: 0, totalUsers: 0 });
      setSignupStats(sign.data || { labels: [], values: [] });
      setStageStats(stage.data || { labels: [], values: [] });

      setRecent(last?.data?.logins ?? []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  }

  if (!summary) return <div className="text-white p-4">Loading...</div>;

  /* ----------------------------------------------
    🔥 요일 전체 포함 (일~토), 값 없으면 0 채우기
  ---------------------------------------------- */
  const weekOrder = ["일", "월", "화", "수", "목", "금", "토"];

  const signupChartData = weekOrder.map((day) => {
    const idx = signupStats.labels.indexOf(day);
    return {
      name: day,
      newUsers: idx !== -1 ? signupStats.values[idx] : 0,
    };
  });

  const stageChartData = stageStats.labels.map((label: string, i: number) => ({
    name: label,
    value: stageStats.values[i],
  }));

  return (
    <div className="space-y-6 text-white">

      <h2 className="text-white">대시보드</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today Signup */}
        <Card className="bg-[#14161C] border-[#2a2d36]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400">신규 가입 (오늘)</CardTitle>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-white text-3xl">{summary.todaySignup}명</div>
            <p className="text-xs text-green-500 mt-1">오늘 가입한 사용자 수</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="bg-[#14161C] border-[#2a2d36]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400">총 누적 유저</CardTitle>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-white text-3xl">{summary.totalUsers}명</div>
            <p className="text-xs text-gray-500 mt-1">Total registered</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Signup Stats */}
        <Card className="bg-[#14161C] border-[#2a2d36]">
          <CardHeader>
            <CardTitle className="text-white">신규 가입자 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={signupChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d36" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1d24", border: "1px solid #2a2d36" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="newUsers" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage Stats */}
        <Card className="bg-[#14161C] border-[#2a2d36]">
          <CardHeader>
            <CardTitle className="text-white">스테이지별 플레이어 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d36" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1d24", border: "1px solid #2a2d36" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logins */}
      <Card className="bg-[#14161C] border-[#2a2d36]">
        <CardHeader>
          <CardTitle className="text-white">최근 로그인 기록 (10명)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2d36]">
                  <th className="text-left py-3 px-4 text-gray-400">#</th>
                  <th className="text-left py-3 px-4 text-gray-400">사용자명</th>
                  <th className="text-left py-3 px-4 text-gray-400">접속 시간</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((log: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#2a2d36] hover:bg-[#1a1d24]">
                    <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 text-white">{log.username}</td>
                    <td className="py-3 px-4 text-gray-400">{log.time}</td>
                  </tr>
                ))}

                {recent.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-gray-500 py-4 text-center">
                      최근 로그인 기록이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
