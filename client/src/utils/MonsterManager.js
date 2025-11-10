import Monster from "../characters/Monster.js";

export default class MonsterManager {
    constructor(scene) {
        this.scene = scene;

        this.scene.monsters = this.scene.physics.add.group({
            classType: Monster,
            runChildUpdate: true,
            maxSize: -1 // ⭐️ 그룹의 최대 크기 제한을 해제합니다.
        });

        // 몬스터끼리 충돌하도록 설정합니다.
        this.scene.physics.add.collider(this.scene.monsters, this.scene.monsters);
    }

    startEvent(delay = 1000) {
        this.spawnEvent = this.scene.time.addEvent({
            delay: delay,
            loop: true,
            callback: () => {
                // 플레이어 주변의 화면 바깥 영역에 몬스터를 생성합니다.
                this.spawnMonster();
            },
        });
    }

    stopEvent() {
        if (this.spawnEvent) {
            this.spawnEvent.remove();
            this.spawnEvent = null; // 참조를 제거합니다.
        }
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
        const monster = this.scene.monsters.get(spawnPoint.x, spawnPoint.y, 'monster');

        // 2. ⭐️ 몬스터를 성공적으로 가져왔다면, 즉시 활성화하고 보이게 만듭니다.
        if (monster) {
            monster.setActive(true);
            monster.setVisible(true);
            monster.body.enable = true;
        }
    }

    removeMonster(monster) {
        monster.setActive(false)
        monster.setVisible(false)
        monster.body.enadble = false;
    }
}