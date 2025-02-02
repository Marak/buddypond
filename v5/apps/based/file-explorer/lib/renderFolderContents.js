export default function renderFolderContents(files) {

        $('.bp-file-explorer-header').flexShow();

        // clear the bp-file-explorer-files div
        let filesContainer = $('.bp-file-explorer-files', this.container);
        filesContainer.html('');

        // iterate over the files and add them to the bp-file-explorer-files div
        for (let file of files) {
            // create using JS DOM API not string
            let item = document.createElement('div');
            item.classList.add('bp-file-explorer-item');
            item.dataset.type = file.type;
            item.dataset.name = file.name;
            item.dataset.size = file.size;
            item.dataset.date = file.date;
            item.dataset.path = file.path;
            // console.log('file', file);
            let columns = ['name', 'size', 'type', 'date'];
            for (let column of columns) {
                let columnDiv = document.createElement('div');
                columnDiv.classList.add('bp-file-explorer-column');
                let val = file[column];
                if (column === 'size') {
                    val = this.bytes(file[column]);
                }
                if (column === 'date') {
                    val = new Date(file[column]).toLocaleString();
                    // check if val is valid date, if not revert to original value
                    if (val === 'Invalid Date') {
                        val = file[column];
                    }
                }

                columnDiv.textContent = val;
                item.appendChild(columnDiv);
            }




            filesContainer.append(item);
        }

        $('.bp-file-explorer-file-viewer-iframe', this.content).hide();
        $('.bp-file-explorer-file-viewer-editor', this.content).hide();
        $('.bp-file-explorer-files', this.content).show();

    }
