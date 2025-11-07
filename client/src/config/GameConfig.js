export const STAGE_CONFIG = [
    { stage: 1, monsters: 10, monsterType: 'zombie_normal' },
    { stage: 2, monsters: 15, monsterType: 'zombie_normal' },
    { stage: 3, monsters: 20, monsterType: 'zombie_fast' },
    { stage: 4, monsters: 1, monsterType: 'boss_zombie' },
    // ... 다음 스테이지들
];

export const PLAYER_CONFIG = {
    initialSpeed: 200,
    initialHealth: 100,
};

export const MONSTER_CONFIG = {
    zombie_normal: {
        speed: 50,
        health: 10,
        texture: 'monster'
    },
    zombie_fast: {
        speed: 80,
        health: 5,
        texture: 'monster_fast' // 다른 텍스처 사용 예시
    },
    // ... 다른 몬스터 타입들
};