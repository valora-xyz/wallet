// `redux-persist-fs-storage` transitively depends on `react-native-fs`, and we
// also consume the `@valora/react-native-fs` fork directly. Both packages
// declare the same Android package name (`com.rnfs`), so letting SDK 54's
// transitive RN module autolinking link both causes a dex merge collision:
//
//   Type com.rnfs.BuildConfig is defined multiple times
//
// Disable autolinking for the plain `react-native-fs` package — the fork
// provides the same native module, so any JS `require('react-native-fs')`
// still resolves at runtime.
module.exports = {
  dependencies: {
    'react-native-fs': {
      platforms: {
        android: null,
      },
    },
  },
}
