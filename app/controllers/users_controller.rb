class UsersController < ApplicationController
	def create
	end

	def show
		@user = current_user
		@posts = @user.posts
	end
end