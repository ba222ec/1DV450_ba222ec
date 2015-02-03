class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, limit: 50, null: false
      t.string :email, limit: 254, null: false
      t.string :password_digest, null: false
      t.boolean :admin, null: false, default: false
      t.timestamps
    end
    
    add_index :users, :name, unique: true
    add_index :users, :email, unique: true
  end
end
