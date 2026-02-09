import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_DIR = path.join(process.cwd(), "assets");
const MAPPING_FILE = path.join(ASSETS_DIR, "cloudinary_mapping.json");

async function migrate() {
  const files = fs
    .readdirSync(ASSETS_DIR)
    .filter((file) => file.endsWith(".png"));
  const mapping: Record<string, string> = {};

  console.log(`Found ${files.length} images to migrate...`);

  for (const file of files) {
    const filePath = path.join(ASSETS_DIR, file);
    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "footloft_assets",
        public_id: file.replace(".png", ""),
        overwrite: true,
      });
      mapping[file] = result.secure_url;
      console.log(`Successfully uploaded ${file} -> ${result.secure_url}`);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error);
    }
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(`Migration complete. Mapping saved to ${MAPPING_FILE}`);
}

migrate();
