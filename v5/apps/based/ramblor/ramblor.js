import RamblorClass from './RamblorClass.js';

export default class Ramblor {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.ramblor = new RamblorClass();
        return this;
    }

    async init() {
        this.bp.log('Hello from Ramblor');

        // Load HTML fragment
        this.html = await this.bp.load('/v5/apps/based/ramblor/ramblor.html');

        await this.bp.appendCSS('/v5/apps/based/ramblor/ramblor.css');

      

        return 'loaded Ramblor';
    }

    async open(options = {}) {

          if (!this.ramblorWindow) {
            // Create window
            this.ramblorWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'ramblow',
                title: 'Ramblor',
                x: 50,
                y: 100,
                width: 400,
                height: 460,
                parent: $('#desktop')[0],
                onClose: () => {
                    this.ramblorWindow = null; // Clear reference on close
                },
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false
            });

            // Get DOM elements
            const $window = $(this.ramblorWindow.content);
            const $form = $window.find('.ramblor-verify-form');
            const $resultText = $window.find('.ramblor-result-text');

            // Handle form submission
            $form.on('submit', (e) => {
                e.preventDefault();
                const rollData = {
                    generation: parseInt($form.find('#ramblor-gen').val(), 10),
                    min: parseInt($form.find('#ramblor-min').val(), 10),
                    max: parseInt($form.find('#ramblor-max').val(), 10),
                    value: parseInt($form.find('#ramblor-value').val(), 10),
                    userSeeds: JSON.parse($form.find('#ramblor-user-seeds').val() || '[]'),
                    systemSeed: parseInt($form.find('#ramblor-system-seed').val(), 10)
                };

                const isValid = this.ramblor.prove(rollData);
                $resultText.text(isValid ? 'Roll is valid!' : 'Roll is invalid.').css('color', isValid ? '#20C997' : '#DC3545');
            });

            // add event that if any inputs change, reroll the verification
            $form.find('input').on('input', () => {
                const rollData = {
                    generation: parseInt($form.find('#ramblor-gen').val(), 10),
                    min: parseInt($form.find('#ramblor-min').val(), 10),
                    max: parseInt($form.find('#ramblor-max').val(), 10),
                    value: parseInt($form.find('#ramblor-value').val(), 10),
                    userSeeds: JSON.parse($form.find('#ramblor-user-seeds').val() || '[]'),
                    systemSeed: parseInt($form.find('#ramblor-system-seed').val(), 10)
                };
                console.log('proving rollData:', rollData);
                const isValid = this.ramblor.prove(rollData);
                $resultText.text(isValid ? 'Roll is valid!' : 'Roll is invalid.').css('color', isValid ? '#20C997' : '#DC3545');
            });
        }

        const $window = $(this.ramblorWindow.content);
        const $form = $window.find('.ramblor-verify-form');
        const $resultText = $window.find('.ramblor-result-text');
        console.log('Opening Ramblor with options:', options);
        // Pre-fill form if roll data is provided
        const roll = options.roll || {};
        console.log('Roll data:', roll);
        if (roll.generation) {
            $window.find('#ramblor-gen').val(roll.generation);
            $window.find('#ramblor-min').val(roll.min);
            $window.find('#ramblor-max').val(roll.max);
            $window.find('#ramblor-value').val(roll.value);
            $window.find('#ramblor-user-seeds').val(JSON.stringify(roll.userSeeds || []));
            $window.find('#ramblor-system-seed').val(roll.systemSeed);

            // Auto-run verification
            const isValid = this.ramblor.prove(roll);
            $resultText.text(isValid ? 'Roll is valid!' : 'Roll is invalid.').css('color', isValid ? '#20C997' : '#DC3545');
        }
        return this.ramblorWindow;

    }


}

let ramblorEndpoint = 'https://ramblor.buddypond.com/api/v6/';
ramblorEndpoint = 'https://localhost:8888/api/v6';
/* TODO: we have a separate rolling service that exists at ramblor.buddypond.com
         currently not being used as the messages services directly calls the RamblorClass
this.bp.apps.client.api.roll = async (max = 6) => {
    // match api request to ramblor.buddypond.com/api/v6/roll
    let response = await fetch(`${ramblorEndpoint}roll?max=` + max, {
        method: 'POST',
        headers: { 
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ from: 'Ramblor', to: 'Marak', type: 'buddy' })   
    });
    console.log('response:', response);
}
*/
