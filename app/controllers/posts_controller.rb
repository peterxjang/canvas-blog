class PostsController < ApplicationController
	def new
		@post = Post.new
	end

	def create
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
										html: render_to_string(partial: 'form')
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
				current_layout.updateJSON(params)
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
			render json: {valid: true,
										html: @post.title
										}
		else
			render json: {valid: false}
		end
	end
end