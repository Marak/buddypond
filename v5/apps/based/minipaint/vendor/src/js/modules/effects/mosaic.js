import app from './../../app.js';
import config from './../../config.js';
import Dialog_class from './../../libs/popup.js';
import Base_layers_class from './../../core/base-layers.js';
import ImageFilters from './../../libs/imagefilters.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

class Effects_mosaic_class {

	constructor() {
		this.POP = new Dialog_class();
		this.Base_layers = new Base_layers_class();
	}

	mosaic() {
		var _this = this;

		if (config.layer.type != 'image') {
			alertify.error('This layer must contain an image. Please convert it to raster to apply this tool.');
			return;
		}

		var settings = {
			title: 'Mosaic',
			preview: true,
			effects: true,
			params: [
				{name: "size", title: "Size:", value: 10, range: [1, 100]},
			],
			on_change: function (params, canvas_preview, w, h) {
				var img = canvas_preview.getImageData(0, 0, w, h);
				var data = _this.change(img, params);
				canvas_preview.putImageData(data, 0, 0);
			},
			on_finish: function (params) {
				_this.save(params);
			},
		};
		this.POP.show(settings);
	}

	save(params) {
		//get canvas from layer
		var canvas = this.Base_layers.convert_layer_to_canvas(null, true);
		var ctx = canvas.getContext("2d");

		//change data
		var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = this.change(img, params);
		ctx.putImageData(data, 0, 0);

		//save
		return app.State.do_action(
			new app.Actions.Update_layer_image_action(canvas)
		);
	}

	change(data, params) {
		var size = parseFloat(params.size);

		//convert % to px
		size = Math.min(data.width, data.height) * size / 100;
		size = Math.round(size);

		var filtered = ImageFilters.Mosaic(data, size);

		return filtered;
	}

	demo(canvas_id, canvas_thumb){
		var canvas = document.getElementById(canvas_id);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(canvas_thumb, 0, 0);

		//now update
		var img = ctx.getImageData(0, 0, canvas_thumb.width, canvas_thumb.height);
		var params = {
			size: 10,
		}
		var data = this.change(img, params);
		ctx.putImageData(data, 0, 0);
	}

}

export default Effects_mosaic_class;