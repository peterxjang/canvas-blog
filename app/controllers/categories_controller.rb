class CategoriesController < ApplicationController
	def index
		@categories = current_user.categories
	end

	def show
		session[:category_id] = params[:id]
	end

	def edit_background
		render json: {valid: true, html: render_to_string(partial: 'form_edit')}
	end

	def update_background
		if current_category
			current_category.update_attributes(css: params[:css])
			if current_category.valid?
				render json: {valid: true, css: current_category.css}
			else
				render json: {valid: false}
			end
		else
			render json: {valid: false}
		end
	end
end