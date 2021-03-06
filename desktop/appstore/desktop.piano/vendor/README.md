# webaudio-tinysynth
WebAudio Tiny GM mapped Synthesizer [JavaScript]

[![npm](https://img.shields.io/npm/v/webaudio-tinysynth.svg)](https://www.npmjs.com/package/webaudio-tinysynth)

## Overview

**webaudio-tinysynth** is a small synthesizer written in JavaScript with GM like timbre map.
All timbres are generated by the combinations of Oscillator and dynamically generated BufferSource algolithmically without any PCM samples.

- There are two ways to use this library, CustomElement or simple Javascript library.
  The CustomElement can be used by a Tag in HTML, '&lt;webaudio-tinysynth&gt;&lt;/webaudio-tinysynth&gt;'. It has small graphical display and play controls like HTML5 &lt;audio&gt; tags. MIDI file drop is also acceptable. JavaScript version has no GUI and everything are controlled by function call. The synthesizer instance will be created like this: 'synth = new WebAudioTinySynth()'. You can control from the JavaScript API in the same way in either usage.

- The APIs are MIDI like. Function  `send([midi-message],timestamp)` receives MIDI message and generate sounds.

- Two timbre set are supported. These are switched by `quality` option. `quality=0` mode is light-weight chip-tune like sounds that use 1 osc per 1 note. `quality=1` mode is FM based sounds and use 2 or more osc per 1 note.

- webaudio-tinysynth has a built-in MIDI-SMF (.mid file) sequencer. It is initiated by function call or MIDI file drag & drop.

CustomElement version GUI :  
![./tinysynth0.png](./tinysynth0.png)  MIDI files is not loaded  

![./tinysynth1.png](./tinysynth1.png)  MIDI files is loaded  
Upper red indicator shows Note#  
Lower red indicator shows MIDI ch.  

## Files
  **webaudio-tinysynth.js** : JavaScript library  
  **webaudio-tinysynth.min.js** : JavaScript library minified version  
  Each one works with only one file, there are no dependencies.

## Environment
 Webaudio-tinysynth is confirmed to work with the following browsers
  * Chrome / Firefox / Edge / Safari

## Live Demo
Test Pages are here :  
 [soundedit.html](https://g200kg.github.io/webaudio-tinysynth/soundedit.html)  (CustomElement playable demo with timbre edit function  / MIDI keyboard via WebMIDI API)  
 [simple.html](https://g200kg.github.io/webaudio-tinysynth/simple.html)  (Most simple sample of CustomElement)  
 [jstest.html](https://g200kg.github.io/webaudio-tinysynth/jstest.html)   (Use from simple JavaScript without GUI)

## Usage

### Load this Library

* Necessary file is a `webaudio-tinysynth.js` ( or minified `webaudio-tinysynth.min.js` ) only. Deploy webaudio-tinysynth.js appropriately and load library:
  * `<script src='webaudio-tinysynth.js'></script>`.  
  * Or load it from a CDN:  
  `<script src='https://g200kg.github.io/webaudio-tinysynth/webaudio-tinysynth.js'></script>`
  * Or:  
  `<script src='https://cdn.jsdelivr.net/npm/webaudio-tinysynth'></script>`
  * Or via npm (`npm install webaudio-tinysynth --save`):  
  `var WebAudioTinySynth = require('webaudio-tinysynth');`

### Without GUI

* To make the instance of synthesizer without GUI, use following command :  
`synth = new WebAudioTinySynth();`  
  Some options are acceptable. For example :
  * `synth = new WebAudioTinySynth({quality:0, useReverb:0});`

* Then use the function calls described later for that instance. For example...  
 `synth.send([0x90, 60, 100]); // NoteOn:ch1 Note#:60 Velocity:100 `

### With GUI

+ If you want to run on older browsers that don't support custom elements, you need a polyfill of 'CustomElements'. Following script tag will load polyfill from CDN. Be sure to read polyfill before webaudio-tinysynth.js   
* `<script src="https://unpkg.com/@webcomponents/custom-elements"></script>`

* Place webaudio-tinysynth element in HTML  
  * `<webaudio-tinysynth></webaudio-tinysynth>`
  * To get instance of synthesizer for JavaScript API, as usual:   
  `synth = document.getElementById("wbaudio-tinysynth tag id here");`

## Attributes
 These attributes are for CustomElement.

|Attribute          |Options|Default   |Description               |
|-------------------|-------|----------|--------------------------|
|**width**          |String |"300px"   | width of element         |
|**height**         |String |"32px"    | height of element        |
|**masterVol**      |Number | 1.0      | master volume            |
|**reverbLev**      |Number | 0.3      | reverb level             |
|**useReverb**      |Number | 1        | disable Reverb if 0. It makes a little save the CPU consumption.      |
|**quality**        |Number | 1        | 0: 1osc/note chiptune like<br/> 1: 2 or more oscs/note FM based|
|**src**            |String |null      | .mid file url            |
|**loop**           |Number | 0        | loop playMIDI            |
|**disableDrop**    |Number | 0        | disable MIDI file drop   |
|**graph**          |Number | 1        | enable waveform graph    |
|**internalContext**|Number | 1        | Use internal audioContext|
|**tsmode**         |Number | 0        | default timestamp mode   |
|**perfmon**        |Number | 0        | performance monitor      |
|**voices**         |Number | 64       | Max number of simultaneous voices. Large number needs more CPU.               |


* In default, necessary audioContext will be created internally. `internalContext="0"` will prevent this and should provide audioContext with `setAudioContext()` function.
* Note that the webaudio-tinysynth may not be ready yet immediately after 'window.onload' if you use 'CustomElement'. especially be careful if using webcomponents polyfill. Use `ready()` function for wait to complete th initialize that return a `Promise` that will be resolved when initialize completed.  
 `isReady` flag also be usable for confirming the synth is ready.

```
// use "then"
synth = document.getElementById("synth");
synth.ready().then(()=>{
  ...
});

// or in "async" function : 
async function() {
  synth = document.getElementById("synth");
  await synth.ready();
  ...
}

```

## Functions
  These functions are available for polymer module and javascript version.  

**WebAudioTinySynth(options)**  
> Constructor of WebAudioTinySynth for JavaScript version. This is not used for Polymer version. options is a object with members :  

>  **quality** : Specify timbre quality same as setQuality(). default is `1`.  
>  **useReverb** : If zero, disable reverb function.  
>  **voices** : max number of voices.
>
>  For example, `new WebAudioTinySynth({quality:0, useReverb:0, voices:32})`

**getAudioContext()**  
> Get current in-use AudioContext.

**setAudioContext(audioContext, destinationNode)**  
> In default, though audioContext is internally created and used, this function can specify `audioContext` should be used.  
> All sounds are routed to specified `destinationNode`, or audioContext.destination is used if destinationNode is not specified.  
> the audioContext in use currently can be accessed with `getAudioContext()` fucntion.

**getTimbreName(m,n)**
> get name of specified timbre. m=0:normal channel voice,n=prog#. or m=1:drum track,n=note#

**setQuality(q)**
> Switch timbre set.  
> q=0 : chip tune like 1 osc / note.  
> q=1 : FM based 2 (or more) osc / note.

**setMasterVol(lev)**
> Master volume setting. default=0.5.

**setReverbLev(lev)**
> Reverb Level setting. default=0.3.

**setLoop(f)**
> if non zero, MIDI play is looped.

**setVoices(v)**
> set max voices that simultaneous sounds, default is 64.

**loadMIDI(mididata)**
> load MIDI data to built-in sequencer. mididata is a arraybuffer of SMF (.mid file contents).

**loadMIDIUrl(url)**
> load MIDI data from specified url

**playMIDI()**
> play loaded MIDI data.

**stopMIDI()**
> stop playing MIDI data.

**locateMIDI(tick)**
> locate current playing position in tick.

**getPlayStatus()**
> get current MIDI sequence play status.
> return value is a object `{play:playstatus, curTick:currenttick, maxTick:maxtick}`

**setTsMode(mode)**
> Set time stamp mode that is used in send() or Channel message functions.  
> If `mode=0` timestamp is a time of in-use audioContext's currentTime timeline.
> If `mode=1` timestamp is HighResolutionTime timeline.

**setTimbre(m,n,p)**
> Even webaudio-tinysynth has defaultly GM mapped timbre set, This function can overwrite with user-definable timbre.  
> `m=0` : timbre for normal channel.  
> `m=1` : timbre for rhythm channel (ch=9).  
> `n` : program number for normal channel or notenumber for rhythm channel.  
> `p` : timbre object. Source of this object can be created by soundedit.html **(Details are not yet documented)**

**reset()**
> Reset all channel to initial state. Including all controllers, program, chVol, pan and bendRange.

**send([midi-message], t)**
> midi-message is an array of midi data-bytes for one message. For example,  
> `send([0x90, 60, 100], t)` is for NoteOn ch=1 note#=60 velocity=100.  
> `t` is a timestamp that this message should be processed.  
> The timeline of `t` is depends on timestampmode that is set by setTsMode() function.
> If timestampmode == 0 (default), `t` is a time (sec) in timeline of the in use audioContext.currentTime.  If timestampmode == 1, `t` is a time (msec) in HighResolutionTime (performance.now()) timeline.  
> In both timestamp mode, this message will be immediately processed if `t`=0 or omitted.
> If timestampmode is omitted, the mode depends on `tsmode` in Attributes.

#### Channel Message Functions

Followings are voicing functions that controls each note directly. Each function is almost equivalent to corresponding `send([MIDI-message],t)` but prepared for human readability.  

In these functions, the `ch` parameter specify the MIDI channel. Each channel has individual timbre and set of control parameters, for example bend, modulation, expression, and so on. `ch` range is 0-15. (In MIDI spec., called 'channel 1-16')  
`ch`==9 is a special channel for rhythm. In this channel, each note number is assigned to individual percussive instruments according to GM drummap (Note number 35-81).

Almost function has the timestamp, `t` parameter. That specify accurate timing of the effect occur. Refer `send()` function for details of timestamp. Anyway the command is immediately processed if `t` is 0 or omitted.

**noteOn(ch, note, velo, t)**
> Generate a note in specified channel. `note` is the note number that specify pitch. `60` is middle 'C'. `velo` is velocity that control the volume of the note. velocity range is 0-127. this function is processed same as noteOff() if `velo` is `0`.

**noteOff(ch, note, t)**
> stop the note that is generated by noteOn(). One noteOff() (or equivalent noteOn with velo=0) should be called corresponding to one noteOn() call.

**setModulation(ch, val, t)**
> set modulation (vibrato) depth. `val` range is 0-127. +- 100 cent depth if val=127.

**setChVol(ch, val, t)**
> set volume of the channel. `val` range is 0-127. Default value is 100.

**setPan(ch, val, t)**
> Set pan of the channel. `val` range is 0-127. Default value=64.  
>  0:left  
> 64:center  
> 127:right.

**setExpression(ch, val, t)**
> Set expression level. `val` range is 0-127. Both Expression and ChVol are control the Channel volume, but Expression is mainly used as note's articulation.  

**setSustain(ch, val, t)**
> Set sustain pedal state. While sustain is on, generated notes in that channel are sustained even corresponding noteOff() is called. Note that `val` is judged as 'on' if `val>=64`. Usually use `0` and `127` as a value.

**setProgram(ch, pg)**
> Set timbre for that channel. `pg` range is 0-127 that is timbre number in GM map.

**setBend(ch, val, t)**
> Set pitch bend state. Notes in this channel are all affected to this pitch modification. `val` range is 0 to 16384 and the center with no bend is 8192. sensitivity is depends on `setBendRange()` setting. Default state is `8192`.

**setBendRange(ch, val)**
> Set bend sensitivity for that channel. `val` unit is 100/127 cent. That means +-1 octave if 0x600, +-1 semitone if 0x80.
 Default value is 0x100 that means +-200 cent (2 semitone) range.

**allSoundOff(ch)**
> Stop all sound of specified ch immediately. All notes initiated by noteOn() go to noteOff state.

**resetAllControllers(ch)**
> Control parameters of specified ch are reset. It includes Bend / Modulation / Expression / Sustain.

## MIDI implimentation chart

|                        |Recognized|Description                     |
|------------------------|----------|--------------------------------|
|**Basic Channel**       | Yes      | 1-16. ch10 = drum track        |
|**NoteOn / NoteOff**    | Yes      | note# 0-127 / velocity 0-127   |
|**Polyphonic Pressure** | No       |                                |
|**Control Change**      | Yes      | see bellow                     |
|**Program Change**      | Yes      | program 0-127                  |
|**Channel Pressure**    | No       |                                |
|**Pitch Bend**          | Yes      | -8192 - +8191                  |
|------------------------|----------|--------------------------------|
|**Control Number**      |          |                                |
|**1**                   | Yes      | Modulation                     |
|**6 / 38**              | Yes      | Data Entry                     |
|**7**                   | Yes      | Channel Volume                 |
|**10**                  | Yes      | Pan                            |
|**11**                  | Yes      | Expression                     |
|**64**                  | Yes      | Sustain                        |
|**100/101**             | Yes      | RPN Index                      |
|------------------------|----------|--------------------------------|
|**Channel Mode Message**|          |                                |
|**120**                 | Yes      | all sound off                  |
|**121**                 | Yes      | reset all controller           |
|**123**                 | Yes      | all note off                   |
|------------------------|----------|--------------------------------|
|**RPN**                 |          |                                |
|**0**                   | Yes      | Bend Range                     |
|**1**                   | Yes      | Channel Fine Tuning            |
|**2**                   | Yes      | Channel Coarse Tuning          |
|------------------------|----------|--------------------------------|
|**Universal SysEx**     |          |                                |
|**F0 F7 xx 04 03 lsb msb F7** | Yes | Master Fine Tuning            |
|**F0 F7 xx 04 04 00 msb F7** | Yes | Master Coarse Tuning           |
|------------------------|----------|--------------------------------|
|**GS Exclusive**        |          |                                |
|**F0 41 xx 42 12 40 00 05 xx xx xx xx sum F7** | Yes |Master Tuning |
|**F0 41 xx 42 12 40 00 05 xx sum F7** | Yes    |Master Transpose    |
|**F0 41 xx 42 12 40 1x 15 xx sum F7** | Yes    |Use For Rhythm Part |
|**F0 41 xx 42 12 40 1x 4x xx sum F7** | Yes    |Scale Tuning        |
|------------------------|----------|--------------------------------|

## Timbre Object Structure
As you can see that in source code, each timbre is represented as a object array. Fore example the program# 1 "Acoustic Grand Piano" is like this :

```
[{w:"sine",v:.4,d:0.7,r:0.1,},{w:"triangle",v:3,d:0.7,s:0.1,g:1,a:0.01,k:-1.2}]
```
Each element of the array means a oscillator and object member means :  
* g: output destination 0=final output / n=FM to specified osc
* w: waveform  
     "sine"/"sawtooth"/"square"/"triangle" (basic waveforms)  
     "w9999" (summing 1-4 harmonics)  
     "n0" (white noise)  
     "n1" (metalic noise)  
* v: volume  
* t: tune factor according to note#
* f: fixed frequency in Hz
* a: attack time
* h: hold time
* d: decay time
* s: sustain level
* r: release time  (5 params make AHDSR envelope)
* p: pitch bend
* q: pitch bend speed factor
* k: volume key tracking factor

You can test how these parameter work with 'Timbre Editor' panel in 'soundedit.html'.  And the created timbre can be used with `setTimbre()` function.

## License

Licensed under the Apache License, Version 2.0