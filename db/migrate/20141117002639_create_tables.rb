class CreateTables < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string :first_name
    	t.string :last_name
    	t.string :email
    	t.string :password_digest
    	t.timestamps
    end

    create_table :categories do |t|
      t.belongs_to :user
      t.string :name
      t.text :description
      t.string :image
      t.text :css
      t.timestamps
    end

    create_table :posts do |t|
      t.belongs_to :category
      t.string :title
      t.text :body
      t.string :image
      t.timestamps
    end

    create_table :comments do |t|
      t.belongs_to :user
      t.text :body
    	t.timestamps
    end

    create_table :tags do |t|
      t.string :name
    	t.timestamps
    end

    create_table :post_tags do |t|
      t.belongs_to :post
      t.belongs_to :tag
    	t.timestamps
    end

    create_table :canvaslayouts do |t|
      t.belongs_to :category
      t.text :json_layout
      t.timestamps
    end
  end
end
