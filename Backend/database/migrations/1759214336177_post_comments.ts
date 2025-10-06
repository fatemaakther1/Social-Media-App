import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'post_comments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('post_id').unsigned().references('id').inTable('user_posts').onDelete('CASCADE')
      table.integer('profile_id').unsigned().references('id').inTable('user_profiles').onDelete('CASCADE')
      table.text('comment_text').notNullable()
      table.timestamp('created_datetime', { useTz: true }).defaultTo(this.now())

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
