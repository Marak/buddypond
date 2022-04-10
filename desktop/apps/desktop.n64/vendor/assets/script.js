var AUDIOBUFFSIZE = 1024;

class MyClass {
    constructor() {
        this.rom_name = '';
        this.mobileMode = false;
        this.allSaveStates = [];
        this.loginModalOpened = false;
        this.loadSavestateAfterBoot = false;
        this.canvasSize = 640;
        this.dblist = [];
        var Module = {};
        Module['canvas'] = document.getElementById('canvas');
        window['Module'] = Module;
        document.getElementById('file-upload').addEventListener('change', this.uploadRom.bind(this));


        this.rivetsData = {
            message: '',
            beforeEmulatorStarted: true,
            moduleInitializing: true,
            showLogin: false,
            currentFPS: 0,
            audioSkipCount: 0,
            n64SaveStates: [],
            loggedIn: false,
            noCloudSave: true,
            password: '',
            inputController: null,
            remappings: null,
            remapMode: '',
            currKey: 0,
            currJoy: 0,
            chkUseJoypad: false,
            remappingPlayer1: false,
            hasRoms: false,
            romList: [],
            inputLoopStarted: false,
            noLocalSave: true,
            lblError: ''
        };

        if (window["CLOUDSAVEURL"]!="")
        {
            this.rivetsData.showLogin = true;
        }

        if (window["ROMLIST"].length > 0)
        {
            this.rivetsData.hasRoms = true;
            window["ROMLIST"].forEach(rom => {
                this.rivetsData.romList.push(rom);
            });
        }

        rivets.formatters.ev = function (value, arg) {
            return eval(value + arg);
        }
        rivets.formatters.ev_string = function (value, arg) {
            let eval_string = "'" + value + "'" + arg;
            return eval(eval_string);
        }

        rivets.bind(document.getElementById('topPanel'), { data: this.rivetsData });
        rivets.bind(document.getElementById('bottomPanel'), { data: this.rivetsData });
        rivets.bind(document.getElementById('loginModal'), { data: this.rivetsData });
        rivets.bind(document.getElementById('buttonsModal'), { data: this.rivetsData });
        rivets.bind(document.getElementById('lblError'), { data: this.rivetsData });
        

        this.setupDragDropRom();
        this.detectMobile();
        this.setupLogin();
        this.setupInputController();
        this.createDB();

        $('#topPanel').show();
        $('#lblErrorOuter').show();
        
    }

    setupInputController(){
        this.rivetsData.inputController = new InputController();
        

        //try to load keymappings from localstorage
        try {
            let keymappings = localStorage.getItem('n64wasm_mappings_v3');
            if (keymappings) {
                let keymappings_object = JSON.parse(keymappings);

                for (let [key, value] of Object.entries(keymappings_object)) {
                    if (key in this.rivetsData.inputController.KeyMappings){
                        this.rivetsData.inputController.KeyMappings[key] = value;
                    }
                }
            }
        } catch (error) { }
        
    }

    inputLoop(){
        myClass.rivetsData.inputController.update();
        if (myClass.rivetsData.beforeEmulatorStarted)
        {
            setTimeout(() => {
                myClass.inputLoop();
            }, 100);
        }
    }


    processPrintStatement(text) {
        console.log(text);

        //emulator has started event
        if (text.includes('mupen64plus: Starting R4300 emulator: Cached Interpreter')) {
            console.log('detected emulator started');

            if (myClass.loadSavestateAfterBoot)
            {
                setTimeout(() => {
                    myClass.loadCloud();
                }, 500);
            }
            
        }
    }

    detectMobile(){
        if (window.innerWidth < 600 || navigator.userAgent.toLocaleLowerCase().includes('iphone') ||
        navigator.userAgent.toLocaleLowerCase().includes('ipad') )
            this.mobileMode = true;
        else
            this.mobileMode = false;
    }

