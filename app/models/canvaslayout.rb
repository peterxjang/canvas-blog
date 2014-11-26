class Canvaslayout < ActiveRecord::Base
	belongs_to :user
	serialize :objects, JSON
end