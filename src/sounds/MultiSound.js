import { times } from 'lodash';
import { SETTINGS } from '../utils/Settings';

export default class MultiSound {
    constructor(url, volume = 0.1, num = 1, cooldown = 50) {
        this.url = url;
        this.volume = volume;
        this.curSource = 0;
        this.num = num;
        this.playing = times(num, () => false);
        this.cooldown = cooldown;

        this.initFunc = (...args) => this.init(args);

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

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.audioContext.destination);

        this.sources = times(this.num, () => this.audioContext.createBufferSource());

        fetch(this.url)
            .then((resp) => resp.arrayBuffer())
            .then((buf) => this.audioContext.decodeAudioData(buf)) // can be callback as well
            .then((decoded) => {
                this.sources.forEach(source => { source.buffer = this.buf = decoded });
                this.sources.forEach(source => { source.loop = false });
                this.sources.forEach(source => { source.connect(this.gainNode) });

                this.ready = true;
            })
            .catch((err) => console.error(err));
    }

    play() {
        if (!this.ready) return;
        if (this.startTime && (new Date() - this.startTime < this.cooldown / this.num)) return;
        if (SETTINGS.SFX === 'OFF') return;

        this.stop(this.curSource);

        this.sources[this.curSource].start(0);
        this.playing[this.curSource] = true;
        this.startTime = new Date();

        this.curSource = (this.curSource + 1) % this.num
    }

    stop(source) {
        if (!this.ready || !this.playing[source]) return;

        this.sources[source].stop(0); // this destroys the buffer source
        const newSource = this.audioContext.createBufferSource(); // so we need to create a new one
        newSource.buffer = this.buf;
        newSource.loop = false;
        newSource.connect(this.gainNode);
        this.sources[source] = newSource;
        this.playing[source] = false;
    }
}
