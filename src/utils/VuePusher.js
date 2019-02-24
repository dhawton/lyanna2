const Pusher = require('pusher-js');

const VuePusher = (apikey, options) => {
  this.pusher = new Pusher(apikey, options);
  this.channels = [];
};

/**
 * Subscribe to the given channel and give a fallback to bind events to the channel.
 *
 * @param  { String } channel_name
 * @param  { Function } callback
 */
VuePusher.prototype.subscribe = (channelName, callback) => {
  const channel = this.pusher.subscribe(channelName);

  if (!this.channels.includes(channel)) {
    this.channels.push(channelName);
  }

  callback(channel);
};

/**
 * Unsubscribe from the given channel.
 *
 * @param  {String} channel
 */
VuePusher.prototype.unsubscribe = (channel) => {
  this.pusher.unsubscribe(channel);
};

/**
 * Return all the chanels.
 *
 * @return {Array}
 */
VuePusher.prototype.getChannels = () => this.channels;

module.exports = {
  install(Vue, options) {
    const pusher = new VuePusher(options.apikey, options.options);

    Vue.prototype.pusher = pusher;
    Vue.prototype.$pusher = pusher.pusher; // Just in case they want to manage it themselves.
  }
};
