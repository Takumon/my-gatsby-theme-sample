const path = require('path')

/**
 * テーマで用意したページをユーザが上書き可能にするためのファイルパス解決ユーティリティ
 *
 * 指定した相対パスから
 * 1. ユーザが作成したファイルのパスを返却する
 * 2. ユーザが作成したファイルがなければテーマで用意しているパスを返却する
 * 3. テーマでもファイルを用意していない場合、指定した相対パスをそのまま返却する
 */
module.exports = relativePath => {
  let pathResolvedPath = path.resolve(relativePath)
  let finalPath = pathResolvedPath

  try {
    // ファイル読み込み時にユーザが作成したファイルがあるかチェック
    require.resolve(pathResolvedPath)
    // 1. ユーザが作成したファイルのパスを返却する
    finalPath = pathResolvedPath
  } catch (e) {
    try {
      // 2. ユーザが作成したファイルがなければテーマで用意しているパスを返却する
      finalPath = require.resolve(relativePath)
    } catch (e) {
      // 3. テーマでもファイルを用意していない場合、指定した相対パスをそのまま返却する
      console.log(e)
      return relativePath
    }
  }

  return finalPath
}
