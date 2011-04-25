class HomeController < ApplicationController
  
  def index
    unless cookies[:poison_uuid].blank?
      member = Member.first(:uuid => cookies[:poison_uuid])
      if member
        @json_login_data = member_login_data(member)
      end
    end
  end

end
