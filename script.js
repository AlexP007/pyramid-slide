const DC = '[data-component='

class PyramidSlider {
	constructor({elem, onchange}) {
		this._pyramid = elem;

		this._parts = {
			select: this._pyramid.querySelector(DC+'select]'),
			slider: this._pyramid.querySelector(DC+'slider]'),
			height: this._pyramid.querySelector(DC+'height]'),
			screen: this._pyramid.querySelector(DC+'screen]')
		};

		this.onchange = onchange;
		this._slider = new Slider({
			elem: this._parts.slider,
			max: 14,
		})
		setListener(this, this._pyramid, 'change', this.onchange);
	}

}

class Slider {
	constructor({elem, max}){
		this._elem = elem;
		this._thumb = this._elem.querySelector('.thumb');
		this.coords = this._elem.getBoundingClientRect();
		this._max = max;
		this.denominator = Math.round((this._elem.offsetWidth-this._thumb.offsetWidth)/this._max);

		this._thumb.addEventListener('mousedown',this.startSliding.bind(this))

		this._thumb.ondragstart = function(){return false};


	}
	startSliding(e){

		if(e.target != this._thumb) return;	

		this.shiftX = e.pageX - this._thumb.getBoundingClientRect().left;
		let moveSlider = this.moveSlider.bind(this);

		addEventListener('mousemove',moveSlider);

		addEventListener('mouseup', function remover() {
			removeEventListener('mousemove', moveSlider);
			removeEventListener('mouseup', remover);

		}.bind(this));
	}

	moveSlider(e){

		let style = this._thumb.style;
		let left = e.pageX - this.shiftX - this.coords.left;
		if(left <= 0) left = 0;

		let right = this._elem.offsetWidth - this._thumb.offsetWidth;

		if(left >= right ) left = right;

		style.left = left + 'px';
		this.now = Math.round(left/this.denominator);

		sendEvent.call(this, 'change', this.now);


	}
}

function sendEvent(name, detail){
		let event = new CustomEvent(name, {
			bubbles: true,
			detail,
		})
		this._elem.dispatchEvent(event);
	}
function setListener(context, elem, event, foo) {
	elem.addEventListener(event, foo.bind(context));
}



