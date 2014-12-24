class PostsController < ApplicationController
	def new
		@post = Post.new
		render json: {valid: true,
									html: render_to_string(partial: 'form_new')
									}
	end

	def create
		post = current_category.posts.new(
			title: params[:title], 
			body: params[:body],
		)
		# post.image = params[:filename]
		p 'fdsafdsafdsafsafdsafdaf'
		p params[:remotefilename]
		p params[:filename]
		if !params[:filename].nil?
			post.image = params[:filename]
		else
			post.remote_image_url = params[:remotefilename]
		end
		post.save
		if post.valid?
			# current_layout.create_json_object(post)
			render json: {valid: true,
										id: post.id,
									  title: post.title,
										body: post.body,
										src: post.image.url,
										top: 0,
										left: 0,
										srcWidth: nil,
										srcHeight: nil,
										scaleX: nil,
										scaleY: nil,
										offsetX: 0,
										offsetY: 0,
										angle: 0,
										zIndex: 1}
		else
			render json: {valid: false}
		end
	end

	def show
		@post = Post.find_by_id(params[:id])
		if @post
			body = @post.body.gsub("\n", "<br/>")
			render json: {valid: true,
										html: "<h2>#{@post.title}</h2>" + 
													"<p>#{body}</p>"
										}
		else
			render json: {valid: false}
		end
	end

	def edit
		@post = Post.find_by_id(params[:id])
		if @post
			render json: {valid: true,
										html: render_to_string(partial: 'form_edit')
										}
		else
			render json: {valid: false}
		end
	end

	def update
		@post = Post.find_by_id(params[:id])
		if @post
			@post.title = params[:title]
			@post.body = params[:body]
			@post.save
			if @post.valid?
				# current_layout.update_json_object(params[:id].to_i, "title" => params[:title])
				render json: {valid: true, title: params[:title]}
			else
				render json: {valid: false}
			end
		else
			render json: {valid: false}
		end
	end
	
	def destroy
		@post = Post.find_by_id(params[:id])
		if @post
			@post.delete
			current_layout.delete_json_object(params[:id].to_i)
			render json: {valid: true}
		else
			render json: {valid: false}
		end
	end

	def amazon_image_search
		search_index = 'All'
		if current_category
			search_index = 'Books' if current_category.name == 'Books'
			search_index = 'Video' if current_category.name == 'Movies'
			search_index = 'Music' if current_category.name == 'Music'
			search_index = 'Software' if current_category.name == 'Games'
		end
		request = Vacuum.new
		request.configure(aws_access_key_id: Rails.application.secrets.aws_access_key_id,
									    aws_secret_access_key: Rails.application.secrets.aws_secret_access_key,
									    associate_tag: 'peterjang')
		response = request.item_search(
		  query: {
		    'Keywords'    => params[:searchterms],
		    'SearchIndex' => search_index,
		    'ResponseGroup' => 'Medium'
		  }
		)
		items = []
		response.to_h["ItemSearchResponse"]["Items"]["Item"].each do |item|
			title = item['ItemAttributes']['Title'] rescue "No title"
			src_small = item['SmallImage']['URL'] rescue nil
			src_large = item['LargeImage']['URL'] rescue nil
			items << {title: title, src_large: src_large, src_small: src_small}
		end
		render json: {valid: true, items: items}
	end
end