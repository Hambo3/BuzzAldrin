
var AudioManager = function (files) {

    var sounds = [];

    for (let i = 0; i < files.length; i++) {
        switch (files[i].type) {
            case "play":
                sounds[files[i].key] = new AudioPlay(files[i].src);
                break;
            case "loop":
                sounds[files[i].key] = new AudioLoop(files[i].src);
                break;
            case "sequence":
                sounds[files[i].key] = new AudioSequence(files[i].src, true);
                break; 
            default:
                break;
        }
    }

    function stop(index){
        sounds[index].Stop();
    }

    function play(index){
        sounds[index].Play();
    }

    return {
        Play: function (index) {
            play(index);
        },
        Stop: function (index){
            stop(index);
        }
    }
};

var AudioSequence = function (snds, rnd) {
    var sounds = [];
    var playing = false;
    for (let i = 0; i < snds.length; i++) {
        var s = new Audio(snds[i]);
        s.addEventListener('ended', next, false);
        sounds.push(s);   
    }

    var index = rnd ? Util.Rnd(0, sounds.length) : 0;

    function next(){
        playing = false;
        if(rnd){
            index = Util.Rnd(0, sounds.length);
        }
        else{
            index = (index < sounds.length-1) ? index+1 : 0;
        }
        console.log(index);
    }

    function play(){
        if(playing == false){
            this.currentTime = 0;
            sounds[index].play();
            playing = true;
        }
    }

    return {
        Play: function () {
            play();
        }
    }
};

var AudioLoop = function (snd) {
    var sound = new Audio(snd);
    sound.addEventListener('ended', play, false);

    function play(){
        this.currentTime = 0;
        sound.play();
    }

    function stop(){
        sound.removeEventListener('ended', play);
    }

    return {
        Play: function () {
            play();
        },
        Stop: function (){
            stop();
        }
    }
};

var AudioPlay = function (snd) {
    var sound = new Audio(snd);

    function play(){
        sound.play();
    }

    return {
        Play: function () {
            play();
        },
        Stop: function (){
            stop();
        }
    }
};