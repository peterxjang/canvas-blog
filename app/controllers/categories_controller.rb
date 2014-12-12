class CategoriesController < ApplicationController
	def index
		@categories = current_user.categories
	end

	def show
		session[:category_id] = params[:id]
	end
end