const DC = '[data-component='

class PyramidSlider {
	constructor({elem, onchange}) {
		this._elem = elem;

		this._parts = {
			select: this._elem.querySelector(DC+'select]'),
			slider: this._elem.querySelector(DC+'slider]'),
			height: this._elem.querySelector(DC+'height]'),
			screen: this._elem.querySelector(DC+'screen]')
		};

		this.onchange = onchange;
		this.height = null;

		//initializing slider
		this._slider = new Slider({
			elem: this._parts.slider,
			max: 14,
		})

		// handlers on changing slider value
		setListener(this, this._elem, 'pyramid', this.onchange);

		// setting slider value
		this._slider.setValue(7);

		//initializing select
		this._select = new Select({
			elem: this._parts.select,
			onchange(e){
				let brick = [...e.target.options].filter( elt => {
					return elt.selected
				})[0].value;
				
				// sending event
				sendEvent.call(this,'pyramid', {brick});
			}
		})

	}
	pyramidDraw(){
		let height = +this.height;
		let brick = this.brick;
		let pyramid = '';

		for(let i = 1; i<= height; i++){
			pyramid +='&nbsp'.repeat(height-i) + brick.repeat(i) +'<br>'; 
		}
		return pyramid;
	}

}

class Slider {
	constructor({elem, max}){
		this._elem = elem;
		this._thumb = this._elem.querySelector('.thumb');
		this.coords = this._elem.getBoundingClientRect();
		this._max = max;
		this.denominator = Math.round((this._elem.offsetWidth-this._thumb.offsetWidth)/this._max);

		this._thumb.addEventListener('mousedown',this.startSliding.bind(this));
		// for mobiles
		this._thumb.addEventListener('touchstart',this.startSliding.bind(this));

		this._thumb.ondragstart = function(){return false};
	}
	startSliding(e){

		if(e.target != this._thumb) return;

		let pageX = e.pageX || e.touches[0].pageX;	

		this.shiftX = pageX - this._thumb.getBoundingClientRect().left;
		let moveSlider = this.moveSlider.bind(this);

		addEventListener('mousemove',moveSlider);

		// for mobiles
		addEventListener('touchmove',moveSlider);

		addEventListener('mouseup', function remover() {
			removeEventListener('mousemove', moveSlider);
			removeEventListener('mouseup', remover);

		}.bind(this));
		//for mobiles
		addEventListener('touchend', function remover() {
			removeEventListener('touchmove', moveSlider);
			removeEventListener('touchend', remover);

		}.bind(this));
	}
	moveSlider(e){
		let pageX = e.pageX || e.touches[0].pageX;
		let style = this._thumb.style;
		let left = pageX  - this.shiftX - this.coords.left;
		if(left <= 0) left = 0;

		console.log(pageX);

		let right = this._elem.offsetWidth - this._thumb.offsetWidth;

		if(left >= right ) left = right;

		style.left = left + 'px';

		this.now = Math.round(left/this.denominator);

		sendEvent.call(this, 'pyramid',{height:String(this.now)});

	}
	setValue(value){
		this._thumb.style.left = this.denominator * value +'px';
		sendEvent.call(this, 'pyramid', {height:parseInt(this._thumb.style.left)/this.denominator});
	}
}
class Select {
	constructor({elem, onchange}){
		this._elem = elem;
		this.onchange = onchange;
		// handlers on changing Brick Symbol value
		setListener(this, this._elem, 'change', this.onchange); 
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



