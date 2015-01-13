import login from 'main/login';
import register from 'main/register';
import account from 'main/account';

import team from 'main/team';

(function ($) {
  'use strict';

  var loginView = new login();
  var registerView = new register();
  var accountView = new account();
  team();

})(window.jQuery);
