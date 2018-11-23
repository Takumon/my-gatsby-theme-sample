module.exports = {
  // テーマを指定する
  __experimentalThemes: [
    {
      // テーマにgatsby-blog-themeを指定する
      resolve: "gatsby-blog-theme",
      // テーマgatsby-blog-themeではrootをオプションで受け取る想定なので本ブログのルートフォルダを指定する
      options: { root: __dirname }
    }
  ]
};