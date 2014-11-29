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
					 scaleY: nil,
					 zIndex: 1} 
				end
				layout = Canvaslayout.create!(user: current_user, 
																			objects: objects,
																			scale: 1.0,
																			x: 0.0,
																			y: 0.0)
			end
			layout
		end
	end
end
