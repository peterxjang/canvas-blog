class ImageUploader < CarrierWave::Uploader::Base
  storage :file
  def cache_dir
    "#{APP_ROOT}/tmp/uploads"
  end
end