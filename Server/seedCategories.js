const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

// Connect to database
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Sample categories to seed
const sampleCategories = [
  {
    name: "Web Development",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more"
  },
  {
    name: "Data Science",
    description: "Master Python, Machine Learning, AI, and Data Analysis"
  },
  {
    name: "Mobile Development",
    description: "Build iOS and Android apps with React Native, Flutter"
  },
  {
    name: "Programming Languages",
    description: "Learn Java, Python, C++, JavaScript and other languages"
  },
  {
    name: "Database Management",
    description: "Master SQL, MongoDB, PostgreSQL and database design"
  },
  {
    name: "DevOps & Cloud",
    description: "Learn AWS, Docker, Kubernetes, CI/CD and cloud technologies"
  }
];

// Seed function
async function seedCategories() {
  try {
    // Clear existing categories (optional)
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    // Insert sample categories
    const result = await Category.insertMany(sampleCategories);
    console.log(`✅ Successfully created ${result.length} categories:`);
    
    result.forEach(category => {
      console.log(`   - ${category.name}: ${category.description}`);
    });

    console.log("\n🎉 Categories seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
