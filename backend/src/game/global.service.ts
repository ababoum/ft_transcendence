export class Logger {
	private static write_log = true;

	public static write(msg) {
		if (this.write_log)
			console.log(msg);
	}
}