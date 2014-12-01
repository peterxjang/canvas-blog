module ApplicationHelper
	def current_user
		User.find_by_id(session[:user_id])
	end

	def current_layout
		if current_user
			layout = current_user.canvaslayout
			if true #layout.nil?
				objects = current_user.posts.each_with_index.map do |post, index|
					{id: post.id,
					 title: post.title,
					 src: post.image.url,
					 top: 150.0 + 10*index,
					 left: 100.0 + 10*index,
					 angle: 0.0,
					 scaleX: nil,
					 scaleY: nil,
					 offsetX: 0,
					 offsetY: 0,
					 zIndex: 1} 
				end
				layoutData = {
					objects: objects, 
					layer: {
						scale: 1.0,
						x: 0.0,
						y: 0.0,
						offsetX: 0.0,
						offsetY: 0.0,
					}
				}
				layout = Canvaslayout.create!(user: current_user, objects: layoutData)
			end
			layout
		end
	end
end
