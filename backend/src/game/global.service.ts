export class Logger {
	/* TO DEACTIVATE DEBUG MESSAGES*/
	private static write_log = false;

	public static write(msg) {
		if (this.write_log)
			console.log(msg);
	}
}