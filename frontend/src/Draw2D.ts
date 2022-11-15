// x, y are position. w and h are width and height of the shape

export default class Draw2D {
	private readonly _context;
	private _font: string;
	private _text_size: number;

	constructor(context) {
		this._context = context;
		this._font = "monospace";
		this._text_size = 45;
	}

	public rect(x: number, y: number, w: number, h: number, scaling: number, color: string): void {
		this._context.fillStyle = color;
		this._context.fillRect(x * scaling, y * scaling, w * scaling, h * scaling);
	}

	public circle(x: number, y: number, r: number, scaling: number, color: string): void {
		this._context.fillStyle = color;
		this._context.beginPath();
		this._context.arc(x * scaling, y * scaling, r * scaling, 0, Math.PI * 2, false);
		this._context.closePath();
		this._context.fill();
	}

	public text(text: string, x: number, y: number, scaling: number, color: string): void {
		this._context.fillStyle = color;
		this._context.font = (this._text_size * scaling) + "px "+ this._font;
		this._context.fillText(text, x * scaling, y * scaling);
	}

	public image(img: HTMLElement, x: number, y: number, width: number, height: number, r: number, scaling: number): void {
		if (r == 0)
			this._context.drawImage(img, x * scaling, y * scaling, width, height);
		else
			this._context.drawImage(img, x * scaling, y * scaling, r * scaling, r * scaling);
	}

	set font(value: string) {
		this._font = value;
	}

	get text_size(): number {
		return this._text_size;
	}
}