import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 5005;

// ✅ Connect to the database BEFORE starting the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });
