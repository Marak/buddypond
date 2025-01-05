export default function dropareaEvent(e) {
    console.log('dropareaEvent:', e);
    e.preventDefault();
    e.stopPropagation();
    // console.log('drop', e.dataTransfer.files);
    let files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        console.log(file);
    }

    this.uploadOverlay.show(files);

}