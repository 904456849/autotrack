/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var assert = require('assert');
var ga = require('./analytics');
var constants = require('../lib/constants');


var CTRL = '\uE009';
var META = '\uE03D';
var SESSION_TIMEOUT_IN_MILLISECONDS = 2000; // 2 seconds
var SESSION_TIMEOUT_IN_MINUTES = (1/60) * 2; // 2 seconds
var BUFFER = 500; // An extra wait time to avoid flakiness


var browserCaps;
var command;


describe('pageVisibilityTracker', function() {

  before(function() {
    browserCaps = browser.session().value;
    command = browserCaps.platform.indexOf('OS X') < 0 ? META : CTRL;

    // Loads the autotrack file since no custom HTML is needed.
    browser.url('/test/autotrack.html');
  });


  beforeEach(function() {
    browser
        .execute(ga.run, 'create', 'UA-XXXXX-Y', 'auto')
        .execute(ga.trackHitData);
  });


  afterEach(function () {
    browser
        .execute(ga.clearHitData)
        .execute(ga.run, 'pageVisibilityTracker:remove')
        .execute(ga.run, 'remove');
  });


  it('should send events when the visibility state changes', function() {

    if (notSupportedInBrowser()) return;

    var hitData = browser
        .execute(ga.run, 'require', 'pageVisibilityTracker')
        .element('body').keys(command + 't' + command) // Opens a new tab.
        .element('body').keys(command + 'w' + command) // Closes the new tab.
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 2);
    assert.equal(hitData[0].eventCategory, 'Page Visibility');
    assert.equal(hitData[0].eventAction, 'change');
    assert.equal(hitData[0].eventLabel, 'hidden');
    assert.equal(hitData[1].eventCategory, 'Page Visibility');
    assert.equal(hitData[1].eventAction, 'change');
    assert.equal(hitData[1].eventLabel, 'visible');
  });


  it('should track the elapsed time between events', function() {

    if (notSupportedInBrowser()) return;

    browser
        .execute(ga.run, 'require', 'pageVisibilityTracker')
        .pause(2000);

    browser
        .element('body').keys(command + 't' + command) // Opens a new tab.
        .pause(1000);

    var hitData = browser
        .element('body').keys(command + 'w' + command) // Closes the new tab.
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 2);
    assert.equal(hitData[0].eventCategory, 'Page Visibility');
    assert.equal(hitData[0].eventAction, 'change');
    assert.equal(hitData[0].eventLabel, 'hidden');
    assert(hitData[0].eventValue > 2000 && hitData[0].eventValue < 3000);

    assert.equal(hitData[1].eventCategory, 'Page Visibility');
    assert.equal(hitData[1].eventAction, 'change');
    assert.equal(hitData[1].eventLabel, 'visible');
    assert(hitData[1].eventValue > 1000 && hitData[1].eventValue < 2000);
  });


  it('should not send any hidden events if the session has timed out',
      function() {

    if (notSupportedInBrowser()) return;

    browser
        .execute(ga.run, 'require', 'pageVisibilityTracker', {
          sessionTimeout: SESSION_TIMEOUT_IN_MINUTES
        })
        .pause(SESSION_TIMEOUT_IN_MILLISECONDS + BUFFER);

    var hitData = browser
        .element('body').keys(command + 't' + command) // Opens a new tab.
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 0);

    // Closes the new tab.
    browser.element('body').keys(command + 'w' + command);
  });


  it('should preemptively start all new session hits with a pageview',
      function() {

    if (notSupportedInBrowser()) return;

    browser
        .execute(ga.run, 'require', 'pageVisibilityTracker', {
          sessionTimeout: SESSION_TIMEOUT_IN_MINUTES
        })
        .pause(SESSION_TIMEOUT_IN_MILLISECONDS + BUFFER);

    var hitData = browser
        .execute(ga.run, 'send', 'event', 'Uncategorized', 'inactive')
        .execute(ga.getHitData)
        .value;

    // Expects non-pageview hits queued to be sent after the session has timed
    // out to include a pageview immediately before them.
    assert.equal(hitData.length, 2);
    assert.equal(hitData[0].hitType, 'pageview');
    assert.equal(hitData[1].eventCategory, 'Uncategorized');
    assert.equal(hitData[1].eventAction, 'inactive');
  });


  it('should not send visible events when starting a new session', function() {

    if (notSupportedInBrowser()) return;

    browser
        .execute(ga.run, 'require', 'pageVisibilityTracker', {
          sessionTimeout: SESSION_TIMEOUT_IN_MINUTES
        })
        .pause(SESSION_TIMEOUT_IN_MILLISECONDS + BUFFER);

    var hitData = browser
        .element('body').keys(command + 't' + command) // Opens a new tab.
        .element('body').keys(command + 'w' + command) // Closes the new tab.
        .execute(ga.getHitData)
        .value;

    // Expects a pageview in lieu of a visible event because the session
    // has timed out.
    assert.equal(hitData.length, 1);
    assert.equal(hitData[0].hitType, 'pageview');
  });


  it('should support customizing any field via the fieldsObj', function() {

    if (notSupportedInBrowser()) return;

      var hitData = browser
          .execute(ga.run, 'require', 'pageVisibilityTracker', {
            fieldsObj: {
              dimension1: 'pageVisibilityTracker'
            }
          })
          .element('body').keys(command + 't' + command) // Opens a new tab.
          .element('body').keys(command + 'w' + command) // Closes the new tab.
          .execute(ga.getHitData)
          .value;

      assert.equal(hitData.length, 2);
      assert.equal(hitData[0].eventCategory, 'Page Visibility');
      assert.equal(hitData[0].eventAction, 'change');
      assert.equal(hitData[0].eventLabel, 'hidden');
      assert.equal(hitData[0].dimension1, 'pageVisibilityTracker');
      assert.equal(hitData[1].eventCategory, 'Page Visibility');
      assert.equal(hitData[1].eventAction, 'change');
      assert.equal(hitData[1].eventLabel, 'visible');
      assert.equal(hitData[1].dimension1, 'pageVisibilityTracker');
  });


  it('should support specifying a hit filter', function() {

    if (notSupportedInBrowser()) return;

    var hitData = browser
        .execute(requirePageVisibilityTracker_hitFilter)
        .element('body').keys(command + 't' + command) // Opens a new tab.
        .element('body').keys(command + 'w' + command) // Closes the new tab.
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 1);
    assert.equal(hitData[0].eventCategory, 'Page Visibility');
    assert.equal(hitData[0].eventAction, 'change');
    assert.equal(hitData[0].eventLabel, 'hidden');
    assert.equal(hitData[0].dimension1, 'pageVisibilityTracker');
  });


  it('should reset the session timeout when other hits are sent', function() {

    if (notSupportedInBrowser()) return;

    browser
        .execute(ga.run, 'require', 'pageVisibilityTracker', {
          sessionTimeout: SESSION_TIMEOUT_IN_MINUTES
        })
        .pause(SESSION_TIMEOUT_IN_MILLISECONDS / 2);

    browser
        .execute(ga.run, 'send', 'event', 'Uncategorized', 'inactive')
        .pause(SESSION_TIMEOUT_IN_MILLISECONDS / 2);

    var hitData = browser
        .element('body').keys(command + 't' + command) // Opens a new tab.
        .element('body').keys(command + 'w' + command) // Closes the new tab.
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 3);
    assert.equal(hitData[0].eventCategory, 'Uncategorized');
    assert.equal(hitData[0].eventAction, 'inactive');

    // Since the event above resets the session timeout, opening a new
    // tab will still be considered within the session timeout.
    assert.equal(hitData[1].eventCategory, 'Page Visibility');
    assert.equal(hitData[1].eventAction, 'change');
    assert.equal(hitData[1].eventLabel, 'hidden');
    assert.equal(hitData[2].eventCategory, 'Page Visibility');
    assert.equal(hitData[2].eventAction, 'change');
    assert.equal(hitData[2].eventLabel, 'visible');
  });


  it('should include the &did param with all hits', function() {

    browser
        .execute(ga.run, 'require', 'pageVisibilityTracker')
        .execute(ga.run, 'send', 'pageview')
        .waitUntil(ga.hitDataMatches([['[0].devId', constants.DEV_ID]]));
  });

});


/**
 * @return {boolean} True if the current browser doesn't support all features
 *    required for these tests.
 */
function notSupportedInBrowser() {
  // TODO(philipwalton): Opening and switching between tabs is not very well
  // supported in webdriver, so we currently only test in Firefox.
  return browserCaps.browserName != 'firefox';
}


/**
 * Since function objects can't be passed via parameters from server to
 * client, this one-off function must be used to set the value for
 * `hitFilter`.
 */
function requirePageVisibilityTracker_hitFilter() {
  ga('require', 'pageVisibilityTracker', {
    hitFilter: function(model) {
      var visibilityState = model.get('eventLabel');
      if (visibilityState == 'visible') {
        throw 'Exclude visible events';
      }
      else {
        model.set('dimension1', 'pageVisibilityTracker');
      }
    }
  });
}