class Profile {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/profile-user/profile-user.css');

        // fetches html from the fragment and returns it as a string
        this.html = await this.bp.load('/v5/apps/based/profile-user/profile-user.html');


        return 'loaded Profile';
    }

    async open(options = {}) {

        let buddyname = options.context || this.bp.me;
        buddyname = buddyname.replace(":", ""); // remove any colons for now
        buddyname = buddyname.replace(" ", ""); // remove any spaces for now
        let buddyProfile = await this.bp.apps.client.api.getProfile(buddyname);
        if (buddyname == this.bp.me) {
            buddyProfile.localState = this.bp.apps.buddylist.data.profileState;
        } 
        // Create main content div and setup for tabs
        let contentDiv = document.createElement('div');
        let tabList = document.createElement('ul');
        tabList.className = 'tab-list';
    
        let tabContentContainer = document.createElement('div');
        console.log('buddyProfile', buddyProfile);
        // Iterate over each profile field and create a tab and a corresponding textarea
        let profileKeys = Object.keys(buddyProfile);
        profileKeys.forEach((profileKey, index) => {
            let tab = document.createElement('li');
            let tabLink = document.createElement('a');
            tabLink.href = `#${profileKey}`;

            if (profileKey === 'buddyPad') {
                tabLink.textContent = 'Buddy Profile Pad';

            } else {
                tabLink.textContent = profileKey;

            }

            tab.appendChild(tabLink);
            tabList.appendChild(tab);
    
            let tabContent = document.createElement('div');
            tabContent.id = profileKey;
            tabContent.className = 'tab-content';
            if (index === 0) { tab.classList.add('active'); } // Make the first tab active by default

            if (profileKey === 'buddyPad') {
                // get the myprofile pad for this user and show it ( if not private )
                console.log('special iframe render here');
                let buddyPad = buddyProfile[profileKey];

                // create iframe and write source from buddyPad.content
                let iframe = document.createElement('iframe');
                iframe.style.width = '100%'; // Ensure textarea takes full width
                iframe.style.height = '400px'; // Set a fixed height for each textarea

                iframe.src = 'about:blank';
                iframe.onload = () => {
        
                        let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        iframeDoc.open();
                        iframeDoc.write(buddyPad.content); // Write the HTML content passed to the constructor
                        iframeDoc.close();
                        // isIFrameInitialized = true;
                    //this.setupMessageHandling(); // Setup message handling after loading content
                };
        
                tabContent.appendChild(iframe);

            } else {
                let textarea = document.createElement('textarea');
                textarea.className = 'profileEditor';
                textarea.style.width = '100%'; // Ensure textarea takes full width
                textarea.style.height = '400px'; // Set a fixed height for each textarea
                textarea.value = JSON.stringify(buddyProfile[profileKey], null, 2);
                tabContent.appendChild(textarea);

            }

            tabContentContainer.appendChild(tabContent);

        });

        contentDiv.appendChild(tabList);
        contentDiv.appendChild(tabContentContainer);
    
        // create a new element from the html string
        let profileContent = document.createElement('div');
        profileContent.innerHTML = this.html;


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
            new this.bp.apps.ui.Tabs('#' + this.profileWindow.id); // Initialize the tab functionality
        } else {
            // this.profileWindow.content.innerHTML = '';
            // If the window exists and the context has changed, re-render the content
            this.profileWindow.content = contentDiv;
            if (this.profileWindow.context !== buddyname) {
                this.profileWindow.context = buddyname;
                $(this.profileWindow.content).html(contentDiv.innerHTML);
                this.profileWindow.setTitle('Profile - ' + buddyname);
                new this.bp.apps.ui.Tabs('#' + this.profileWindow.id); // Re-initialize the tab functionality
                // this.profileWindow.render(); Uncomment if there's a render method to refresh the window
            }
        
        }
    
        // Focus on the newly created or updated window
        //this.bp.apps.ui.windowManager.openWindow(this.profileWindow);
        this.bp.apps.ui.windowManager.focusWindow(this.profileWindow);
    }
    

}

export { Profile as default };
