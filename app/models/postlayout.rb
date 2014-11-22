class Postlayout < ActiveRecord::Base
	belongs_to :canvaslayout
	belongs_to :post
end