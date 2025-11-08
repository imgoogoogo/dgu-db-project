import Monster from "../characters/Monster.js";

export default class MonsterManager {
    constructor(scene) {
        this.scene = scene;

        // 몬스터 그룹을 생성하고 씬에 등록합니다.
        // 이렇게 하면 PlayScene에서도 this.monsters로 접근할 수 있습니다.
        this.scene.monsters = this.scene.physics.add.group({
            classType: Monster,
            runChildUpdate: true,
            maxSize: -1 // ⭐️ 그룹의 최대 크기 제한을 해제합니다.
        });

        // 몬스터끼리 충돌하도록 설정합니다.
        this.scene.physics.add.collider(this.scene.monsters, this.scene.monsters);
    }

    /**
     * 설정된 시간 간격으로 몬스터 생성을 시작합니다.
     * @param {number} delay 몬스터 생성 간격 (밀리초)
     */
    startSpawning(delay = 1000) {
        this.scene.time.addEvent({
            delay: delay,
            loop: true,
            callback: () => {
                // 플레이어 주변의 화면 바깥 영역에 몬스터를 생성합니다.
                this.spawnMonster();
            },
        });
    }

    spawnMonster() {
        const player = this.scene.player;
        const cam = this.scene.cameras.main;

        // 플레이어 위치를 기준으로 동적으로 생성 영역을 계산합니다.
        const outerRectangle = new Phaser.Geom.Rectangle(
            player.x - cam.width / 2 - 100,
            player.y - cam.height / 2 - 100,
            cam.width + 200,
            cam.height + 200
        );
        const innerRectangle = new Phaser.Geom.Rectangle(
            player.x - cam.width / 2,
            player.y - cam.height / 2,
            cam.width,
            cam.height
        );

        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        
        // 1. 그룹에서 몬스터를 가져옵니다.
        const monster = this.scene.monsters.get(spawnPoint.x, spawnPoint.y, 'monster');

        // 2. ⭐️ 몬스터를 성공적으로 가져왔다면, 즉시 활성화하고 보이게 만듭니다.
        if (monster) {
            monster.setActive(true);
            monster.setVisible(true);
            monster.body.enable = true;

            // 몬스터의 체력 등을 리셋하는 함수가 있다면 여기서 호출합니다.
            // if (typeof monster.onActive === 'function') {
            //     monster.onActive();
            // }
        }
    }

    deleteMonster(monster) {
        monster.setActive(false).setVisible(false).body.stop();
    }
}