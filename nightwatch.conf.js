module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  'src_folders': ['test/nightwatch/tests'],

  'test_settings': {
    default: {
      'launch_url': 'http://localhost:3000'
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {}
      },
      webdriver: {
        'start_process': true,
        port: 4444,
        'server_path': require('chromedriver').path,
        'cli_args': [
          //'--verbose'
        ]
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [
              // '-headless',
              // '-verbose'
            ]
          }
        }
      },
      webdriver: {
        'start_process': true,
        port: 4444,
        'server_path': require('geckodriver').path,
        'cli_args': [
          //     // very verbose geckodriver logs
          //     // '-vv'
        ]
      }
    }
  }
};
