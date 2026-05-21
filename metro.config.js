// Learn more https://docs.expo.io/guides/customizing-metro
const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const { withWalletStackConfig } = require('wallet-stack/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = withWalletStackConfig(getSentryExpoConfig(__dirname))

module.exports = config
