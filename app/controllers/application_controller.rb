# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base

  include AuthenticatedSystem

  helper :all # include all helpers, all the time
  helper_method :current_member, :logged_in?
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  layout 'home'

  ExceptionMailNotify.receivers = %w[mytake6@gmail.com]
  ExceptionMailNotify.subject_prefix = 'Tenerer.com '

  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  protected
  def set_user_login member
    self.current_member = member
    cookies[:poison_uuid] = { :value => member.uuid, :expires => 20.year.from_now }
    member.set_login request
  end

  def member_login_data member
    {
      :uuid => member.uuid,
      :name => member.login,
#      :sex => member.sex,
      :level => member.level,
      :xp => member.xp,
      :arch => member.arch,
#      :nature => member.nature,
      :friends => member.friends,
      :role => member.role
    }
  end
end
