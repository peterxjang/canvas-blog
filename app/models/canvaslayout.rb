class Canvaslayout < ActiveRecord::Base
	belongs_to :user
	has_many :postlayouts
end