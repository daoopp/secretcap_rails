# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  # render new.rhtml
  def new
    @render_page_right = false
    @remember_me = 1
    @page_title = "登录"
  end

  def create
    logout_keeping_session!
    member = Member.authenticate(params[:login], params[:password])
    if params[:login].blank? or params[:password].blank?
      render :text => "failed", :status => 500
      return
    end

    if member
      # Protects against session fixation attacks, causes request forgery
      # protection if user resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset_session
      set_user_login member

      new_cookie_flag = true#(params[:remember_me] == "1")
      #handle_remember_cookie! new_cookie_flag
      render :json => {:data => member_login_data(member)}
      return
    else
      note_failed_signin
      render :text => "failed", :status => 500
      return
    end
  end

  def destroy
    logout_killing_session!
    redirect_to '/'
  end

  protected
  # Track failed login attempts
  def note_failed_signin
    logger.warn "Failed login for '#{params[:login]}' from #{request.remote_ip} at #{Time.now.utc}"
  end
end
