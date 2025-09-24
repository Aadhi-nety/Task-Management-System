import winston from 'winston';

/**
 * Logger configuration
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'task-management-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

/**
 * If we're not in production, log to the console as well
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Custom logger methods with different levels
 */
export const log = {
  // Error level logs
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },
  
  // Warn level logs
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },
  
  // Info level logs
  info: (message, meta = {}) => {
    logger.info(message, meta);
  },
  
  // HTTP logs
  http: (message, meta = {}) => {
    logger.http(message, meta);
  },
  
  // Verbose logs
  verbose: (message, meta = {}) => {
    logger.verbose(message, meta);
  },
  
  // Debug logs
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },
  
  // Silly logs (lowest priority)
  silly: (message, meta = {}) => {
    logger.silly(message, meta);
  }
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

/**
 * Error logging middleware
 */
export const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  next(err);
};

export default logger;