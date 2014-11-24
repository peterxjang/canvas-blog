module ApplicationHelper
	def current_user
		User.find_by_id(session[:user_id])
	end

	def current_layout
		if current_user
			layout = current_user.canvaslayout
			if layout.nil?
				layout = Canvaslayout.new(user: current_user)
				# layout.objects = nil
				# current_user.posts.each do |post|
				# 	layout[''] = 
				# end
				# data = [{bob: 32}, {smith: 1}]
				layout.objects = current_user.posts.each_with_index.map do |post, index|
					{id: post.id,
					 title: post.title,
					 top: 150.0 + 10*index,
					 left: 100.0 + 10*index,
					 angle: 0.0,
					 scaleX: nil,
					 scaleY: nil} 
				end
			end
			layout
		end
	end
end
