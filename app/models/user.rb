class User < ActiveRecord::Base
	has_secure_password
	has_many :categories
	has_many :comments
	has_one :canvaslayout
end