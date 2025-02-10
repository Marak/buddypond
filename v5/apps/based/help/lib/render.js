export default async function render (helpWindow) {
    $(helpWindow.content).html(this.html);


    if (this.bp.apps.desktop && this.bp.apps.desktop.apps) {
        // for each registered app, add an option to the help-topics dropdown
        let helpTopics = $('.help-topics', helpWindow.content);
        let appKeys = Object.keys(this.bp.apps.desktop.apps);
        appKeys.push('help'); // some apps not from desktop registered shortcuts ( for now )
        // sort the apps by name
        appKeys.sort();
        //for (let app in this.bp.apps.desktop.apps) {
        appKeys.forEach(app => {
            // let appData = this.bp.apps.desktop.apps[app];
            //if (appData.help) {
                let option = $('<option>').attr('value', app).text(app);
                helpTopics.append(option);
            // }
        });
    }

}