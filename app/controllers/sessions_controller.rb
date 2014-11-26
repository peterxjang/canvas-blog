class SessionsController < ApplicationController
	def new
		@user = User.new
	end

	def create
		result = {}
		if current_user
			@user = current_user
			@posts = @user.posts
			result['valid'] = true
			result['objects'] = current_layout.objects
			result['scale'] = current_layout.scale
			result['x'] = current_layout.x
			result['y'] = current_layout.y
			result['html'] = render_to_string(partial: 'show_polaroid')
			result['htmlMenu'] = render_to_string(partial: 'show_menu')
		else
			@user = User.find_by_email(params[:email])
			if @user && @user.authenticate(params[:password])
				session[:user_id] = @user.id
				@posts = @user.posts
				# redirect_to @user
				result['valid'] = true
				result['objects'] = current_layout.objects
				result['scale'] = current_layout.scale
				result['x'] = current_layout.x
				result['y'] = current_layout.y
				result['html'] = render_to_string(partial: 'show_polaroid')
				result['htmlMenu'] = render_to_string(partial: 'show_menu')
			else
				@error = "Incorrect email or password!"
				session[:user_id] = nil
				# @user = User.new
				# render "new"
				result['valid'] = false
			end
		end
		render json: result
	end

	def destroy
		session[:user_id] = nil
		# render 'new'
		redirect_to '/'
	end

	def save_layout
		current_user.canvaslayout.update_attributes!(objects: params[:objects],
																								 scale: params[:scale],
																								 x: params[:x],
																								 y: params[:y])
		render json: {message: 'Successfully saved layout.'}
	end
end