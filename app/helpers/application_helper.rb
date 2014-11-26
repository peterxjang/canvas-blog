module ApplicationHelper
	def current_user
		User.find_by_id(session[:user_id])
	end

	def current_layout
		if current_user
			layout = current_user.canvaslayout
			if layout.nil?
				objects = current_user.posts.each_with_index.map do |post, index|
					{id: post.id,
					 title: post.title,
					 src: post.image.url,
					 top: 150.0 + 10*index,
					 left: 100.0 + 10*index,
					 angle: 0.0,
					 scaleX: nil,
					 scaleY: nil} 
				end
				layout = Canvaslayout.create!(user: current_user, objects: objects)
			else
				puts 'yoyoyoyoyoyoyoyo'
			end
			puts 'aaaaaaaaaaaa'
			p layout.objects
			layout
		end
	end
end
