/**
 * Application-wide constants
 */

// Database related constants
export const DATABASE = {
  DEFAULT_PATH: 'data/database.json',
  COLLECTIONS: {
    PATIENTS: 'patients',
    SAMPLES: 'samples',
    AUDIT_LOGS: 'auditLogs',
  },
};

// Entity related constants
export enum ENTITY_NAMES {
  PATIENT = 'Patient',
  SAMPLE = 'Sample',
}

export const API_ROUTES = {
  PATIENTS: 'patients',
  SAMPLES: 'samples',
  AUDIT: 'audit',
  ANALYTICS: 'analytics',
};

// Analytics constants
export enum MeasurementType {
  HEART_RATE = 'heartRate',
}

export enum AggregationType {
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
}

// API endpoints
export const API_ENDPOINTS = {
  SWAGGER_URL: '/api',
};

// Default pagination values
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
