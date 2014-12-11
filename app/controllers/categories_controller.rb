class CategoriesController < ApplicationController
	def index
		@categories = current_user.categories
	end

	def show

	end
end