// Test script to create users and test login
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  country: String,
  role: String,
  points: Number,
  badges: Array,
  isActive: Boolean
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing users
    const users = await User.find({}).select('username email role isActive');
    console.log('\n=== EXISTING USERS ===');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Role: ${user.role}, Active: ${user.isActive}`);
    });

    // Create test users if they don't exist
    const testUsers = [
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        country: 'US',
        role: 'contributor'
      },
      {
        username: 'testadmin',
        email: 'admin@example.com',
        password: 'admin123',
        country: 'US',
        role: 'admin'
      },
      {
        username: 'testverifier',
        email: 'verifier@example.com',
        password: 'verifier123',
        country: 'US',
        role: 'verifier'
      }
    ];

    console.log('\n=== CREATING TEST USERS ===');
    for (const testUser of testUsers) {
      const exists = await User.findOne({ username: testUser.username });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        
        await User.create({
          ...testUser,
          password: hashedPassword,
          points: 0,
          badges: [],
          isActive: true
        });
        console.log(`✅ Created user: ${testUser.username} (password: ${testUser.password})`);
      } else {
        console.log(`⏭️  User already exists: ${testUser.username}`);
      }
    }

    // Test password comparison
    console.log('\n=== TESTING PASSWORD COMPARISON ===');
    const testUser = await User.findOne({ username: 'testuser' }).select('+password');
    if (testUser) {
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, testUser.password);
      console.log(`Password comparison for 'testuser' with '${testPassword}': ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
      
      const wrongPassword = 'wrongpassword';
      const isWrongMatch = await bcrypt.compare(wrongPassword, testUser.password);
      console.log(`Password comparison for 'testuser' with '${wrongPassword}': ${isWrongMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    }

    console.log('\n=== TEST CREDENTIALS ===');
    console.log('Use these credentials to login:');
    console.log('1. Username: testuser, Password: password123 (Contributor)');
    console.log('2. Username: testadmin, Password: admin123 (Admin)');
    console.log('3. Username: testverifier, Password: verifier123 (Verifier)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

testLogin();
