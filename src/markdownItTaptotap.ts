module.exports = {
  default: function(context) {
    return {
      // plugin: require("./admonitionPluginRender"),
      plugin: require("./tabtotapPlugin"),
      assets: function() {
        return [
        ];
      },
    }
  }
}
