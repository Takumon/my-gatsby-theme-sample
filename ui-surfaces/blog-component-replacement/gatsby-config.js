module.exports = {
  // テーマを指定する
  __experimentalThemes: [
    {
      // テーマにgatsby-blog-component-replacement-themeを指定する
      resolve: "gatsby-blog-component-replacement-theme",
      // テーマgatsby-blog-component-replacement-themeではrootをオプションで受け取る想定なので本ブログのルートフォルダを指定する
      options: { root: __dirname }
    }
  ]
};