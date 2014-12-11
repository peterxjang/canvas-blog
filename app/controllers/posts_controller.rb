class PostsController < ApplicationController
	def new
		@post = Post.new
		render json: {valid: true,
									html: render_to_string(partial: 'form_new')
									}
	end

	def create
		post = current_user.posts.new(
			title: params[:title], 
			body: params[:body],
		)
		post.image = params[:filename]
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
end