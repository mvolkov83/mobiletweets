qx.Class.define("mobiletweets.Application",
{
  extend : qx.application.Mobile,

  properties :
  {
      tweets :
      {
        check : "qx.data.Array",
        nullable : true,
        init : null,
        event : "changeTweets",
        apply : "_applyTweets" // just for logging the data
      },
  
      username :
      {
        check : "String",
        nullable : false,
        init : "",
        event : "changeUsername",
        apply : "_applyUsername"  // this method is called when the username property is set
      }
  },

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      var manager = new qx.ui.mobile.page.Manager(false);

      var inputPage = new mobiletweets.page.Input();
      manager.addDetail(inputPage);

      inputPage.show();


      // New instance of the Tweets page
      var tweetsPage = new mobiletweets.page.Tweets();

      this.bind("tweets", tweetsPage, "tweets");
      this.bind("username", tweetsPage, "title");
      
      // Add page to manager
      manager.addDetail(tweetsPage);
      
      // Show the tweets page, when the button is pressed
      inputPage.addListener("requestTweet", function(evt) {
        this.setUsername(evt.getData());
        tweetsPage.show();
      }, this);
      
      // Return to the Input page when the back button is pressed
      tweetsPage.addListener("back", function(evt) {
        inputPage.show({reverse:true});
      }, this);
    },
    
    __loadTweets : function() {
        // Mocked Identica Tweets API
        // Create a new JSONP store instance with the given url
        var self = this;
        var url = "http://demo.qooxdoo.org/3.5/tweets_step4.5/resource/tweets/service.js";
        console.log(url);
        var store = new qx.data.store.Jsonp();
        store.setCallbackName("callback");
        store.setUrl(url);
      
        // Use data binding to bind the "model" property of the store to the "tweets" property
        store.bind("model", this, "tweets");
    },
    
    // property apply
    _applyUsername : function(value, old) {
      this.__loadTweets();
    },
    
    _applyTweets : function(value, old) {
      // print the loaded data in the console
      this.debug("Tweets: ", qx.lang.Json.stringify(value));
    }
  }
});
