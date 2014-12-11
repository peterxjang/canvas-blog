class CanvaslayoutsController < ApplicationController
	def get_layout
		result = {}
		if current_user
			result['valid'] = true
			result['layout'] = current_layout.objects
			result['htmlMenu'] = render_to_string(partial: 'show_menu')
		else
			# @error = "Incorrect email or password!"
			# session[:user_id] = nil
			result['valid'] = false
		end
		render json: result
	end

	def save_layout
		current_layout.update_attributes!(objects: params[:layout])
		render json: {message: 'Successfully saved layout.'}
	end
end