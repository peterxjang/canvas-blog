class Canvaslayout < ActiveRecord::Base
	belongs_to :user
	serialize :objects, JSON

	def updateJSON(params)
		self.objects["objects"].each do |object|
			if object["id"] == params[:id].to_i
				object["title"] = params[:title]
				# object["src"] = params[:filename] if params[:filename]
			end
		end
		self.save!
	end
end