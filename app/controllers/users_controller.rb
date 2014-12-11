class UsersController < ApplicationController
	def create
	end

	def show
		@user = current_user
		@posts = @user.categories.first.posts
	end
end