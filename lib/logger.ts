// lib/logger.ts
// Production-safe logging utility

export const logger = {
  error: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, ...args);
    }
    // In production, you might want to send to a logging service
    // Example: sendToLoggingService('error', message, args);
  },

  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, ...args);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(message, ...args);
    }
  }
};

// Security audit logging
export const auditLog = {
  loginAttempt: (ip: string, success: boolean, username?: string) => {
    const message = `Login attempt from ${ip}: ${success ? 'SUCCESS' : 'FAILED'}${username ? ` (${username})` : ''}`;
    logger.info(message);
    // In production, send to security monitoring system
  },

  adminAction: (action: string, userId: string, details?: any) => {
    const message = `Admin action: ${action} by ${userId}`;
    logger.info(message, details);
    // In production, send to audit trail system
  },

  securityEvent: (event: string, details: any) => {
    const message = `Security event: ${event}`;
    logger.warn(message, details);
    // In production, send to security incident system
  }
};
