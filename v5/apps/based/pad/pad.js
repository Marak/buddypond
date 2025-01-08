import renderPadRows from './lib/renderPadRows.js';
import savePad from './lib/savePad.js';
import buildPad from './lib/buildPad.js';

export default class Pad {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Pad');

        let html = await this.bp.load('/v5/apps/based/pad/pad.html');
        let css = await this.bp.load('/v5/apps/based/pad/pad.css');

        let slugify = await this.bp.importModule('/v5/apps/based/pad/vendor/slugify.min.js', {}, false);
        this.slugify = slugify.slugifyDefault;

        this.html = html;

        return 'loaded Pad';
    }

    async open() {

        if (!this.padWindow) {
            this.padWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'example',
                title: 'Pads',
                x: 50,
                y: 60,
                width: 1000,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.padWindow = null;
                }
            });

            this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', this.padWindow.content);


        }

        // TODO: refactor this to separate function
        let myPads = await this.bp.apps.client.api.getPads();
        this.renderPadRows(myPads);


        // show the first .tab-content
        //$('.tab-content').show();
        $('.tab-content:first', this.padWindow.content).show();

        console.log(myPads);
        if (this.bp.me && this.bp.me !== 'Guest') {
            $('.loggedOut', this.padWindow.content).flexHide();
            $('.loggedIn', this.padWindow.content).flexShow();


        } else {
            $('.loggedOut', this.padWindow.content).flexShow();
            $('.loggedIn', this.padWindow.content).flexHide();

        }

        let userFilesCDN = 'https://files.buddypond.com' + '/' + this.bp.me;
        let userFilesHome = this.bp.config.host + '/' + this.bp.me;

        $('.userFilesHome', this.padWindow.content).html(userFilesHome);
        $('.userFilesHome', this.padWindow.content).attr('href', userFilesHome);

        $('.userFilesCDN', this.padWindow.content).html(userFilesCDN);
        $('.userFilesCDN', this.padWindow.content).attr('href', userFilesCDN);

        let that = this;
        // Function to update slug and URL preview
        function updateSlug(value) {

            // Remark, TODO: figure out why "-" was not working? Would be nice to have "-" in urls?
            const slugOptions = {
                lower: true,
                replacement: '-',
                remove: /[^A-Za-z0-9_\-]/g,
                strict: false
            };

            // First replace spaces with hyphens in your input
            let preSlug = value.replace(/\s+/g, '-');

            // Replace any hypens with underscores
            preSlug = preSlug.replace(/-+/g, '_');

            let slug = that.slugify(preSlug, slugOptions);
            //let slug = slugify(value);

            $('.padTitle', that.padWindow.content).val(slug);
            $('.padUrl', that.padWindow.content).val(`${userFilesCDN}/pads/${slug}`);
        }

        // Debounce function to limit how often a function can fire
        const debounce = (func, delay) => {
            let debounceTimer;
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(context, args), delay);
            };
        };

        // Event listener for title input
        $('.padTitle', this.padWindow.content).on('input', debounce(function (e) {
            $(this).removeClass('error');

            console.log('Input changed:', e.target.value);
            updateSlug(e.target.value);
        }, 250)); // Adjust debounce time as needed

        // Optional: Display slugification in action (UX feedback)
        $('.padTitle', this.padWindow.content).on('input', () => {
            // Optionally, show some kind of indicator that slug is being generated
            $('.status-indicator', this.padWindow.content).addClass('active').text('Generating URL...');
        }).on('input', debounce(() => {
            $('.status-indicator', this.padWindow.content).removeClass('active').text(''); // Clear indicator when done
            // update url
            $('.padUrl', this.padWindow.content).val(`${userFilesHome}/pads/${that.slugify($('.padTitle', that.padWindow.content).val())}`);
        }, 250));


        $('.bp-pad-form', this.padWindow.content).on('submit', async (e) => {
            e.preventDefault();
            console.log(`Save pad button clicked`);


            // check that     let padTitle = $('#padTitle').val() is not empty
            let padTitle = $('.padTitle', this.padWindow.content).val();
            if (!padTitle) {
                $('.padTitle', this.padWindow.content).addClass('error').attr('placeholder', 'Please enter a name...');
                return;
            }

            // disable the save-pad-button to prevent double clicks
            $('.save-pad-button', this.padWindow.content).prop('disabled', true);
            // add disabled class to button
            $('.save-pad-button', this.padWindow.content).addClass('disabled');

            let padSaved = false;
            let padError;
            let newPad;

            try {
                newPad = await this.savePad();
                padSaved = true;
            } catch (err) {
                console.error(err);
                padError = err;
            }

            if (padSaved) {
                console.log('the new pad is ', newPad)

                try {
                    await this.buildPad(newPad.title);

                } catch (err) {
                    alert(`Error building pad: ${err.message}`);
                    return;
                }
                
                // if not success, show the error

                // now that the pad is created we will need to upload files
                // show the #pads-upload-files div, which will move user to file-explorer
                $('#pads-upload-files', this.padWindow.content).show();
                $('#pads-editor', this.padWindow.content).flexHide();

                // Reloads the My Pads list
                console.log('getting the pads again');
                let myPads = await this.bp.apps.client.api.getPads();
                console.log('got the pads again', myPads);
                this.renderPadRows(myPads);
                // set the .bp-pad-container to visible
                $('.bp-pad-container', this.padWindow.content).flexShow();

                let padTitle = $('#padTitle').val();

                $('.openPadButton', this.padWindow.content).attr('data-context', `/pads/${padTitle}/index.html`);
                //alert('set')


            } else {
                console.log('Pad not saved', padError);
                if (padError.message === 'Pad already exists') {
                    // highlight the title input
                    $('.padTitle', this.padWindow.content).addClass('error');
                    $('.status-indicator', this.padWindow.content).addClass('error').text('Pad already exists');
                }
            }

            return false;

        });

        $('.create-pad-button', this.padWindow.content).on('click', () => {
            this.tabs.navigateToTab('#pads-editor');
        });
        
    }

    editPad(pad) {
        $('.tab-content', this.padWindow.content).flexHide();
        $('.pad-code-editor', this.padWindow.content).flexShow();
    }

}

Pad.prototype.renderPadRows = renderPadRows;
Pad.prototype.savePad = savePad;
Pad.prototype.buildPad = buildPad;