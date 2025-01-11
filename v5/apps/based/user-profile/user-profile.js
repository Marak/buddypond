export default class Profile {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        //await this.bp.load('/v5/apps/based/profile-user/profile-user.css');

        // fetches html from the fragment and returns it as a string
        //this.html = await this.bp.load('/v5/apps/based/profile-user/profile-user.html');


        return 'loaded Profile';
    }

    async open(options = {}) {

        let buddyname = options.context || this.bp.me;
        buddyname = buddyname.replace(":", ""); // remove any colons for now
        buddyname = buddyname.replace(" ", ""); // remove any spaces for now

     

        // create a new element from the html string
        let profileContent = document.createElement('div');
        profileContent.classList.add('profileContent');
        profileContent.style.width = '100%';
        profileContent.style.height = '100%';
        // profileContent.innerHTML = this.html;

        // url profile for user
        let buddyHomeURL = this.bp.config.host + '/' + buddyname;
        // create a new iframe
        let iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = buddyHomeURL;

        let contentDiv = document.createElement('div');
        contentDiv.classList.add('customProfile');
        contentDiv.style.width = '100%';
        contentDiv.style.height = '100%';

        
        contentDiv.append(iframe);

        profileContent.append(contentDiv);


        // Initialize tabs
        if (!this.profileWindow) {
            this.profileWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'profile-user',
                title: 'Profile - ' + buddyname,
                x: 50,
                y: 100,
                width: 700,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                context: buddyname || 'default',
                content: profileContent,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.profileWindow = null;
                }
            });
        } else {
            // If the window exists and the context has changed, re-render the content
            this.profileWindow.content = contentDiv;
            if (this.profileWindow.context !== buddyname) {
                this.profileWindow.context = buddyname;
                // $(this.profileWindow.content).html(contentDiv.innerHTML);
                this.profileWindow.setTitle('Profile - ' + buddyname);
            }
        
        }
    
        // Focus on the newly created or updated window
        this.bp.apps.ui.windowManager.focusWindow(this.profileWindow);
    }
    

}
