class ImageUploader < CarrierWave::Uploader::Base
  storage :file
  def cache_dir
    "#{Rails.root}/tmp/uploads"
  end
end