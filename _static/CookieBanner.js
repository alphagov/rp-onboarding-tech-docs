(function(exports) {
  "use strict";

  function CookieBanner(cookieName, cookieLifetimeInDays, bannerElementName) {
    this.cookieName = cookieName;
    this.cookieLifetimeInDays = cookieLifetimeInDays;
    this.bannerElementName = bannerElementName;
    this.bannerSlideupDelay = 10;
    this.closeElementId = 'cookie-message-close';
  }

  CookieBanner.prototype = {
    launch: function() {
      if(this.isCookieMissing()) {
        var self = this;
        window.setTimeout(function() {
          self.getCookieDiv().slideUp(1000, function() {
            self.setCookie();
          })
        }, this.bannerSlideupDelay * 1000);
        this.activateCloseLink();
      }
      else {
        this.getCookieDiv().hide();
      }
    },

    getCloseEl: function() {
      return $(document.getElementById(this.closeElementId));
    },

    getCookieDiv: function() {
      return $(document.getElementById(this.bannerElementName));
    },

    activateCloseLink: function() {
      var closeEl = this.getCloseEl();
      var self = this;
      closeEl.show();
      closeEl.click(function(e) {
        self.setCookie();
        self.getCookieDiv().hide();
        e.preventDefault();
      });
    },

    isCookieMissing: function() {
      return(typeof this.getCookie() == "undefined");
    },

    getCookie: function() {
      return Cookies.get(this.cookieName);
    },

    setCookie: function() {
      Cookies.set(this.cookieName, true, {
        expires: this.cookieLifetimeInDays
      });
    }
  };

  exports.CookieBanner = CookieBanner;
})(this);

    

  
