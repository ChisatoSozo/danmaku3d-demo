import { SETTINGS } from '../utils/Settings';

export default class LoopingSound {
    constructor(url, volume = 1, overlap = 2) {
        this.url = url;
        this.volume = volume;
        this.overlap = overlap;

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

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.audioContext.destination);

        this.sources = [];
        for (let i = 0; i < this.overlap; i++) {
            this.sources.push(this.audioContext.createBufferSource());
        }

        fetch(this.url)
            .then((resp) => resp.arrayBuffer())
            .then((buf) => this.audioContext.decodeAudioData(buf)) // can be callback as well
            .then((decoded) => {
                this.sources.forEach((source) => {
                    source.buffer = this.buf = decoded;
                    source.loop = true;
                    source.connect(this.gainNode);
                });
                this.ready = true;
            })
            .catch((err) => console.error(err));
    }

    play() {
        if (!this.ready || this.playing) return;
        if (SETTINGS.SFX === 'OFF') return;

        this.sources.forEach((source, i) => {
            source.start(0, source.buffer.duration * (i / this.sources.length));
        });
        this.playing = true;
    }

    stop() {
        if (!this.ready || !this.playing) return;

        const newSources = [];

        this.sources.forEach((source) => {
            source.stop(0); // this destroys the buffer source
            const newSource = this.audioContext.createBufferSource(); // so we need to create a new one
            newSource.buffer = this.buf;
            newSource.loop = true;
            newSource.connect(this.gainNode);
            newSources.push(newSource);
        });

        this.sources = newSources;

        this.playing = false;
    }
}
