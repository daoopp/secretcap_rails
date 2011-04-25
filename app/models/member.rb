class Member
  include MongoMapper::Document
  include Authenticated

  key :login, String, :required => true
  key :email, String, :required => true
  key :crypted_password, String
  key :salt, String
  key :uuid, String
  key :remember_me, Boolean
  key :remember_token, String
  key :remember_token_expires_at, Time
  key :reset_password_token, String
  key :sign_in_count, Integer, :default => 0
  key :last_sign_in_at, Time
  key :last_sign_in_ip, String

  #game data
  key :sex, Integer, :required => true           #1: maie, 2: female
  key :nature, Integer, :required => true        #1, 2, 3
  key :xp, Integer, :default => 0
  key :level, Integer, :default => 1
  key :history_points, Array  #[{y: 1, b: 2, r: 10, g: 2}, ...]
  key :arch, Array            #[arch_id, ..]
  key :friends, Array         #[member_login, ...]
  key :role, Integer

  timestamps!

  ensure_index( [[:uuid, 1]], :unique => true, :background => true )
  ensure_index( [[:login, 1]], :unique => true, :background => true )
  
  validates_confirmation_of :password
  validates_uniqueness_of :login
  validates_uniqueness_of :email
  validates_length_of :login, :within => 3..20
  validates_length_of :password, :within => 6..20

  before_create :create_uuid

  Nature = [
    [1, '逍遥'],
    [2, '地下'],
    [3, '高手']
  ]

  Sex = [
    [1, '男'],
    [2, '女']
  ]

  def archs
    Arch.all :id => self.arch
  end

  def set_login request
    self.collection.update({:_id => self.id},
      {'$inc' => {:sign_in_count => 1}, 
        '$set' => {:last_sign_in_at => Time.now, :last_sign_in_ip => request.remote_ip}},
      :upsert => false)
  end

  def self.authenticate(login, password)
    return nil if login.blank? || password.blank?
    m = first(:login => login.downcase)
    m = m.nil? ? first(:email => login.gsub(/\s*/, '')) : m
    m && m.authenticated?(password) ? m : nil
  end

  def login=(value)
    write_attribute :login, (value ? value.downcase : nil)
  end

  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end

  
  private
  def create_uuid
    self.uuid = LibMisc.generate_utoken(48)
    attrs = self.attributes
    attrs.delete :password
    self.attributes = attrs
  end

end