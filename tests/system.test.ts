import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Gender } from '../src/patients/entities/patient.entity';
import * as fs from 'fs-extra';
import * as path from 'path';

jest.setTimeout(60000);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Medical System Tests', () => {
  let app: INestApplication;
  const dbPath = path.join(process.cwd(), 'data', 'database.json');

  // Test data
  const testPatients = [
    {
      id: '1',
      name: 'Alice Johnson',
      age: 34,
      gender: 'female',
    },
    {
      id: '2',
      name: 'Bob Smith',
      age: 45,
      gender: 'male',
    },
  ];

  const testSamples = [
    {
      patientId: '1',
      timestamp: '2024-03-01T08:00:00Z',
      heartRate: 85,
    },
    {
      patientId: '1',
      timestamp: '2024-03-01T10:30:00Z',
      heartRate: 101,
    },
    {
      patientId: '1',
      timestamp: '2024-03-01T13:45:00Z',
      heartRate: 97,
    },
    {
      patientId: '2',
      timestamp: '2024-03-02T09:15:00Z',
      heartRate: 88,
    },
    {
      patientId: '2',
      timestamp: '2024-03-02T11:00:00Z',
      heartRate: 105,
    },
    {
      patientId: '2',
      timestamp: '2024-03-02T14:20:00Z',
      heartRate: 93,
    },
  ];
  beforeAll(async () => {
    // Create clean test database
    await fs.ensureDir(path.dirname(dbPath));
    await fs.writeJson(dbPath, {
      patients: [],
      samples: [],
      auditLogs: [],
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Add test data
    for (const patient of testPatients) {
      await request(app.getHttpServer()).post('/patients').send(patient);
    }

    for (const sample of testSamples) {
      await request(app.getHttpServer()).post('/samples').send(sample);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Test 1: High heart rate samples', () => {
    it("should display all sample instances where a patient's heart rate exceeds 100", async () => {
      const response = await request(app.getHttpServer())
        .get('/samples')
        .query({ minHeartrate: 100, startTimestamp: '2024-01-01T00:00:00Z', endTimestamp: '2025-01-01T00:00:00Z' });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].patientId).toBe('1');
      expect(response.body.items[0].heartRate).toBe(101);
      expect(response.body.items[1].patientId).toBe('2');
      expect(response.body.items[1].heartRate).toBe(105);
    });
  });

  describe('Test 2: Aggregated analytics', () => {
    it('should calculate average, minimum and maximum heart rate per patient within a specific time range', async () => {
      const startTime = new Date('2023-05-20T00:00:00Z').toISOString();
      const endTime = new Date('2025-05-21T00:00:00Z').toISOString();

      const response = await request(app.getHttpServer())
        .post('/samples/analytics')
        .send({
          measurementType: 'heartRate',
          aggregationTypes: ['avg', 'min', 'max'],
          startTime,
          endTime,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(2);

      // Check P001 stats
      const p1stats = response.body.find(r => r.patientId === '1');
      expect(p1stats).toBeDefined();
      expect(p1stats.avg).toBe(94.33);
      expect(p1stats.min).toBe(85);
      expect(p1stats.max).toBe(101);

      // Check P002 stats
      const p2stats = response.body.find(r => r.patientId === '2');
      expect(p2stats).toBeDefined();
      expect(p2stats.avg).toBe(95.33);
      expect(p2stats.min).toBe(88);
      expect(p2stats.max).toBe(105);
    });
  });

  describe('Test 3: Audit request counts', () => {
    it('should track and return how many times each patient data has been requested', async () => {
      // Generate some requests to patients and samples
      await request(app.getHttpServer()).get('/patients/1');
      await request(app.getHttpServer()).get('/patients/2');
      await request(app.getHttpServer()).get('/patients');

      await request(app.getHttpServer()).get('/samples').query({ patientId: '1' });
      await request(app.getHttpServer()).get('/samples').query({ patientId: '2' });

      // Get audit data
      const response = await request(app.getHttpServer()).post('/audit/patients');

      expect(response.status).toBe(201);

      // Find P001 audit
      const p1 = response.body.find(a => a.patientId === '1');
      expect(p1).toBeDefined();
      expect(p1.patients).toBeGreaterThanOrEqual(2);
      expect(p1.samples).toBeGreaterThanOrEqual(1);

      // Find P002 audit
      const p2 = response.body.find(a => a.patientId === '1');
      expect(p2).toBeDefined();
      expect(p2.patients).toBeGreaterThanOrEqual(2);
      expect(p2.samples).toBeGreaterThanOrEqual(1);
    });
  });
});
