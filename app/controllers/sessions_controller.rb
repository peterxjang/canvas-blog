class SessionsController < ApplicationController
	def new
		@user = User.new
	end

	def create
		if current_user
			@user = current_user
		else
			@user = User.find_by_email(params[:email])
			if @user && @user.authenticate(params[:password])
				session[:user_id] = @user.id
			end
		end
		if @user
			redirect_to :categories
		else
			@message_signin = "Incorrect email or password!"
			@user = User.new
			render "new"
		end
	end

	def destroy
		session[:user_id] = nil
		session[:category_id] = nil
		redirect_to '/'
	end
end