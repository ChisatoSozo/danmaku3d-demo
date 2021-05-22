import { SETTINGS } from '../utils/Settings';
import BGM from './BGM';

class MusicClass {
    constructor() {
        this.BGMs = {};
        this.BGMs.menuTheme = new BGM('/music/titleTheme.mp3', 0.3);
        this.BGMs.stage1Theme = new BGM('/music/stage1.mp3', 0.3);
        this.BGMs.wriggleTheme = new BGM('/music/wriggleTheme.mp3', 0.3);

        this.initFunc = () => this.init();

        document.body.addEventListener('keydown', this.initFunc);
        document.body.addEventListener('click', this.initFunc);
        document.body.addEventListener('touchstart', this.initFunc);
    }

    init() {
        if (this.didInit) return;

        document.body.removeEventListener('keydown', this.initFunc);
        document.body.removeEventListener('click', this.initFunc);
        document.body.removeEventListener('touchstart', this.initFunc);
        this.didInit = true;
        const _this = this;

        for (let BGMIndex in this.BGMs) {
            this.BGMs[BGMIndex].init(this.activeSound === BGMIndex && SETTINGS.MUSIC === 'ON', () => {
                _this.startedAt = Date.now();
            });
        }
    }

    play(activeSound) {
        if (this.activeSound !== activeSound && activeSound) this.stop();
        if (activeSound) this.activeSound = activeSound;
        if (SETTINGS.MUSIC === 'OFF' || !this.activeSound) return;
        if (this.pausedAt) {
            this.startedAt = Date.now() - this.pausedAt;
            this.BGMs[this.activeSound].play(0, this.pausedAt / 1000);
        } else {
            this.startedAt = Date.now();
            this.BGMs[this.activeSound].play(0);
        }
        this.pausedAt = false;
    }

    pause() {
        if (this.activeSound) {
            this.pausedAt = Date.now() - this.startedAt;
        }
        this.stop();
    }

    stop() {
        if (this.activeSound) {
            this.BGMs[this.activeSound].stop();
        }
    }
}

export default new MusicClass();
