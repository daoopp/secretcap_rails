class MembersController < ApplicationController

  before_filter :logged_in_and_redirect?, :only => [:profile]

  def create
    logout_keeping_session!
    @member = Member.new(params[:member])
    success = @member && @member.save
    if success && @member.errors.empty?
      # Protects against session fixation attacks, causes request forgery
      # protection if visitor resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset session
      #welcome email
      #MakeupMailer.deliver_welcome @member

      set_user_login @member # !! now logged in
      #flash[:notice] = "注册成功，邀请您的好友来加入十人族吧 - Tenerer.com"
      #redirect_to :controller => :welcome, :action => :invite
      render :json => {:status => 'ok', :data => member_login_data(@member)}
      return
    else
      render :json => {:status => 'error', :data => @member.errors.map { |k ,v| v }.join(', ')}
      return
    end
  end

  def forgot_pwd
    if request.post?
      if params[:email].blank?
        render :json => {:status => 'error', :data => "请输入Email地址"}
        return
      end

      @member = Member.first :email => params[:email]
      if @member
        @member.reset_password_token = LibMisc.generate_utoken(48)
        @member.save
        render :json => {:status => 'ok', :data => "重置密码的链接已发送到您的邮箱中，查看邮箱吧!"}
        return
        #MakeupMailer.deliver_forgot_pwd(@member)
      else
        render :json => {:status => 'error', :data => "Email地址不存在, 请重新输入"}
        return
      end
    else
      head 200 and return
    end
  end

  def reset_pwd
    unless params[:uc].blank?
      @member = Member.find_by_forgot_password_uuid params[:uc]
    end
    if request.post? 
      if !params[:password].blank? and
          !params[:password_confirmation].blank? and
          (params[:password] == params[:password_confirmation]) and
          @member
        @member.password = params[:password]
        @member.password_confirmation = params[:password_confirmation]
        @member.forgot_password_uuid = nil
        @reset_pwd = false
        if @member.valid?
          @member.save!
          @reset_pwd = true
        else
          flash[:notice] = @member.errors.full_messages.join('<br>')
        end
      else
        flash[:notice] = "密码不一致."
      end
    end

    @page_title = "重置密码"
  end

  def show

  end
  
  def profile
    @member = current_member
    if request.post?
      params[:member].delete_if { |key, value| value.to_s.empty? }
      @member.attributes = params[:member]
      if @member.valid?
        @member.save!
        flash[:notice] = "修改成功"
      else
        flash[:notice] = @member.errors.map {|k, v| "<p>#{v}</p>" }.join
      end
    end

    @page_title = "个人信息 / #{current_member.login}"
  end

  def account
    @member_account = current_member.member_account

    @page_title = "帐户余额 / #{current_member.login}"
  end

  private
  def set_no_page_right
    @render_page_right = false
  end

end
