# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_poison_rails_session',
  :secret      => '5c4ffcf740299f319b4a4b74684acdf6880561c789ed9c7db7c108f338fbd6e5a4e4ccac3bcbd36e82ed11a3e5e37c155d663db0c384516b048af7d201cfdc55'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
