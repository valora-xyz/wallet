// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('wallet-stack/metro-config')
const { withSentryConfig } = require('@sentry/react-native/metro')

/** @type {import('expo/metro-config').MetroConfig} */
const config = withSentryConfig(getDefaultConfig(__dirname))

module.exports = config
