module Authenticated
  
#  self.login_regex       = /^[a-zA-Z0-9][a-zA-Z0-9\._-]{3,40}$/		#word num _
#
#  self.bad_login_message = "Sorry, Name is not allowed. Please use only letters, numbers, . and _ ".freeze
#
#  self.name_regex        = /\A[^[:cntrl:]\\<>\/&]*\z/              # Unicode, permissive
#  self.bad_name_message  = "avoid non-printing characters and \\&gt;&lt;&amp;/ please.".freeze
#
#  self.email_name_regex  = '[\w\.%\+\-]+'.freeze
#  self.domain_head_regex = '(?:[A-Z0-9\-]+\.)+'.freeze
#  self.domain_tld_regex  = '(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum)'.freeze
#  self.email_regex       = /\A#{email_name_regex}@#{domain_head_regex}#{domain_tld_regex}\z/i
#  self.bad_email_message = "Please enter a valid email address".freeze
  
  # Stuff directives into including module
  def self.included(recipient)
    recipient.extend(ModelClassMethods)
    recipient.class_eval do
      include ModelInstanceMethods
      before_save :encrypt_password
    end
  end # #included directives

  #
  # Class Methods
  #
  module ModelClassMethods
    # This provides a modest increased defense against a dictionary attack if
    # your db were ever compromised, but will invalidate existing passwords.
    # See the README and the file config/initializers/site_keys.rb
    #
    # It may not be obvious, but if you set REST_AUTH_SITE_KEY to nil and
    # REST_AUTH_DIGEST_STRETCHES to 1 you'll have backwards compatibility with
    # older versions of restful-authentication.
    def password_digest(password, salt)
      digest = REST_AUTH_SITE_KEY
      REST_AUTH_DIGEST_STRETCHES.times do
        digest = secure_digest(digest, salt, password, REST_AUTH_SITE_KEY)
      end
      digest
    end

    def secure_digest(*args)
      Digest::SHA1.hexdigest(args.flatten.join('--'))
    end

    def make_token
      secure_digest(Time.now, (1..10).map{ rand.to_s })
    end
  end # class methods

  #
  # Instance Methods
  #
  module ModelInstanceMethods

    # Encrypts the password with the user salt
    def encrypt(password)
      self.class.password_digest(password, salt)
    end

    def authenticated?(password)
      crypted_password == encrypt(password)
    end

    # before filter
    def encrypt_password
      return if password.blank?
      self.salt = self.class.make_token if new_record?
      self.crypted_password = encrypt(password)
    end
    def password_required?
      crypted_password.blank? || !password.blank?
    end
  end # instance methods
end
