export default function renderPadRows(myPads) {
    if (myPads && myPads.length > 0) {
        // .bp-pad-table , add the tr rows
        let table = $('.bp-pad-table', this.padWindow.content);

        // clear the table
        table.empty();

        myPads.forEach((pad) => {
            // console.log('pad', pad);
            let tr = document.createElement('tr');

            // set data-title attribute on tr
            tr.setAttribute('data-title', pad.title);

            // title
            let td = document.createElement('td');
            td.innerHTML = pad.title;
            td.style.fontWeight = 'bold';
            td.style.minWidth = '100px';
            tr.appendChild(td);

            // description
            td = document.createElement('td');

            let padUrl = '/' + pad.owner + '/pads/' + pad.title;
            let padLink = `<a href="${padUrl}" target="_blank">${padUrl}</a>`;
            td.innerHTML = padLink;

            tr.appendChild(td);

            // 
            /* Pad visibility is disabled until we implement role logic to bp-files-proxy
            // The previous API utilized database for fetching pad content, now pad content is proxied through bp-files-proxy to CDN
            td = document.createElement('td');
            // create a drop-down select
            let select = document.createElement('select');
            select.name = 'visibility';
            // add options
            let options = ['Public', 'Private', 'Unlisted'];
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
            tr.appendChild(td);
            */


            // actions ( edit, delete, view )
            td = document.createElement('td');
            td.style.textAlign = 'right';
            let editButton = document.createElement('button');
            editButton.classList.add('edit-button', 'ui-button');
            editButton.innerHTML = 'Edit';
            editButton.onclick = () => {
                // console.log('edit', pad);
            }
            td.appendChild(editButton);

            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.classList.add('delete-button', 'ui-button');

            td.appendChild(deleteButton);

            let viewButton = document.createElement('button');
            viewButton.innerHTML = 'View';
            viewButton.classList.add('view-button', 'ui-button');

            td.appendChild(viewButton);
            tr.appendChild(td);

            // TODO: move event handler to separate function / file
            tr.addEventListener('click', async (e) => {
                let action;
                if (e.target.type === 'submit') {
                    action = e.target.innerHTML;
                }
                // alert('clicked ' + action);

                let closestTr = $(e.target).closest('tr');
                let title = closestTr.attr('data-title');
                let padUrl = '/' + pad.owner + '/pads/' + pad.title;
                let padKey = '/' + pad.owner + '/' + pad.title;
                let relativePath = 'pads/' + pad.title;

                if (action === 'View') {
                    // console.log('open pad in new window', pad, title);
                    // open a new window browser window
                    // TODO: open a new browser window with options ( show url bar, but notinng else )
                    let win = window.open(padUrl, '_blank');
                }

                if (action === 'Delete') {
                    // confirm delete then call api

                    let yesOrNo = confirm('Are you sure you want to delete ' + title + '?');

                    if (yesOrNo) {
                        // console.log('delete pad', pad, title, padKey);

                        // disable all buttons
                        $('.ui-button', closestTr).prop('disabled', true);
                        // add disabled class to button
                        $('.ui-button', closestTr).addClass('disabled');
                        try {
                            await this.bp.apps.client.api.deletePad(padKey);

                        } catch (err) {
                            console.log('error deleting pad', err);
                        }

                        try {

                            await this.bp.apps.client.api.removeFile(relativePath);
                        } catch (err) {
                            console.log('error deleting pad file', err);

                        }

                        // remove the row from the table
                        closestTr.remove();

                    }

                    // we need to re-render the table
                    this.open();

                }

                if (action === 'Edit') {
                    // open edit window with the pad data
                    // console.log('edit pad', pad, title);
                    this.bp.open('file-explorer', { context: '/' + relativePath + '/index.html' });
                    // set focus
                    this.bp.apps.ui.windowManager.focusWindow('file-explorer');
                }


            });

            table.append(tr);
        });



    } else {
        // no pads yet
        $('.bp-pad-container', this.padWindow.content).flexHide();
    }
};