import winston from "winston";
import path from "path";

// Ensure logs directory exists
const logDirectory = path.join(process.cwd(), "logs");

// Create a custom logger
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json(),
	),
	defaultMeta: { service: "user-service" },
	transports: [
		// Write all logs with importance level of `error` or less to `error.log`
		new winston.transports.File({
			filename: path.join(logDirectory, "error.log"),
			level: "error",
		}),
		// Write all logs with importance level of `info` or less to `combined.log`
		new winston.transports.File({
			filename: path.join(logDirectory, "combined.log"),
		}),
	],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	);
}

export default logger;