    async LoadEmulator(byteArray){
        if (this.rom_name.toLocaleLowerCase().endsWith('.zip'))
        {
            this.rivetsData.lblError = 'Zip format not supported. Please uncompress first.'
            this.rivetsData.beforeEmulatorStarted = false;
        }
        else
        {
            FS.writeFile('custom.v64',byteArray);
            this.WriteConfigFile();
            $('#canvasDiv').show();
            Module.callMain(['custom.v64']);
            this.findInDatabase();
            this.configureEmulator();
            this.initAudio();
            this.rivetsData.beforeEmulatorStarted = false;
        }

    }

    async initAudio() {

        this.audioContext = new AudioContext({
            latencyHint: 'interactive',
            sampleRate: 44100, //this number has to match what's in gui.cpp
        });
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0.5;
        this.gainNode.connect(this.audioContext.destination);

        //point at where the emulator is storing the audio buffer
        this.audioBufferResampled = new Int16Array(Module.HEAP16.buffer,Module._neilGetSoundBufferResampledAddress(),64000);

        this.audioWritePosition = 0;
        this.audioReadPosition = 0;
        this.audioBackOffCounter = 0;
        this.audioThreadLock = false;


        //emulator is synced to the OnAudioProcess event because it's way
        //more accurate than emscripten_set_main_loop or RAF
        //and the old method was having constant emulator slowdown swings
        //so the audio suffered as a result
        this.pcmPlayer = this.audioContext.createScriptProcessor(AUDIOBUFFSIZE, 2, 2);
        this.pcmPlayer.onaudioprocess = this.AudioProcessRecurring.bind(this);
        this.pcmPlayer.connect(this.gainNode);

    }

    hasEnoughSamples(){

        let readPositionTemp = this.audioReadPosition;
        let enoughSamples = true;
        for (let sample = 0; sample < AUDIOBUFFSIZE; sample++)
        {
            if (this.audioWritePosition != readPositionTemp) {
                readPositionTemp += 2;

                //wrap back around within the ring buffer
                if (readPositionTemp == 64000) {
                    readPositionTemp = 0;
                }
            }
            else {
                enoughSamples = false;
            }
        }

        return enoughSamples;
    }

    //this method keeps getting called when it needs more audio
    //data to play so we just keep streaming it from the emulator
    AudioProcessRecurring(audioProcessingEvent){

        //I think this method is thread safe but just in case
        if (this.audioThreadLock)
        {
            // console.log('audio thread dupe');
            return;
        }
        
        this.audioThreadLock = true;



        var sampleRate = audioProcessingEvent.outputBuffer.sampleRate;
        let outputBuffer = audioProcessingEvent.outputBuffer;
        let outputData1 = outputBuffer.getChannelData(0);
        let outputData2 = outputBuffer.getChannelData(1);

        this.audioWritePosition = Module._neilGetAudioWritePosition();

            Module._runMainLoop();

        this.audioWritePosition = Module._neilGetAudioWritePosition();


        if (!this.hasEnoughSamples())
            Module._runMainLoop();

        this.audioWritePosition = Module._neilGetAudioWritePosition();
    

        // if (!this.hasEnoughSamples())
        //     console.log('not enough samples');

        // console.log('Write: ' + this.audioWritePosition + ' Read: ' + this.audioReadPosition);

        let hadSkip = false;


        //the bytes are arranged L,R,L,R,etc.... for each speaker
        for (let sample = 0; sample < AUDIOBUFFSIZE; sample++) {

            if (this.audioWritePosition != this.audioReadPosition) {
                outputData1[sample] = (this.audioBufferResampled[this.audioReadPosition] / 32768);
                outputData2[sample] = (this.audioBufferResampled[this.audioReadPosition + 1] / 32768);

                this.audioReadPosition += 2;

                //wrap back around within the ring buffer
                if (this.audioReadPosition == 64000) {
                    this.audioReadPosition = 0;
                }
            }
            else {
                //if there's nothing to play then just play silence
                outputData1[sample] = 0;
                outputData2[sample] = 0;

                //if we caught up on samples then back off
                //for 2 frames to buffer some audio
                // if (this.audioBackOffCounter == 0) {
                //     this.audioBackOffCounter = 2;
                // }

                hadSkip = true;

            }

        }

        
        if (hadSkip)
            this.rivetsData.audioSkipCount++;

        this.audioThreadLock = false;

    }

