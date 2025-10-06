import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_posts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop the existing foreign key constraint
      table.dropForeign(['profile_id'])
      
      // Add new foreign key constraint referencing users table
      table.foreign('profile_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop the new foreign key constraint
      table.dropForeign(['profile_id'])
      
      // Restore the old foreign key constraint
      table.foreign('profile_id').references('id').inTable('user_profiles').onDelete('CASCADE')
    })
  }
}
