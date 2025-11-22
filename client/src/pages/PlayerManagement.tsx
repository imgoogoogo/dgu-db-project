import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Ban, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

import {
  fetchUsers,
  giveItemToUser,
  giveGoldToUser,
  banUser,
} from "../api/api";

interface Player {
  id: number;
  username: string;
  hp: number;
  atk: number;
  def: number;
  gold: number | null;
  state: string;
  lastLogin: string | null;
}

export default function PlayerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // 지급/제재 폼 상태
  const [itemForm, setItemForm] = useState({
    itemId: "",
    amount: 1,
    reason: "",
  });
  const [goldForm, setGoldForm] = useState({
    gold: 0,
    reason: "",
  });
  const [banForm, setBanForm] = useState({
    duration: "7d",
    reason: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers(keyword?: string) {
    try {
      const res = await fetchUsers(keyword);
      setPlayers(res.data.users || []);
    } catch (err) {
      console.error("유저 목록 조회 오류:", err);
    }
  }

  const filteredPlayers = players.filter((player) =>
    player.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-600">활성</Badge>;
    } else if (status === "banned") {
      return <Badge className="bg-red-600">정지</Badge>;
    }
    return <Badge>알 수 없음</Badge>;
  };

  const handleSearchClick = () => {
    loadUsers(searchTerm.trim() || undefined);
  };

  const handleGiveItem = async () => {
    if (!selectedPlayer) return;
    try {
      await giveItemToUser({
        userId: selectedPlayer.id,
        itemId: Number(itemForm.itemId),
        amount: itemForm.amount,
        reason: itemForm.reason,
      });
      alert("아이템 지급 완료");
      setItemForm({ itemId: "", amount: 1, reason: "" });
    } catch (err) {
      console.error("아이템 지급 오류:", err);
      alert("아이템 지급 실패");
    }
  };

  const handleGiveGold = async () => {
    if (!selectedPlayer) return;
    try {
      await giveGoldToUser({
        userId: selectedPlayer.id,
        gold: goldForm.gold,
        reason: goldForm.reason,
      });
      alert("골드 지급 완료");
      setGoldForm({ gold: 0, reason: "" });
      loadUsers(searchTerm.trim() || undefined);
    } catch (err) {
      console.error("골드 지급 오류:", err);
      alert("골드 지급 실패");
    }
  };

  const handleBanUser = async () => {
    if (!selectedPlayer) return;
    try {
      await banUser({
        userId: selectedPlayer.id,
        duration: banForm.duration,
        reason: banForm.reason,
      });
      alert("유저 제재 완료");
      setBanForm({ duration: "7d", reason: "" });
      loadUsers(searchTerm.trim() || undefined);
    } catch (err) {
      console.error("유저 제재 오류:", err);
      alert("유저 제재 실패");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white">유저 관리</h2>
      </div>

      {/* 검색 */}
      <Card className="bg-[#14161C] border-[#2a2d36]">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="닉네임, ID로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1d24] border-[#2a2d36] text-white"
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSearchClick}
            >
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 유저 목록 */}
      <Card className="bg-[#14161C] border-[#2a2d36]">
        <CardHeader>
          <CardTitle className="text-white">
            유저 목록 ({filteredPlayers.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2d36]">
                  <th className="text-left py-3 px-4 text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 text-gray-400">사용자명</th>
                  <th className="text-left py-3 px-4 text-gray-400">HP</th>
                  <th className="text-left py-3 px-4 text-gray-400">ATK</th>
                  <th className="text-left py-3 px-4 text-gray-400">DEF</th>
                  <th className="text-left py-3 px-4 text-gray-400">골드</th>
                  <th className="text-left py-3 px-4 text-gray-400">상태</th>
                  <th className="text-left py-3 px-4 text-gray-400">최근 접속</th>
                  <th className="text-left py-3 px-4 text-gray-400">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr
                    key={player.id}
                    className="border-b border-[#2a2d36] hover:bg-[#1a1d24]"
                  >
                    <td className="py-3 px-4 text-gray-500">{player.id}</td>
                    <td className="py-3 px-4 text-white">{player.username}</td>
                    <td className="py-3 px-4 text-green-400">{player.hp}</td>
                    <td className="py-3 px-4 text-red-400">{player.atk}</td>
                    <td className="py-3 px-4 text-blue-400">{player.def}</td>

                    {/* 🔥 gold null-safe 처리 */}
                    <td className="py-3 px-4 text-yellow-500">
                      {(player.gold ?? 0).toLocaleString()}G
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(player.state)}</td>

                    {/* lastLogin null-safe */}
                    <td className="py-3 px-4 text-gray-400">
                      {player.lastLogin ?? "기록 없음"}
                    </td>

                    {/* 작업 버튼들 */}
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {/* 아이템 지급 */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-[#1a1d24] border-[#2a2d36] hover:bg-[#2a2d36]"
                              onClick={() => setSelectedPlayer(player)}
                            >
                              <Gift className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="bg-[#14161C] border-[#2a2d36] text-white max-w-xl">
                            <DialogHeader>
                              <DialogTitle>
                                아이템/골드 지급 - {selectedPlayer?.username}
                              </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="item" className="w-full">
                              <TabsList className="bg-[#1a1d24] border border-[#2a2d36] w-full">
                                <TabsTrigger
                                  value="item"
                                  className="flex-1 data-[state=active]:bg-blue-600"
                                >
                                  아이템 지급
                                </TabsTrigger>
                                <TabsTrigger
                                  value="gold"
                                  className="flex-1 data-[state=active]:bg-blue-600"
                                >
                                  골드 지급
                                </TabsTrigger>
                              </TabsList>

                              {/* 아이템 지급 탭 */}
                              <TabsContent value="item" className="mt-4">
                                <div className="space-y-4">
                                  <div>
                                    <Label>아이템 ID</Label>
                                    <Input
                                      type="number"
                                      placeholder="item_id"
                                      value={itemForm.itemId}
                                      onChange={(e) =>
                                        setItemForm((prev) => ({
                                          ...prev,
                                          itemId: e.target.value,
                                        }))
                                      }
                                      className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label>수량</Label>
                                    <Input
                                      type="number"
                                      placeholder="지급할 수량"
                                      value={itemForm.amount}
                                      onChange={(e) =>
                                        setItemForm((prev) => ({
                                          ...prev,
                                          amount: Number(e.target.value),
                                        }))
                                      }
                                      className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label>사유</Label>
                                    <Textarea
                                      placeholder="지급 사유를 입력하세요"
                                      value={itemForm.reason}
                                      onChange={(e) =>
                                        setItemForm((prev) => ({
                                          ...prev,
                                          reason: e.target.value,
                                        }))
                                      }
                                      className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                                    />
                                  </div>

                                  <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={handleGiveItem}
                                  >
                                    아이템 지급하기
                                  </Button>
                                </div>
                              </TabsContent>

                              {/* 골드 지급 탭 */}
                              <TabsContent value="gold" className="mt-4">
                                <div className="space-y-4">
                                  <div>
                                    <Label>골드 수량</Label>
                                    <Input
                                      type="number"
                                      placeholder="지급할 골드"
                                      value={goldForm.gold}
                                      onChange={(e) =>
                                        setGoldForm((prev) => ({
                                          ...prev,
                                          gold: Number(e.target.value),
                                        }))
                                      }
                                      className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label>사유</Label>
                                    <Textarea
                                      placeholder="지급 사유를 입력하세요"
                                      value={goldForm.reason}
                                      onChange={(e) =>
                                        setGoldForm((prev) => ({
                                          ...prev,
                                          reason: e.target.value,
                                        }))
                                      }
                                      className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                                    />
                                  </div>

                                  <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={handleGiveGold}
                                  >
                                    골드 지급하기
                                  </Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>

                        {/* 유저 제재 */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-[#1a1d24] border-[#2a2d36] hover:bg-red-900/20"
                              onClick={() => setSelectedPlayer(player)}
                            >
                              <Ban className="w-3 h-3 text-red-500" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="bg-[#14161C] border-[#2a2d36] text-white">
                            <DialogHeader>
                              <DialogTitle>
                                유저 제재 - {selectedPlayer?.username}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div>
                                <Label>제재 기간</Label>
                                <select
                                  className="w-full mt-1 bg-[#1a1d24] border border-[#2a2d36] text-white rounded-md p-2"
                                  value={banForm.duration}
                                  onChange={(e) =>
                                    setBanForm((prev) => ({
                                      ...prev,
                                      duration: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="1d">1일</option>
                                  <option value="7d">7일</option>
                                  <option value="30d">30일</option>
                                  <option value="permanent">영구 정지</option>
                                </select>
                              </div>

                              <div>
                                <Label>사유</Label>
                                <Textarea
                                  placeholder="제재 사유를 입력하세요"
                                  value={banForm.reason}
                                  onChange={(e) =>
                                    setBanForm((prev) => ({
                                      ...prev,
                                      reason: e.target.value,
                                    }))
                                  }
                                  className="bg-[#1a1d24] border-[#2a2d36] text-white mt-1"
                                />
                              </div>

                              <Button
                                className="w-full bg-red-600 hover:bg-red-700"
                                onClick={handleBanUser}
                              >
                                제재하기
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-gray-500">
                      유저가 없습니다.
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
