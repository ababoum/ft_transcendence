// x, y are position. w and h are width and height of the shape
export default class Draw2D {
	private readonly _context;
	private _font: string;
	private _text_size: string;

	constructor(context) {
		this._context = context;
		this._font = "fantasy";
		this._text_size = "45";
	}

	public rect(x: number, y: number, w: number, h: number, color: string): void {
		this._context.fillStyle = color;
		this._context.fillRect(x, y, w, h);
	}

	public circle(x: number, y: number, r: number, color: string): void {
		this._context.fillStyle = color;
		this._context.beginPath();
		this._context.arc(x, y, r, 0, Math.PI * 2, false);
		this._context.closePath();
		this._context.fill();
	}

	public text(text: string, x: number, y: number, color: string): void {
		this._context.fillStyle = color;
		this._context.font = this._text_size + "px "+ this._font;
		this._context.fillText(text, x, y);
	}

	set font(value: string) {
		this._font = value;
	}

	set text_size(value: string) {
		this._text_size = value;
	}
}