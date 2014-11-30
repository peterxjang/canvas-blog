class Canvaslayout < ActiveRecord::Base
	belongs_to :user
	serialize :objects, JSON

	def update_json_object(id, args)
		self.objects["objects"].each do |object|
			if object["id"] == id
				args.each do |key, value|
					object[key] = value
				end
			end
		end
		self.save!
	end

	def delete_json_object(id)
		self.objects["objects"].delete_if { |object| object["id"] == id }
		self.save!
	end

	def create_json_object(post)
		self.objects["objects"] << {
			id: post.id,
			title: post.title,
			src: post.image.url,
			top: 150.0 + 10*index,
			left: 100.0 + 10*index,
			angle: 0.0,
			scaleX: nil,
			scaleY: nil,
			offsetX: 0,
			offsetY: 0,
			zIndex: 1
		} 
		self.save!
	end
end