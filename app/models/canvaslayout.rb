class Canvaslayout < ActiveRecord::Base
	belongs_to :user
	serialize :objects, JSON

	def update_json_object(id, args)
		self.objects["objects"].each do |object|
			if object["id"] == id
				# object["title"] = params[:title]
				args.each do |key, value|
					object[key] = value
				end
				# object["src"] = params[:filename] if params[:filename]
			end
		end
		self.save!
	end

	def delete_json_object(id)
		self.objects["objects"].each do |object|
			if object["id"] == id
				# object["title"] = params[:title]
				# object["src"] = params[:filename] if params[:filename]
			end
		end
		self.save!
	end
end