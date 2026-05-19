// Force the fmt pod to compile with C++17.
// fmt 11.0.2 (bundled by RN 0.81) uses C++20 `consteval` functions that Apple
// clang 21 (Xcode 26.4) rejects as non-constant expressions. Compiling fmt
// itself under C++17 takes the library's constexpr fallback path and avoids
// the error. See https://github.com/facebook/react-native/issues/55601#issuecomment-4248887899.
const { withDangerousMod } = require('expo/config-plugins')
const fs = require('fs')
const path = require('path')

const FMT_POST_INSTALL_SNIPPET = `
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        end
      end
    end
`

const ANCHOR = ':ccache_enabled => ccache_enabled?(podfile_properties),'
const CLOSING_PAREN_LINE = '    )'

module.exports = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      const contents = fs.readFileSync(podfilePath, 'utf8')

      if (contents.includes(FMT_POST_INSTALL_SNIPPET.trim())) {
        return config
      }

      const anchorIdx = contents.indexOf(ANCHOR)
      if (anchorIdx === -1) {
        throw new Error(
          `withFmtConstevalFix: could not find post_install anchor "${ANCHOR}" in Podfile`
        )
      }

      const closingIdx = contents.indexOf(CLOSING_PAREN_LINE, anchorIdx)
      if (closingIdx === -1) {
        throw new Error(`withFmtConstevalFix: could not find post_install closing ")" after anchor`)
      }

      const insertIdx = closingIdx + CLOSING_PAREN_LINE.length
      const patched =
        contents.slice(0, insertIdx) + FMT_POST_INSTALL_SNIPPET + contents.slice(insertIdx)

      fs.writeFileSync(podfilePath, patched)
      return config
    },
  ])
}
