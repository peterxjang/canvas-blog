class Post < ActiveRecord::Base
	belongs_to :user
	has_many :post_tags
	has_many :tags, through: :post_tags
	has_many :postlayouts

	mount_uploader :image, ImageUploader

	validates :title, :body, :image, presence: true
end