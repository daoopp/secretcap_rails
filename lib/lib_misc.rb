module LibMisc
  class << self
    #debug
    def dg v, file = 0, line = 0
      RAILS_DEFAULT_LOGGER.info "DG #{file} #{line}: #{v}" unless RAILS_ENV == "production"
    end

    def generate_utoken len = 8
      #another method
      #rand(36**8).to_s(36)
      
      #a = lambda { (('a'..'z').to_a + ('A'..'Z').to_a + (0..9).to_a).rand }
      a = lambda { rand(36 ** 1).to_s(36) }
      token = ""
      len.to_i.times { |t| token << a.call.to_s }
      token
    end

    #serial_number, product and order
    def generate_serial_number
      Date.today.to_s.split('-')[1..-1].reverse.to_s << generate_utoken(6).upcase
    end

    #money format
    def currency_format n
      ("%.2f" % n).to_f
    end

    #uuid
    def generate_uuid
      UUIDTools::UUID.random_create().to_s.gsub(/-/, "")
    end

  end
end