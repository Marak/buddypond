export default async function savePad() {
    // at this point we need to create the Pad in the API

    // check to see if pad with this name already exists
    let padTitle = $('#padTitle').val();
    let padKey = '/' + this.bp.me + '/' + padTitle;
    let padDescription = $('#padDescription').val();    
    // alert(padName)
    let thePad;
    console.log('sending padKey', padKey)
    try {
        thePad = await this.bp.apps.client.api.getPad(padKey);
        console.log("got back the pad", thePad);
    } catch (err) {
        console.error('error getting pad', err);
    }
    console.log('thePad', thePad);
    if (!thePad) {
        console.log('pad is available, creating pad');
        let padData = {
            pad_key: padTitle,
            title: padTitle,
            description: padDescription
        };
        let createdPad;
        try {
            createdPad = await this.bp.apps.client.api.createPad(padData);
            console.log('created pad', createdPad);
        } catch (err) {
            console.error('error creating pad', err);
        }
        return createdPad;
    } else {
        console.log('pad already exists, please choose a different name');
        throw new Error('Pad already exists');
        return;
    }

}