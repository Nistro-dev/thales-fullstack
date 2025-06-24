import { Sequelize } from 'sequelize'

export class DatabaseService {
  private static instance: Sequelize

  static async initialize(): Promise<void> {
    try {
      this.instance = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '3306'),
        username: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME ?? 'thales_db',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      })

      await this.instance.authenticate()
      console.log('✅ Connexion à la base de données établie avec succès.')

      // Synchronisation des modèles (à utiliser avec précaution en production)
      if (process.env.NODE_ENV === 'development') {
        await this.instance.sync({ alter: true })
        console.log('🔄 Modèles synchronisés avec la base de données.')
      }
    } catch (error) {
      console.error('❌ Impossible de se connecter à la base de données:', error)
      throw error
    }
  }

  static getInstance(): Sequelize {
    if (!this.instance) {
      throw new Error('Base de données non initialisée. Appelez DatabaseService.initialize() d\'abord.')
    }
    return this.instance
  }

  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.close()
      console.log('🔌 Connexion à la base de données fermée.')
    }
  }
}
