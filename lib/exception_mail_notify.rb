class ExceptionMailNotify < ActionMailer::Base

  @@receivers = []
  @@subject_prefix = ''
  
  def self.receivers=(r)
    @@receivers = r
  end

  def self.subject_prefix=(s)
    @@subject_prefix = s
  end

  def self.receivers
    @@receivers
  end

  def app_exception_notify(recipient, body)
    default_smtp_setting

    from 'tenerer.com@gmail.com'
    recipients recipient
    subject "[#{@@subject_prefix}Exception] #{Time.now}"
    content_type "text/html"
    body body
  end

  private
  def default_smtp_setting
    @@smtp_settings = {
      :address => 'smtp.gmail.com',     #default: localhost
      :port => '25',                    #default: 25
      :user_name => 'tenerer.com@gmail.com',#login name
      :password => 'tenerer.com@2010',        #login password
      :authentication => :login      #:plain, :login or :cram_md5
    }
    from 'Tenerer.com <tenerer.com@gmail.com>'
  end
  
end

class ApplicationController < ActionController::Base

  protected
  #也可以用
  #rescue_from Exception do |exception|
  #end
  def rescue_action(exception)
    if RAILS_ENV == 'production' and
        ![ActionController::RoutingError].include?(exception.class)
      bt =  exception.backtrace

      error =<<EOF
-------------------------Exception------------------------------------------
<b>time:</b> #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}
<b>method:</b> #{request.method}
<b>url:</b> #{request.url}
<b>user-agent:</b> #{request.user_agent}
<b>referer:</b> #{request.headers["Referer"]}
<b>params:</b> #{params.inspect}
----------------------------------------------------------------------------
<b>exception:</b>#{exception.class}
<b>message:</b>#{exception.message}
<b>backtace:</b>#{bt.join("\n")}
EOF

      ExceptionMailNotify.deliver_app_exception_notify ExceptionMailNotify.receivers.join(', '), error.gsub(/[\r|\n]+/,"<br/>")
    end
    super exception
  end
  
end