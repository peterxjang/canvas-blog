User.delete_all
Category.delete_all
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
	Category.create_defaults(user)
	user.categories.each do |category|
		5.times do 
			post = category.posts.new(title: Faker::Company.catch_phrase,
												    		body: Faker::Lorem.paragraphs.join("\n\n"))
			post.image = File.open(imagenames.sample)
			post.save!
			4.times do
				post.tags.create!(name: tags.sample)
			end
		end
	end
end