    WriteConfigFile()
    {
        let configString = "";

        //gamepad
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Up + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Down + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Left + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Right + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Action_A + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Action_B + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Action_Start + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Action_Z + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Action_L + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Action_R + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Joy_Mapping_Menu + "\r\n";

        //keyboard
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Left + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Right + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Up + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Down + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_Start + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_CUP + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_CDOWN + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_CLEFT + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_CRIGHT + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_Z + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_L + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_R + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_B + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Action_A + "\r\n";
        configString += this.rivetsData.inputController.KeyMappings.Mapping_Menu + "\r\n";

        FS.writeFile('config.txt',configString);
    }


    uploadBrowse() {
        document.getElementById('file-upload').click();
    }

    uploadRom(event) {
        var file = event.currentTarget.files[0];
        myClass.rom_name = file.name;
        console.log(file);
        var reader = new FileReader();
        reader.onprogress = function (e) {
            console.log('loaded: ' + e.loaded);
        };
        reader.onload = function (e) {
            console.log('finished loading');
            var byteArray = new Uint8Array(this.result);
            myClass.LoadEmulator(byteArray);
        }
        reader.readAsArrayBuffer(file);
    }

    resizeCanvas() {
        $('#canvas').width(this.canvasSize);
    }

    zoomOut() {

        this.canvasSize -= 50;
        localStorage.setItem('n64wasm-size', this.canvasSize.toString());
        this.resizeCanvas();
    }

    zoomIn() {
        this.canvasSize += 50;
        localStorage.setItem('n64wasm-size', this.canvasSize.toString());
        this.resizeCanvas();
    }


    async initModule(){
        console.log('module initialized');
        myClass.rivetsData.moduleInitializing = false;
        //myClass.loadFiles();
    }

