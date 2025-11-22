import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Download, Upload, Trash2, Plus, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import {
  fetchAdmins,
  createAdmin,
  deleteAdmin,
  createBackup,
  restoreBackup,
} from "../api/api";

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
  last_login: string;
}

export default function SystemSettings() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    role: "support",
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      const res = await fetchAdmins(); // GET /admin/settings/admins
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("관리자 목록 조회 오류:", err);
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === "super_admin") {
      return <Badge className="bg-red-600">최고 관리자</Badge>;
    } else if (role === "gm") {
      return <Badge className="bg-blue-600">게임 마스터</Badge>;
    } else if (role === "support") {
      return <Badge className="bg-green-600">고객 지원</Badge>;
    }
    return <Badge>알 수 없음</Badge>;
  };

  async function handleCreateAdmin() {
    try {
      await createAdmin(newAdmin);
      alert("관리자 계정이 생성되었습니다.");
      setNewAdmin({
        username: "",
        email: "",
        password: "",
        role: "support",
      });
      loadAdmins();
    } catch (err) {
      console.error("관리자 생성 오류:", err);
      alert("관리자 생성 실패");
    }
  }

  async function handleDeleteAdmin(id: number) {
    if (!confirm("정말 이 관리자를 삭제하시겠습니까?")) return;
    try {
      await deleteAdmin(id);
      alert("관리자 삭제 완료");
      loadAdmins();
    } catch (err) {
      console.error("관리자 삭제 오류:", err);
      alert("관리자 삭제 실패");
    }
  }

  async function handleBackup() {
    try {
      const res = await createBackup();
      const { message, file } = res.data;
      alert(`${message}\n파일: ${file}`);
    } catch (err) {
      console.error("백업 생성 오류:", err);
      alert("백업 생성 실패");
    }
  }

  async function handleRestore() {
    // 실제 파일 업로드/전송 로직은 백엔드 구현 방식에 따라 달라짐.
    // 일단 엔드포인트만 호출해 두고, 나중에 FormData로 확장 가능.
    try {
      await restoreBackup();
      alert("복원 요청이 전송되었습니다. (실제 동작은 서버 구현에 따라)");
    } catch (err) {
      console.error("복원 오류:", err);
      alert("복원 실패");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white">시스템 설정</h2>
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="bg-[#14161C] border border-[#2a2d36]">
          <TabsTrigger value="admins" className="data-[state=active]:bg-blue-600">
            관리자 계정
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-blue-600">
            백업/복원
          </TabsTrigger>
        </TabsList>

        {/* 관리자 계정 탭 */}
        <TabsContent value="admins" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">관리자 계정 관리</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    관리자 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#14161C] border-[#2a2d36] text-white">
                  <DialogHeader>
                    <DialogTitle>새 관리자 계정 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>사용자명</Label>
                      <Input
                        placeholder="admin_username"
                        value={newAdmin.username}
                        onChange={(e) =>
                          setNewAdmin((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label>이메일</Label>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        value={newAdmin.email}
                        onChange={(e) =>
                          setNewAdmin((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label>비밀번호</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newAdmin.password}
                        onChange={(e) =>
                          setNewAdmin((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label>권한 레벨</Label>
                      <select
                        className="w-full mt-1 bg-[#1a1d24] border border-[#2a2d36] text-white rounded-md p-2"
                        value={newAdmin.role}
                        onChange={(e) =>
                          setNewAdmin((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                      >
                        <option value="super_admin">최고 관리자</option>
                        <option value="gm">게임 마스터</option>
                        <option value="support">고객 지원</option>
                      </select>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleCreateAdmin}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      추가하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2d36]">
                      <th className="text-left py-3 px-4 text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">사용자명</th>
                      <th className="text-left py-3 px-4 text-gray-400">이메일</th>
                      <th className="text-left py-3 px-4 text-gray-400">권한</th>
                      <th className="text-left py-3 px-4 text-gray-400">최근 로그인</th>
                      <th className="text-left py-3 px-4 text-gray-400">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b border-[#2a2d36] hover:bg-[#1a1d24]"
                      >
                        <td className="py-3 px-4 text-gray-500">#{admin.id}</td>
                        <td className="py-3 px-4 text-white">
                          {admin.username}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {admin.email}
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(admin.role)}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {admin.last_login}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {/* 수정은 나중에 구현해도 되고, 지금은 버튼만 둬도 됨 */}
                            {/* <Button size="sm" variant="outline" className="bg-[#1a1d24] border-[#2a2d36]">
                              수정
                            </Button> */}
                            {admin.role !== "super_admin" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-900/20 border-red-900 text-red-500"
                                onClick={() => handleDeleteAdmin(admin.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {admins.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 text-center text-gray-500"
                        >
                          관리자 계정이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 백업/복원 탭 */}
        <TabsContent value="backup" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">데이터 백업 / 복원</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-[#1a1d24] p-6 rounded-lg border border-[#2a2d36]">
                  <h3 className="text-white mb-4">백업 생성</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    현재 데이터베이스의 전체 백업을 생성합니다. 백업 파일 경로가
                    서버에서 반환됩니다.
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleBackup}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    백업 생성
                  </Button>
                </div>

                <div className="bg-[#1a1d24] p-6 rounded-lg border border-[#2a2d36]">
                  <h3 className="text-white mb-4">백업 복원</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    백업 파일을 업로드하여 데이터를 복원합니다.
                  </p>
                  <p className="text-red-400 text-sm mb-4">
                    ⚠️ 경고: 현재 데이터가 모두 삭제되고 백업 데이터로
                    교체됩니다.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".sql,.db"
                      className="bg-[#14161C] border-[#2a2d36] text-white"
                    />
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleRestore}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      복원
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
