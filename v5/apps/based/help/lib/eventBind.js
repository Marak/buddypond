export default function eventBind (helpWindow){
    console.log('eventBind', helpWindow);

    // listen for window focus events
    // when a window focuses, attempt to load help content by context / typoe
    // TODO: add window::focus event..., WindowManager? probably ui app is smarter
    this.bp.on('window::open', 'update-help-context', async (data) => {

        // alert('window::open');
        // console.log('window::open', data);

        let appId = data.id; // window id ( for now )
        let type = data.type; // window type ( for now
        // alert(appId)
        // check if app has a help function
        if (this.bp.apps[appId] && this.bp.apps[appId].help) {
            // call the help function and set the content
            let helpText = await this.bp.apps[appId].help();

            $('.contextualHelpText', helpWindow.content).html(helpText);
            $('.help-context', helpWindow.content).html(appId);
            if (type !== 'singleton') {
                $('.help-type', helpWindow.content).html(type);     
            }
            console.log('helpText', helpText);
        } else {
            console.log('no help function found for app', appId);
        }

        // set the val of the help-topics dropdown to the appId
        $('.help-topics', helpWindow.content).val(appId);

    });

    // when the .help-topics selector changes, attempt to run the help() function for the selected app
    $('.help-topics', helpWindow.content).on('change', async (ev) => {
        let appId = $(ev.target).val();

        await this.bp.load(appId);

        let app = this.bp.apps[appId];
        console.log('app', app);
        // update the help context
        let iconSrc = this.bp.apps[appId].icon;
        console.log('iconSrc', iconSrc);


        if (!iconSrc) {
            iconSrc = `desktop/assets/images/icons/icon_${appId}_64.png`;
        }

        if (iconSrc) {
            $('.help-context', helpWindow.content).html(`<img src="${iconSrc}" class="icon" /> ${appId}`);
        } else {
            $('.help-context', helpWindow.content).html(appId);
        }


        $('.help-context', helpWindow.content).attr('data-app', appId);

        if (this.bp.apps[appId] && this.bp.apps[appId].help) {
            let helpText = await this.bp.apps[appId].help();
            $('.contextualHelpText', helpWindow.content).html(helpText);
            console.log('helpText', helpText);
        } else {
            console.log('no help function found for app', appId);
        }
    });

    $('.help-context', helpWindow.content).on('click', async (ev) => {
        // opens the app
        let appId = $(ev.target).closest('.help-context').attr('data-app');
        console.log(ev.target)
        console.log('appId', appId);
        this.bp.open(appId);
    });


}