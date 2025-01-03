export default function applyData(el, data) {
    let fileUrl = this.bp.config.api + data.fileURL;
    console.log("el", el, data)
    // Assuming data has properties like `name`, `fileURL`, and `size`
    $(el).find('.card-title').text(data.name);
    $(el).find('.file-size').text(`Size: ${data.size} bytes`);
    $(el).find('.file-link').attr('href', fileUrl);
}
