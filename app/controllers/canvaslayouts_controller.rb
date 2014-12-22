class CanvaslayoutsController < ApplicationController
	def get_layout
		result = {}
		if current_user
			@categories = current_user.categories
			result['valid'] = true
			result['layout'] = current_layout.json_layout
			result['htmlMenu'] = render_to_string(partial: 'show_menu')
			result['css'] = current_category.css
		else
			result['valid'] = false
		end
		render json: result
	end

	def save_layout
		current_layout.update_attributes!(json_layout: params[:layout])
		render json: {message: 'Successfully saved layout.'}
	end
end