class Arch
  include MongoMapper::Document

  key :name, String
  key :name_en, String
  key :desp, String
  key :desp_en, String
  key :icon, String

  ensure_index( [[:name, 1]], :unique => true, :background => true )
  
end