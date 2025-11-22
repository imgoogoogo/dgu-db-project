import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search } from "lucide-react";

import {
  getLoginLogs,
  getUserLogs,
  getAdminLogs,
} from "../api/api";

interface BaseLog {
  id: number;
  time: string;
}

interface LoginLog extends BaseLog {
  username: string;
  action: string | null;
  detail: string | null;
}

interface UserLog extends BaseLog {
  username: string;
  action: string;
  detail: string | null;
}

interface AdminLog extends BaseLog {
  admin_name: string;
  action: string;
  target: string;
  reason: string;
}

export default function LogsSecurity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [loginRes, userRes, adminRes] = await Promise.all([
        getLoginLogs(),   // GET /admin/logs/login
        getUserLogs(),    // GET /admin/logs/user
        getAdminLogs(),   // GET /admin/logs/admin
      ]);

      setLoginLogs(loginRes.data.logs || []);
      setUserLogs(userRes.data.logs || []);
      setAdminLogs(adminRes.data.logs || []);
    } catch (err) {
      console.error("로그 조회 오류:", err);
    }
  }

  const filteredLogin = loginLogs.filter((log) =>
    (log.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUser = userLogs.filter((log) =>
    (log.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmin = adminLogs.filter((log) =>
    (log.admin_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white">로그 / 보안</h2>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="bg-[#14161C] border border-[#2a2d36]">
          <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
            로그인 로그
          </TabsTrigger>
          <TabsTrigger value="user" className="data-[state=active]:bg-blue-600">
            유저 행동
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-blue-600">
            관리자 활동
          </TabsTrigger>
        </TabsList>

        {/* 로그인 로그 */}
        <TabsContent value="login" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">로그인 시도 기록</CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="사용자명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#1a1d24] border-[#2a2d36] text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2d36]">
                      <th className="text-left py-3 px-4 text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">사용자명</th>
                      <th className="text-left py-3 px-4 text-gray-400">내용</th>
                      <th className="text-left py-3 px-4 text-gray-400">시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogin.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-[#2a2d36] hover:bg-[#1a1d24]"
                      >
                        <td className="py-3 px-4 text-gray-500">#{log.id}</td>
                        <td className="py-3 px-4 text-white">{log.username}</td>
                        <td className="py-3 px-4 text-gray-400">
                          {log.action || "로그인"}
                          {log.detail ? ` (${log.detail})` : ""}
                        </td>
                        <td className="py-3 px-4 text-gray-400">{log.time}</td>
                      </tr>
                    ))}
                    {filteredLogin.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-4 text-center text-gray-500"
                        >
                          로그인 로그가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 유저 행동 로그 */}
        <TabsContent value="user" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">유저 행동 로그</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2d36]">
                      <th className="text-left py-3 px-4 text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">사용자명</th>
                      <th className="text-left py-3 px-4 text-gray-400">행동</th>
                      <th className="text-left py-3 px-4 text-gray-400">세부사항</th>
                      <th className="text-left py-3 px-4 text-gray-400">시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUser.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-[#2a2d36] hover:bg-[#1a1d24]"
                      >
                        <td className="py-3 px-4 text-gray-500">#{log.id}</td>
                        <td className="py-3 px-4 text-white">{log.username}</td>
                        <td className="py-3 px-4 text-blue-400">{log.action}</td>
                        <td className="py-3 px-4 text-gray-400">
                          {log.detail || "-"}
                        </td>
                        <td className="py-3 px-4 text-gray-400">{log.time}</td>
                      </tr>
                    ))}
                    {filteredUser.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 text-center text-gray-500"
                        >
                          유저 행동 로그가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 관리자 로그 */}
        <TabsContent value="admin" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">관리자 활동 로그</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2d36]">
                      <th className="text-left py-3 px-4 text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">관리자</th>
                      <th className="text-left py-3 px-4 text-gray-400">작업</th>
                      <th className="text-left py-3 px-4 text-gray-400">대상</th>
                      <th className="text-left py-3 px-4 text-gray-400">사유</th>
                      <th className="text-left py-3 px-4 text-gray-400">시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmin.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-[#2a2d36] hover:bg-[#1a1d24]"
                      >
                        <td className="py-3 px-4 text-gray-500">#{log.id}</td>
                        <td className="py-3 px-4 text-purple-400">
                          {log.admin_name}
                        </td>
                        <td className="py-3 px-4 text-white">{log.action}</td>
                        <td className="py-3 px-4 text-gray-400">{log.target}</td>
                        <td className="py-3 px-4 text-gray-400">{log.reason}</td>
                        <td className="py-3 px-4 text-gray-400">{log.time}</td>
                      </tr>
                    ))}
                    {filteredAdmin.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 text-center text-gray-500"
                        >
                          관리자 활동 로그가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
