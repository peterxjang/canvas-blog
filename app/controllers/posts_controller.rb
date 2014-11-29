class PostsController < ApplicationController
	def create
		@post = Post.new
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

	def update
		@post = Post.find_by_id(params[:id])
		if @post
			render json: {valid: true,
										html: render_to_string(partial: 'form')
										}
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