    //not being used currently
    async loadFiles(){
        let files = ["shader_vert.hlsl", "shader_frag.hlsl"];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let responseText = await $.ajax({
                url: file,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                }
            });
            console.log(file,responseText.length);
            FS.writeFile(
                file, // file name
                responseText
            );
        }
    }

    //DRAG AND DROP ROM
    setupDragDropRom(){
        let dropArea = document.getElementById('dropArea');

        dropArea.addEventListener('dragenter', this.preventDefaults, false);
        dropArea.addEventListener('dragover', this.preventDefaults, false);
        dropArea.addEventListener('dragleave', this.preventDefaults, false);
        dropArea.addEventListener('drop', this.preventDefaults, false);
        
        dropArea.addEventListener('dragenter', this.dragDropHighlight, false);
        dropArea.addEventListener('dragover', this.dragDropHighlight, false);
        dropArea.addEventListener('dragleave', this.dragDropUnHighlight, false);
        dropArea.addEventListener('drop', this.dragDropUnHighlight, false);

        dropArea.addEventListener('drop', this.handleDrop, false);

    }

    preventDefaults(e){
        e.preventDefault();
        e.stopPropagation();
    }

    dragDropHighlight(e){
        $('#dropArea').css({"background-color": "lightblue"});
    }

    dragDropUnHighlight(e){
        $('#dropArea').css({"background-color": "inherit"});
    }

    handleDrop(e){
        let dt = e.dataTransfer;
        let files = dt.files;

        var file = files[0];
        myClass.rom_name = file.name;
        console.log(file);
        var reader = new FileReader();
        reader.onprogress = function (e) {
            console.log('loaded: ' + e.loaded);
        };
        reader.onload = function (e) {
            console.log('finished loading');
            var byteArray = new Uint8Array(this.result);
            myClass.LoadEmulator(byteArray);
        }
        reader.readAsArrayBuffer(file);

    }

    loadRomAndSavestate(){
        let selector = document.getElementById('romselect');
        let saveToLoad = document.getElementById('savestateSelect')["value"];

        for (let i=0;i<selector.options.length;i++)
        {
            let romurl = selector.options[i].value;
            let romname = romurl.substr(5);

            if (saveToLoad==romname + '.n64wasm')
            {
                selector.selectedIndex = i; 
                this.loadSavestateAfterBoot = true;
            }
        }

        this.loadRom();
    }

    async loadRom() {
        //get rom url
        let romurl = document.getElementById('romselect')["value"];
        console.log(romurl);
        this.rom_name = romurl.substr(5);

        this.load_url(romurl);
    }

    load_url(path) {
        console.log('loading ' + path);

        var req = new XMLHttpRequest();
        req.open("GET", path);
        req.overrideMimeType("text/plain; charset=x-user-defined");
        req.onerror = () => console.log(`Error loading ${path}: ${req.statusText}`);
        req.responseType = "arraybuffer";

        req.onload = function () {
            var arrayBuffer = req.response; // Note: not oReq.responseText
            try{
                if (arrayBuffer) {
                    var byteArray = new Uint8Array(arrayBuffer);
                    myClass.LoadEmulator(byteArray);
                }
                else{
                    //toastr.error('Error Loading Cloud Save');
                }
            }
            catch(error){
                console.log(error);
                toastr.error('Error Loading Save');
            }
        };

        req.send();
    }

    

    saveStateLocal(){
        console.log('saveStateLocal');
        this.rivetsData.noLocalSave = false;
        Module._neil_serialize();
    }

    loadStateLocal(){
        console.log('loadStateLocal');
        myClass.loadFromDatabase();
    }

    createDB() {

        if (window["indexedDB"]==undefined){
            console.log('indexedDB not available');
            return;
        }

        var request = indexedDB.open('N64WASMDB');
        request.onupgradeneeded = function (ev) {
            console.log('upgrade needed');
            let db = ev.target.result;
            let objectStore = db.createObjectStore('N64WASMSTATES', { autoIncrement: true });
            objectStore.transaction.oncomplete = function (event) {
                console.log('db created');
            };
        }

        request.onsuccess = function (ev) {
            var db = ev.target.result;
            var romStore = db.transaction("N64WASMSTATES", "readwrite").objectStore("N64WASMSTATES");
            try {
                //rewrote using cursor instead of getAllKeys
                //for compatibility with MS EDGE
                romStore.openCursor().onsuccess = function (ev) {
                    var cursor = ev.target.result;
                    if (cursor) {
                        let rom = cursor.key.toString();
                        myClass.dblist.push(rom);
                        cursor.continue();
                    }
                    else {
                        if (myClass.dblist.length > 0) {
                            //TODO show savestates grid
                        }
                    }
                }

            } catch (error) {
                console.log('error reading keys');
                console.log(error);
            }

        }

    }

    findInDatabase() {

        if (!window["indexedDB"]==undefined){
            console.log('indexedDB not available');
            return;
        }
        
        var request = indexedDB.open('N64WASMDB');
        request.onsuccess = function (ev) {
            var db = ev.target.result;
            var romStore = db.transaction("N64WASMSTATES", "readwrite").objectStore("N64WASMSTATES");
            try {
                romStore.openCursor().onsuccess = function (ev) {
                    var cursor = ev.target.result;
                    if (cursor) {
                        let rom = cursor.key.toString();
                        if (myClass.rom_name == rom)
                        {
                            myClass.rivetsData.noLocalSave = false;
                        }
                        cursor.continue();
                    }
                }

            } catch (error) {
                console.log('error reading keys');
                console.log(error);
            }
        }
    }

    saveToDatabase(data) {

        if (!window["indexedDB"]==undefined){
            console.log('indexedDB not available');
            return;
        }
        
        console.log('save to database called: ', data.length);

        var request = indexedDB.open('N64WASMDB');
        request.onsuccess = function (ev) {
            var db = ev.target.result;
            var romStore = db.transaction("N64WASMSTATES", "readwrite").objectStore("N64WASMSTATES");
            var addRequest = romStore.put(data, myClass.rom_name);
            addRequest.onsuccess = function (event) {
                console.log('data added');
                toastr.info('State Saved');
            };
            addRequest.onerror = function (event) {
                console.log('error adding data');
                console.log(event);
            };
        }
    }


    loadFromDatabase() {

        var request = indexedDB.open('N64WASMDB');
        request.onsuccess = function (ev) {
            var db = ev.target.result;
            var romStore = db.transaction("N64WASMSTATES", "readwrite").objectStore("N64WASMSTATES");
            var rom = romStore.get(myClass.rom_name);
            rom.onsuccess = function (event) {
                let byteArray = rom.result; //Uint8Array
                FS.writeFile('/savestate.gz',byteArray);
                Module._neil_unserialize();

            };
            rom.onerror = function (event) {
                toastr.error('error getting rom from store');
            }
        }
        request.onerror = function (ev) {
            toastr.error('error loading from db')
        }

    }


    clearDatabase() {

        var request = indexedDB.deleteDatabase('N64WASMDB');
        request.onerror = function (event) {
            console.log("Error deleting database.");
            toastr.error("Error deleting database");
        };

        request.onsuccess = function (event) {
            console.log("Database deleted successfully");
            toastr.error("Database deleted successfully");
        };

    }
    


    //when it returns from emscripten
    SaveStateEvent()
    {
        console.log('js savestate event');
        let compressed = FS.readFile('/savestate.gz'); //this is a Uint8Array

        //use local db
        if (!myClass.rivetsData.loggedIn)
        {
            myClass.saveToDatabase(compressed);
            return;
        }


        var xhr = new XMLHttpRequest;
        xhr.open("POST", window["CLOUDSAVEURL"] + "/SendStaveState?name=" + this.rom_name + '.n64wasm' + 
            "&password=" + this.rivetsData.password + "&emulator=n64", true);
        xhr.send(compressed);

        xhr.onreadystatechange = function() {
            try{
                if (xhr.readyState === 4) {
                    let result = xhr.response;
                    if (result=="\"Success\""){
                        myClass.rivetsData.noCloudSave = false;
                        toastr.info("Cloud State Saved");
                    }else{
                        toastr.error('Error Saving Cloud Save');
                    }
                }
            }
            catch(error){
                console.log(error);
                toastr.error('Error Loading Cloud Save');
            }
            
        }
    }

    saveCloud(){
        Module._neil_serialize();
    }

    loadCloud(){

        //use local db
        if (!myClass.rivetsData.loggedIn)
        {
            myClass.loadFromDatabase();
            return;
        }

        var oReq = new XMLHttpRequest();
        oReq.open("GET", window["CLOUDSAVEURL"] + "/LoadStaveState?name=" + this.rom_name + '.n64wasm' +
         "&password=" + this.rivetsData.password, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response; // Note: not oReq.responseText
            try{
                if (arrayBuffer) {
                    var byteArray = new Uint8Array(arrayBuffer);
                    FS.writeFile('/savestate.gz',byteArray);
                    Module._neil_unserialize();
                }
                else{
                    toastr.error('Error Loading Cloud Save');
                }
            }
            catch(error){
                console.log(error);
                toastr.error('Error Loading Cloud Save');
            }
            
        };

        oReq.send(null);
    }

    fullscreen(){
        let el = document.getElementById('canvas');

        if(el.webkitRequestFullScreen) {
            el.webkitRequestFullScreen();
        }
       else {
          el.mozRequestFullScreen();
       }     
    }

    newRom(){
        location.reload();
    }

    configureEmulator(){
        let size = localStorage.getItem('n64wasm-size');
        if (size) {
            console.log('size found');
            let sizeNum = parseInt(size);
            this.canvasSize = sizeNum;
        }
        this.resizeCanvas();

        if (this.rivetsData.password)
            this.loginSilent();
    }


    showRemapModal() {

        //start input loop
        if (!this.rivetsData.inputLoopStarted)
        {
            this.rivetsData.inputLoopStarted = true;
            this.rivetsData.inputController.setupGamePad();
            setTimeout(() => {
                myClass.inputLoop();
            }, 100);
        }
        
        if (this.rivetsData.inputController.Gamepad_Process_Axis)
            this.rivetsData.chkUseJoypad = true;
        this.rivetsData.remappings = JSON.parse(JSON.stringify(this.rivetsData.inputController.KeyMappings));
        this.rivetsData.remapWait = false;
        $("#buttonsModal").modal();
    }
    

    saveRemap() {
        if (this.rivetsData.chkUseJoypad)
            this.rivetsData.inputController.Gamepad_Process_Axis = true;
        else
            this.rivetsData.inputController.Gamepad_Process_Axis = false;

        this.rivetsData.inputController.KeyMappings = JSON.parse(JSON.stringify(this.rivetsData.remappings));
        this.rivetsData.inputController.setGamePadButtons();
        localStorage.setItem('n64wasm_mappings_v3', JSON.stringify(this.rivetsData.remappings));
        $("#buttonsModal").modal('hide');
    }

    btnRemapKey(keynum) {
        console.log(this);
        this.rivetsData.currKey = keynum;
        this.rivetsData.remapMode = 'Key';
        this.readyRemap();
    }

    btnRemapJoy(joynum) {

        this.rivetsData.currJoy = joynum;
        this.rivetsData.remapMode = 'Button';
        this.readyRemap();
    }

    readyRemap() {
        this.rivetsData.remapWait = true;
        this.rivetsData.inputController.Key_Last = '';
        this.rivetsData.inputController.Joy_Last = null;
        this.rivetsData.inputController.Remap_Check = true;
    }

    restoreDefaultKeymappings(){
        this.rivetsData.remappings = this.rivetsData.inputController.defaultKeymappings();
    }

    remapPressed() {
        if (this.rivetsData.remapMode == 'Key') {
            var keyLast = this.rivetsData.inputController.Key_Last;

            //player 1
            if (this.rivetsData.currKey == 1) this.rivetsData.remappings.Mapping_Up = keyLast;
            if (this.rivetsData.currKey == 2) this.rivetsData.remappings.Mapping_Down = keyLast;
            if (this.rivetsData.currKey == 3) this.rivetsData.remappings.Mapping_Left = keyLast;
            if (this.rivetsData.currKey == 4) this.rivetsData.remappings.Mapping_Right = keyLast;
            if (this.rivetsData.currKey == 5) this.rivetsData.remappings.Mapping_Action_A = keyLast;
            if (this.rivetsData.currKey == 6) this.rivetsData.remappings.Mapping_Action_B = keyLast;
            if (this.rivetsData.currKey == 8) this.rivetsData.remappings.Mapping_Action_Start = keyLast;
            if (this.rivetsData.currKey == 9) this.rivetsData.remappings.Mapping_Menu = keyLast;
            if (this.rivetsData.currKey == 10) this.rivetsData.remappings.Mapping_Action_Z = keyLast;
            if (this.rivetsData.currKey == 11) this.rivetsData.remappings.Mapping_Action_L = keyLast;
            if (this.rivetsData.currKey == 12) this.rivetsData.remappings.Mapping_Action_R = keyLast;
            if (this.rivetsData.currKey == 13) this.rivetsData.remappings.Mapping_Action_CUP = keyLast;
            if (this.rivetsData.currKey == 14) this.rivetsData.remappings.Mapping_Action_CDOWN = keyLast;
            if (this.rivetsData.currKey == 15) this.rivetsData.remappings.Mapping_Action_CLEFT = keyLast;
            if (this.rivetsData.currKey == 16) this.rivetsData.remappings.Mapping_Action_CRIGHT = keyLast;

        }
        if (this.rivetsData.remapMode == 'Button') {
            var joyLast = this.rivetsData.inputController.Joy_Last;
            if (this.rivetsData.currJoy == 1) this.rivetsData.remappings.Joy_Mapping_Up = joyLast;
            if (this.rivetsData.currJoy == 2) this.rivetsData.remappings.Joy_Mapping_Down = joyLast;
            if (this.rivetsData.currJoy == 3) this.rivetsData.remappings.Joy_Mapping_Left = joyLast;
            if (this.rivetsData.currJoy == 4) this.rivetsData.remappings.Joy_Mapping_Right = joyLast;
            if (this.rivetsData.currJoy == 5) this.rivetsData.remappings.Joy_Mapping_Action_A = joyLast;
            if (this.rivetsData.currJoy == 6) this.rivetsData.remappings.Joy_Mapping_Action_B = joyLast;
            if (this.rivetsData.currJoy == 8) this.rivetsData.remappings.Joy_Mapping_Action_Start = joyLast;
            if (this.rivetsData.currJoy == 9) this.rivetsData.remappings.Joy_Mapping_Menu = joyLast;
            if (this.rivetsData.currJoy == 10) this.rivetsData.remappings.Joy_Mapping_Action_Z = joyLast;
            if (this.rivetsData.currJoy == 11) this.rivetsData.remappings.Joy_Mapping_Action_L = joyLast;
            if (this.rivetsData.currJoy == 12) this.rivetsData.remappings.Joy_Mapping_Action_R = joyLast;
        }
        this.rivetsData.remapWait = false;
    }

    async setupLogin() {
        //prevent submit on enter 
        $('#txtPassword').bind("keypress", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                myClass.loginSubmit();
                return false;
            }
        });

        let pw = localStorage.getItem('n64wasm-password');
        if (pw==null)
            this.rivetsData.password = '';
        else
            this.rivetsData.password = pw;

        if (this.rivetsData.password){
            await this.loginSilent();
        }
            
    }

    loginModal(){
        $("#loginModal").modal();
        this.loginModalOpened = true;
        setTimeout(() => {
            //focus on textbox
            $("#txtPassword").focus();
        }, 500);
    }

    logout(){
        this.rivetsData.loggedIn = false;
        this.rivetsData.password = '';
        localStorage.setItem('n64wasm-password', this.rivetsData.password);
    }

    async loginSubmit(){
        $('#loginModal').modal('hide');
        this.loginModalOpened = false;
        let result = await this.loginToServer();
        if (result=='Success'){
            toastr.success('Logged In');
            localStorage.setItem('n64wasm-password', this.rivetsData.password);
            await this.getSaveStates();
            this.postLoginProcess();            
        }
        else{
            toastr.error('Login Failed');
            this.rivetsData.password = '';
            localStorage.setItem('n64wasm-password', '');
        }
    }

    async loginSilent(){
        if (!this.rivetsData.showLogin)
            return;
        
        let result = await this.loginToServer();
        if (result=='Success'){
            await this.getSaveStates();
            this.postLoginProcess();
        }
    }

    postLoginProcess(){
        //filter by .n64wasm extension and sort by date
        this.rivetsData.n64SaveStates = this.allSaveStates.filter((state)=>{
            return state.Name.endsWith('.n64wasm')
        });
        this.rivetsData.n64SaveStates.forEach(state => {
            state.Date = this.convertCSharpDateTime(state.Date);
        });
        this.rivetsData.n64SaveStates.sort((a,b)=>{ return b.Date.getTime() - a.Date.getTime() });
        this.rivetsData.loggedIn = true;
    }

    convertCSharpDateTime(initialDate) {
        let dateString = initialDate;
        dateString = dateString.substring(0, dateString.indexOf('T'));
        let timeString = initialDate.substr(initialDate.indexOf("T") + 1);
        let dateComponents = dateString.split('-');
        let timeComponents = timeString.split(':');
        let myDate = null;

        myDate = new Date(parseInt(dateComponents[0]), parseInt(dateComponents[1]) - 1, parseInt(dateComponents[2]),
            parseInt(timeComponents[0]), parseInt(timeComponents[1]), parseInt(timeComponents[2]));
        return myDate;
    }

    async loginToServer(){
        let result = await $.get(window["CLOUDSAVEURL"] + '/Login?password=' + this.rivetsData.password);
        console.log('login result: ' + result);
        return result;
    }

    async getSaveStates(){
        let result = await $.get(window["CLOUDSAVEURL"] + '/GetSaveStates?password=' + this.rivetsData.password);
        console.log('getSaveStates result: ', result);
        this.allSaveStates = result;
        result.forEach(element => {
            if (element.Name==this.rom_name + ".n64wasm")
                this.rivetsData.noCloudSave = false;
        });
        return result;
    }

    
    
}
let myClass = new MyClass();
window["myApp"] = myClass; //so that I can reference from EM_ASM

window["Module"] = {
    onRuntimeInitialized: myClass.initModule,
    canvas: document.getElementById('canvas'),
    print: (text) => myClass.processPrintStatement(text),
    // printErr: (text) => myClass.print(text)
}

var script = document.createElement('script');
script.src = 'n64wasm.js'
document.getElementsByTagName('head')[0].appendChild(script);

