require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const { syncDatabase } = require('./src/utils/dbSync');

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    await syncDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}`);
      console.log(`\nAvailable Routes:`);
      console.log(`   POST   /users`);
      console.log(`   GET    /users/:id`);
      console.log(`   POST   /meetings`);
      console.log(`   GET    /meetings`);
      console.log(`   GET    /meetings/:id`);
      console.log(`   PUT    /meetings/:id`);
      console.log(`   DELETE /meetings/:id`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();