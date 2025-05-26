import winston from "winston";
import path from "path";

const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5 // Ensure fatal is highest
    },
    colors: { 
        debug: "blue",
        http: "cyan",
        info: "green",
        warning: "yellow",
        error: "red",
        fatal: "bgRed white"
    }
};

winston.addColors(customLevels.colors);

// Define a custom level filter format
const levelFilter = (levelToFilter) => winston.format((info) => {
    const currentLevelValue = customLevels.levels[info.level];
    const filterLevelValue = customLevels.levels[levelToFilter];

    // If the current log's numeric level is less than the filter level's numeric value, return false (drop it)
    if (currentLevelValue < filterLevelValue) {
        return false;
    }
    return info; // Otherwise, pass the log info along
})();

export const createLogger = (env) => {
    console.log(`[LOGGER_DEBUG] createLogger called with environment: '${env}'`);
    const consoleLogLevel = env === 'dev' ? 'debug' : 'info';

    const loggerInstance = winston.createLogger({
        levels: customLevels.levels, 
        
        transports: [
            new winston.transports.Console({
                // The 'level' property here still works as a primary filter.
                // The custom levelFilter will ensure it's robust, but the 'level' property
                // is good practice as it's Winston's intended way.
                level: consoleLogLevel,
                format: winston.format.combine(
                    levelFilter(consoleLogLevel), // Apply custom filter for console
                    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                    winston.format.colorize({ all: true }), // Colorize after timestamp, before printf
                    // For console, simple() often works well with colorize for custom levels
                    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // Using printf for explicit control
                )
            }),
            new winston.transports.File({
                filename: path.join("ServerErrorLogs", "errors.log"),
                level: "error", // Set file level to 'error' to get 'error' and 'fatal'
                format: winston.format.combine(
                    levelFilter('error'), // Apply custom filter for file: only 'error' and 'fatal'
                    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                    winston.format.printf(info => {
                        const jsonLog = {
                            timestamp: info.timestamp,
                            level: info.level,
                            message: info.message
                        };
                        const { timestamp, level, message, ...rest } = info;
                        Object.assign(jsonLog, rest); // Add any other metadata
                        return JSON.stringify(jsonLog);
                    })
                ),
            })
        ]
    });

    // Explicitly attach methods for custom levels for robustness
    loggerInstance.debug = function(...args) { this.log('debug', ...args); };
    loggerInstance.http = function(...args) { this.log('http', ...args); };
    loggerInstance.info = function(...args) { this.log('info', ...args); };
    loggerInstance.warning = function(...args) { this.log('warning', ...args); };
    loggerInstance.error = function(...args) { this.log('error', ...args); };
    loggerInstance.fatal = function(...args) { this.log('fatal', ...args); };

    return loggerInstance;
}