class PostsController < ApplicationController
	def new
		@post = Post.new
		render json: {valid: true,
									html: render_to_string(partial: 'form_new')
									}
	end

	def create
		post = current_user.posts.create(
			title: params[:title], 
			body: params[:body],
			image: params[:filename]
		)
		current_layout.create_json_object(post)
		render json: {valid: post.valid?}
	end

	def show
		@post = Post.find_by_id(params[:id])
		if @post
			render json: {valid: true,
										html: "<h2>#{@post.title}</h2>" + 
													"<p>#{@post.body}</p>"
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
			# @post.image = params[:filename] if params[:filename]
			@post.save
			if @post.valid?
				current_layout.update_json_object(params[:id].to_i, "title" => params[:title])
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