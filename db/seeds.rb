# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.delete_all
Post.delete_all
Comment.delete_all
Tag.delete_all
PostTag.delete_all
Canvaslayout.delete_all

APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__))

emails = ['test@test.com'] + Array.new(4) { Faker::Internet.email  }
tags = ["silly", "funny", "serious", "work"]
imagenames = Dir[File.join(APP_ROOT, 'public', 'img', '*.jpg')]

emails.each do |email|
	user = User.create!(first_name: Faker::Name.first_name,
							 last_name: Faker::Name.last_name,
							 email: email,
							 password: 'password')
	5.times do 
		post = user.posts.new(title: Faker::Company.catch_phrase,
											    body: Faker::Lorem.paragraphs.join("\n\n"))
		post.image = File.open(imagenames.sample)
		post.save!
		4.times do
			post.tags.create!(name: tags.sample)
		end
	end
end