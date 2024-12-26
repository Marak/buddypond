export default class ChatWindowButtonBar {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;

        this.buttons = options.buttons || [/*{
            text: 'BuddySound',
            onclick: () => console.log('Send button clicked')
        },
        {
            text: 'BuddyGif',
            onclick: () => console.log('Close button clicked')
        },
        {
            text: 'BuddyPaint',
            onclick: () => console.log('Close button clicked')
        },
        {
            text: 'BuddySnap',
            onclick: () => console.log('Close button clicked')
        },
        {
            text: 'BuddyEmoji',
            onclick: () => console.log('Close button clicked')
        },
        {
            text: 'BuddyHelp',
            align: 'right',
            onclick: () => console.log('Close button clicked')
        }
        */
        ];
        this.container = this.render();
        return this;

    }

    render() {
        let buttonBar = document.createElement('div');
        buttonBar.classList.add('button-bar');

        this.buttons.forEach(button => {


            if (button.image) {
                let imgElement = document.createElement('img');
                imgElement.src = button.image;
                imgElement.title = button.text;
                imgElement.dataset.context = this.options.context || button.text;
                imgElement.dataset.type = this.options.type || 'buddy';
                imgElement.alt = button.text;
                imgElement.classList.add('button-bar-button');
                if (button.className) {
                    imgElement.classList.add(button.className);
                }
                imgElement.onclick = button.onclick;
                buttonBar.appendChild(imgElement);



            } else {
                let buttonElement = document.createElement('button');
                buttonElement.innerText = button.text;
                buttonElement.dataset.context = this.options.context || button.text;
                buttonElement.dataset.type = this.options.type || 'buddy';
                buttonElement.classList.add('button-bar-button');
                if (button.className) {
                    buttonElement.classList.add(button.className);
                }
                buttonElement.onclick = button.onclick;
                buttonBar.appendChild(buttonElement);
    
            }


            

        });

        return buttonBar;
    }

}