export default class Pad {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Pad');

        let html = await this.bp.load('/v5/apps/based/pad/pad.html');
        let css = await this.bp.load('/v5/apps/based/pad/pad.css');

        this.html = html;

        return 'loaded Pad';
    }

    async open() {

        if (!this.padWindow) {
            this.padWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'example',
                title: 'Pads',
                x: 50,
                y: 100,
                width: 800,
                height: 500,
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
                minimized: false
            });

        }

        let myPads = await this.bp.apps.client.api.getPads();

        if (myPads && myPads.length > 0) {
            // .bp-pad-table , add the tr rows
            let table = $('.bp-pad-table', this.padWindow.content);
            myPads.forEach((pad) => {
                console.log('pad', pad);
                let tr = document.createElement('tr');

                // set data-title attribute on tr
                tr.setAttribute('data-title', pad.title);

                // title
                let td = document.createElement('td');
                td.innerHTML = pad.title;
                tr.appendChild(td);

                // description
                td = document.createElement('td');
                td.innerHTML = pad.description;
                tr.appendChild(td);

                // visibility
                td = document.createElement('td');
                // create a drop-down select
                let select = document.createElement('select');
                select.name = 'visibility';
                // add options
                let options = ['Public', 'Private' /* TODO: , 'Unlisted' */];
                options.forEach((option) => {
                    let optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.innerHTML = option;
                    console.log("comparing", option, pad.visibility);
                    if (option.toLowerCase() === pad.visibility) {
                        optionElement.selected = true;
                    }
                    select.appendChild(optionElement);
                });
                select.onchange = async (e) => {
                    console.log('visibility changed', e.target.value, pad);
                    pad.visibility = e.target.value.toLowerCase();
                    let profilePadKey = '/' + this.bp.me + '/' + pad.title;

                    await this.bp.apps.client.api.updatePad(profilePadKey, pad);
                };
                td.appendChild(select);

                //td.innerHTML = pad.visibility;
                tr.appendChild(td);

                // actions ( edit, delete, view )
                td = document.createElement('td');
                let editButton = document.createElement('button');
                editButton.classList.add('edit-button');
                editButton.innerHTML = 'Edit';
                editButton.disabled = true;
                editButton.classList.add('disabled');
                editButton.onclick = () => {
                    console.log('edit', pad);
                }
                td.appendChild(editButton);

                let deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.onclick = () => {
                    console.log('delete', pad);
                }

                td.appendChild(deleteButton);

                let viewButton = document.createElement('button');
                viewButton.innerHTML = 'View';
                viewButton.classList.add('view-button');
                viewButton.onclick = () => {
                    console.log('view', pad);
                }

                td.appendChild(viewButton);
                tr.appendChild(td);

                tr.addEventListener('click', async (e) => {
                    let action;
                    if (e.target.type === 'submit') {
                        action = e.target.innerHTML;
                    }
                    // alert('clicked ' + action);

                    let closestTr = $(e.target).closest('tr');
                    let title = closestTr.attr('data-title');
                    let padUrl = '/' + pad.ownerId + '/' + pad.title;

                    if (action === 'View') {
                        console.log('open pad in new window', pad, title);
                        // open a new window browser window
                        // TODO: open a new browser window with options ( show url bar, but notinng else )
                        let win = window.open(padUrl, '_blank');
                    }

                    if (action === 'Delete') {
                        // confirm delete then call api

                        let yesOrNo = confirm('Are you sure you want to delete ' + title + '?');

                        if (yesOrNo) {
                            console.log('delete pad', pad, title, padUrl);
                            await this.bp.apps.client.api.deletePad(padUrl);
                        }

                        // we need to re-render the table
                        this.open();

                    }

                    if (action === 'Edit') {
                        // open edit window with the pad data
                        console.log('edit pad', pad, title);
                        this.editPad(pad);
                    }


                });

                table.append(tr);
            });



        } else {
            // no pads yet
            $('.bp-pad-container', this.padWindow.content).flexHide();
        }

        new this.bp.apps.ui.Tabs('.tabs-container', this.padWindow.content);


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

    }

    editPad(pad) {
        $('.tab-content', this.padWindow.content).flexHide();
        $('.pad-code-editor', this.padWindow.content).flexShow();
    }

}