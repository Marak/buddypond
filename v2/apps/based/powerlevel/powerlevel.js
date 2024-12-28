import PowerlevelPopup from './PowerlevelPopup.js';
export default class PowerLevels {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
    }

    async init() {
        /*
        this.bp.on('powerlevel', 'powerlevel', (powerlevel) => {
            this.bp.log('powerlevel', powerlevel);
        });
        e
        */
        await this.bp.load('/v2/apps/based/powerlevel/powerlevel.css');
        this.bp.apps.buddyscript.addCommand('powerlevel', (args) => {
            console.log('powerlevel args', args);
            let context = args[0];
            let _powerlevel = Number(args[1]); // TODO: check is number not nan
            this.bp.apps.client.api.setPowerLevel(context, _powerlevel);

        });

        this.popup = new PowerlevelPopup();

    }

    setPower(context, powerlevel) {
        // will call the server and set the power level
        this.bp.log('setPowerLevel', powerlevel);
        this.bp.emit('powerlevel', powerlevel);
    }

    getPower(context) {
        // will get the current power level from the server
        // should be attached the userProfile actually
        // so maybe not really needed?..hrmm
        return this.bp.get('powerlevel');
    }

}