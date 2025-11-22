import { useState, useEffect } from "react";
import {
  fetchMonsters,
  saveMonsters,
  fetchItems,
  saveItems,
  fetchStages,
  saveStages,
} from "../api/api";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RefreshCw, Save } from "lucide-react";

export default function GameBalancing() {
  const [monsters, setMonsters] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [stageSettings, setStageSettings] = useState<any>({});

  // ---------------------------
  // 🔥 서버 전체 로딩
  // ---------------------------
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const mons = await fetchMonsters(); // { success, monsters }
      const its = await fetchItems(); // { success, items }
      const stages = await fetchStages(); // { success, fields... }

      setMonsters(mons.data.monsters ?? []);
      setItems(its.data.items ?? []);

      // stageBalance는 하나의 row → data 전체가 stage 설정
      setStageSettings(stages.data ?? {});
    } catch (err) {
      console.error("밸런스 데이터 로드 오류:", err);
    }
  };

  // ---------------------------
  // 변경 핸들러
  // ---------------------------
  const handleMonsterChange = (id: number, field: string, value: number) => {
    setMonsters((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleItemChange = (id: number, field: string, value: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleStageSettingChange = (field: string, value: number) => {
    setStageSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  // ---------------------------
  // 저장 요청
  // ---------------------------
  const saveMonsterData = async () => {
    await saveMonsters({ monsters });
    alert("몬스터 설정 저장 완료!");
  };

  const saveItemData = async () => {
    await saveItems({ items });
    alert("아이템 설정 저장 완료!");
  };

  const saveStageData = async () => {
    await saveStages(stageSettings);
    alert("스테이지 설정 저장 완료!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl">게임 밸런스 관리</h2>
        <Button className="bg-green-600 hover:bg-green-700" onClick={loadAll}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      <Tabs defaultValue="monsters" className="w-full">
        <TabsList className="bg-[#14161C] border border-[#2a2d36]">
          <TabsTrigger value="monsters" className="data-[state=active]:bg-blue-600">
            몬스터
          </TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-blue-600">
            아이템
          </TabsTrigger>
          <TabsTrigger value="stages" className="data-[state=active]:bg-blue-600">
            스테이지
          </TabsTrigger>
        </TabsList>

        {/* -------------------- 몬스터 설정 -------------------- */}
        <TabsContent value="monsters" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">몬스터 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monsters.map((monster) => (
                  <div key={monster.id} className="bg-[#1a1d24] p-4 rounded-lg space-y-4">
                    <h3 className="text-white">{monster.name}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-gray-400">HP</Label>
                        <Input
                          type="number"
                          value={monster.hp}
                          onChange={(e) =>
                            handleMonsterChange(monster.id, "hp", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">ATK</Label>
                        <Input
                          type="number"
                          value={monster.atk}
                          onChange={(e) =>
                            handleMonsterChange(monster.id, "atk", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">DEF</Label>
                        <Input
                          type="number"
                          value={monster.def}
                          onChange={(e) =>
                            handleMonsterChange(monster.id, "def", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">Chance</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={monster.chance}
                          onChange={(e) =>
                            handleMonsterChange(monster.id, "chance", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveMonsterData}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- 아이템 설정 -------------------- */}
        <TabsContent value="items" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">아이템 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-[#1a1d24] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white">{item.name}</h3>
                      <span className="text-xs text-gray-400">{item.grade}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-gray-400">공격력</Label>
                        <Input
                          type="number"
                          value={item.atk}
                          onChange={(e) =>
                            handleItemChange(item.id, "atk", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">방어력</Label>
                        <Input
                          type="number"
                          value={item.def}
                          onChange={(e) =>
                            handleItemChange(item.id, "def", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">체력</Label>
                        <Input
                          type="number"
                          value={item.hp}
                          onChange={(e) =>
                            handleItemChange(item.id, "hp", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">드랍 확률</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.drop}
                          onChange={(e) =>
                            handleItemChange(item.id, "drop", Number(e.target.value))
                          }
                          className="bg-[#14161C] border-[#2a2d36] text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveItemData}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- 스테이지 설정 -------------------- */}
        <TabsContent value="stages" className="mt-6">
          <Card className="bg-[#14161C] border-[#2a2d36]">
            <CardHeader>
              <CardTitle className="text-white">스테이지 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">

                <div className="bg-[#1a1d24] p-5 rounded-lg">
                  <h3 className="text-white mb-4 pb-2 border-b border-[#2a2d36]">
                    몬스터 설정
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">스테이지 시작 몬스터 수</Label>
                      <Input
                        type="number"
                        value={stageSettings.startMonster}
                        onChange={(e) =>
                          handleStageSettingChange("startMonster", Number(e.target.value))
                        }
                        className="bg-[#14161C] border-[#2a2d36] text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">스테이지당 증가 몬스터 수</Label>
                      <Input
                        type="number"
                        value={stageSettings.increasePerStage}
                        onChange={(e) =>
                          handleStageSettingChange("increasePerStage", Number(e.target.value))
                        }
                        className="bg-[#14161C] border-[#2a2d36] text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">몬스터 스폰 간격(초)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={stageSettings.spawnTime}
                        onChange={(e) =>
                          handleStageSettingChange("spawnTime", Number(e.target.value))
                        }
                        className="bg-[#14161C] border-[#2a2d36] text-white mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1d24] p-5 rounded-lg">
                  <h3 className="text-white mb-4 pb-2 border-b border-[#2a2d36]">
                    경험치 설정
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">초기 레벨 업 필요 경험치</Label>
                      <Input
                        type="number"
                        value={stageSettings.baseExp}
                        onChange={(e) =>
                          handleStageSettingChange("baseExp", Number(e.target.value))
                        }
                        className="bg-[#14161C] border-[#2a2d36] text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">경험치 증가 배율</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={stageSettings.expRate}
                        onChange={(e) =>
                          handleStageSettingChange("expRate", Number(e.target.value))
                        }
                        className="bg-[#14161C] border-[#2a2d36] text-white mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveStageData}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
