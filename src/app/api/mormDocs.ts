import { Client } from "pg";
import { parse } from "pg-connection-string";
const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL || "";

export class MormDocs {
  private client: any = null;
  private databaseUrl = "";

  constructor() {
    this.databaseUrl = DATABASE_URL;
  }

  /** Connect to a database */
  private async connect(dbUrl?: string) {
    this.client = new Client({
      connectionString: dbUrl || this.databaseUrl,
      // ssl: { rejectUnauthorized: true },
    });
    await this.client.connect();
  }

  /** Disconnect */
  private async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
      console.log("✅ Disconnected");
    }
  }

  /** Run raw SQL */
  private async query(sql: string, values: any[] = []) {
    if (!this.client) throw new Error("❌ No database connection");
    return await this.client.query(sql, values);
  }

  /** Create the database if it doesn't exist (handles special characters) */

  async createDatabase() {
    const config = parse(DATABASE_URL);
    const dbName = config.database;
    if (!dbName) throw new Error("❌ Database name not found in DATABASE_URL");

    // Connect to default postgres database to create new DB
    const defaultDbUrl = this.databaseUrl.replace(dbName, "postgres");
    await this.connect(defaultDbUrl);

    // Quote the database name to handle dashes or special characters
    const quotedDbName = `"${dbName}"`;
    const exists = await this.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (exists.rowCount === 0) {
      await this.query(`CREATE DATABASE ${quotedDbName}`);
      console.log(`✅ Database created: ${dbName}`);
    } else {
      console.log(`⚠️ Database already exists: ${dbName}`);
    }

    await this.disconnect();
  }

  /** Create the 'docs' table including timestamps and is_deleted */
  async createDocsTable() {
    await this.connect();
    await this.query(`
      CREATE TABLE IF NOT EXISTS docs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL ,
        content TEXT,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_modified TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'docs' created");
    await this.disconnect();
  }

  /** Insert a new doc */
  async insertDoc(title: string, content: string) {
    await this.connect();
    const { rows } = await this.query(
      `INSERT INTO docs (title, content) VALUES ($1, $2) RETURNING *;`,
      [title, content]
    );
    await this.disconnect();
    return rows[0];
  }

  /** Fetch all docs */
  async getDocs() {
    await this.connect();
    const res = await this.query(`SELECT * FROM docs ORDER BY id ASC;`);
    await this.disconnect();
    return res.rows;
  }

  async getDoc(id: string) {
    await this.connect();
    const res = await this.query(
      `SELECT * FROM docs WHERE id=$1 ORDER BY id ASC;`,
      [id]
    );
    await this.disconnect();
    return res.rows[0];
  }

  /** Soft-delete a doc */
  async softDeleteDoc(id: string, action: boolean) {
    await this.connect();
    const { rows } = await this.query(
      `UPDATE docs SET is_deleted = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`,
      [action, id]
    );
    await this.disconnect();
    return rows[0];
  }

  /** delete a doc */
  async deleteDoc(id: string) {
    await this.connect();
    await this.query(`DELETE FROM docs WHERE id = $1`, [id]);
    await this.disconnect();
  }

  async updateDoc(id: string, fields: Record<string, any>) {
    await this.connect();

    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    // Build the dynamic column updates
    for (const [key, value] of Object.entries(fields)) {
      updates.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    // Always update the timestamp
    updates.push(`updated_at = NOW()`);

    // Add ID as last parameter
    values.push(id);

    // Build dynamic SQL
    const sql = `
    UPDATE docs 
    SET ${updates.join(", ")} 
    WHERE id = $${index}
    RETURNING *;
  `;

    const { rows } = await this.query(sql, values);

    await this.disconnect();
    return rows[0];
  }

  /** Users fetch all docs */
  async fetchDocs() {
    await this.connect();
    const res = await this.query(
      `SELECT * FROM docs WHERE is_deleted=false ORDER BY id ASC;`
    );
    await this.disconnect();
    return res.rows;
  }
}
