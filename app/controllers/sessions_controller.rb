class SessionsController < ApplicationController
	def new
		@user = User.new
	end

	def create
		result = {}
		if current_user
			@user = current_user
			@posts = @user.posts
		else
			@user = User.find_by_email(params[:email])
			if @user && @user.authenticate(params[:password])
				session[:user_id] = @user.id
				@posts = @user.posts
			end
		end
		if @user
			result['valid'] = true
			result['layout'] = current_layout.objects
			result['html'] = render_to_string(partial: 'show_polaroid')
			result['htmlMenu'] = render_to_string(partial: 'show_menu')
		else
			@error = "Incorrect email or password!"
			session[:user_id] = nil
			# @user = User.new
			# render "new"
			result['valid'] = false
		end
		render json: result
	end

	def destroy
		session[:user_id] = nil
		# render 'new'
		redirect_to '/'
	end

	def save_layout
		current_user.canvaslayout.update_attributes!(objects: params[:layout])
		render json: {message: 'Successfully saved layout.'}
	end

	def view_post
		post = Post.find_by_id(params[:post_id])
		if post
			render json: {valid: true,
										html: "<h2>#{post.title}</h2>" + 
													"<p>#{post.body}</p>"
										}
		else
			render json: {valid: false}
		end
	end
end