class Category < ActiveRecord::Base
	belongs_to :user
	has_many :posts
	has_one :canvaslayout

	def self.create_defaults(user)
		['Books', 'Music', 'Movies', 'Games'].each do |name|
			user.categories.create!(name: name)
		end
	end
end