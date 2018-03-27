/**
 * Twelve Monkeys logger
 */



import * as pino from 'pino';

const logger = pino({
  base: null,
  level: 'trace',
});

logger.extend = logger.child;

logger.trace('trace');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.error('error');
logger.fatal('fatal');

logger.extend({ someAdditional: 'value' }).info('extended');
