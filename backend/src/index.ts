import "dotenv/config";
import { createApp } from "./app.js";

import { connectDB } from "./infrastructure/database/connection.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megamart";

async function bootstrap() {
  try {
    await connectDB(MONGO_URI);
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`MegaMart API running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
