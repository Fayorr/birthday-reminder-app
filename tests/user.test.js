const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

// Mock the Mongoose User model
jest.mock('../models/User');

describe('User Interface and API Routes', () => {
	// Clear mock history before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /', () => {
		test('should render the index page successfully', async () => {
			const response = await request(app).get('/');

			expect(response.status).toBe(200);
			expect(response.text).toContain('Add Birthday');
			expect(response.text).toContain('<form action="/users" method="POST">');
		});
	});

	describe('POST /users', () => {
		test('should block duplicate emails and render error message', async () => {
			// Simulate the database finding an existing user
			User.findOne.mockResolvedValue({ email: 'existing@example.com' });

			const response = await request(app).post('/users').send({
				username: 'John Doe',
				email: 'existing@example.com',
				dateOfBirth: '1990-01-01',
			});

			expect(response.status).toBe(200);
			expect(response.text).toContain('This email is already registered.');
			expect(User.create).not.toHaveBeenCalled(); // Ensure database write was blocked
		});

		test('should create a new user and render success message', async () => {
			// Simulate the database finding no existing user
			User.findOne.mockResolvedValue(null);
			// Simulate a successful database save
			User.create.mockResolvedValue(true);

			const response = await request(app).post('/users').send({
				username: 'Jane Doe',
				email: 'newuser@example.com',
				dateOfBirth: '1995-05-05',
			});

			expect(response.status).toBe(200);
			expect(response.text).toContain('Birthday saved successfully!');
			expect(User.create).toHaveBeenCalledTimes(1);
			expect(User.create).toHaveBeenCalledWith({
				username: 'Jane Doe',
				email: 'newuser@example.com',
				dateOfBirth: '1995-05-05',
			});
		});

		test('should handle database errors gracefully', async () => {
			User.findOne.mockRejectedValue(new Error('Database connection lost'));

			const response = await request(app).post('/users').send({
				username: 'Error User',
				email: 'error@example.com',
				dateOfBirth: '1990-01-01',
			});

			expect(response.status).toBe(200);
			expect(response.text).toContain(
				'An error occurred while saving the data. Please try again.',
			);
		});
	});
});
