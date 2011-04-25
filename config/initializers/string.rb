class String

  def gsub_to_slash
    self.gsub(/[^\d|\w]+/, '-').chomp('-')
  end

  def gsub_email_number
#    re = {
#      /..@.{4}/ => '*' * 7
#      # /(\d{5})\d+/ => '\1***'
#    }
#    re.each { |k, v| self.gsub!(k, v) }
#    self

    self.gsub!(/[^\s]+@[^\s]+\.[^\s]+/) do | x |
      if x.downcase.index("@mybestlady.com")
        x
      else
        "****@****.****"
      end
    end
    self
  end

  def gsub_url

    self.gsub!(/http:[^\s'">]+/) do | x |
      if x.downcase.index("mybestlady.com")
        x
      else
        "http://****.***.***"
      end
    end
    self
  end

  def gsub_html
    self.gsub(/<\/?[^>]+>/i, '')
  end

  def gsub_to_br
    self.gsub(/[\r|\n]+/,'<br>')
  end

end
