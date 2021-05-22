export default class BGM {
    constructor(url, volume = 1) {
        this.url = url;
        this.volume = volume;
    }

    init(playAfter, onAfterInit) {
        if (this.didInit) return;

        this.didInit = true;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.audioContext.destination);

        this.source = this.audioContext.createBufferSource();

        fetch(this.url)
            .then((resp) => resp.arrayBuffer())
            .then((buf) => this.audioContext.decodeAudioData(buf)) // can be callback as well
            .then((decoded) => {
                this.source.buffer = this.buf = decoded;
                this.source.loop = true;
                this.source.connect(this.gainNode);
                this.ready = true;

                if (playAfter) {
                    this.play();
                    onAfterInit();
                }
            })
            .catch((err) => console.error(err));
    }

    play(...args) {
        if (!this.ready || this.isPlaying) return false;

        this.source.start(...args);
        this.isPlaying = true;
    }

    stop() {
        if (!this.ready || !this.isPlaying) return;

        this.source.stop(0); // this destroys the buffer source
        const newSource = this.audioContext.createBufferSource(); // so we need to create a new one
        newSource.buffer = this.buf;
        newSource.loop = true;
        newSource.connect(this.gainNode);

        this.source = newSource;
        this.isPlaying = false;
    }
}
