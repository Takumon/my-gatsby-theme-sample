const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const fs = require('fs')
const withThemePath = require('./with-theme-path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    // withThemePathを使って、ユーザが作成したページまたはテーマで用意しているページを読み込む
    const blogPost = withThemePath('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}


// テーマ差し替え用フォルダを指定して
// ユーザがフォルダ配下にコンポーネントを配置している場合、テーマで用意したものと差し替えるようにする
const THEME_PREFIX = 'gatsby-blog-component-replacement-theme--component'
const RELATIVE_DIR_PATH_OF_REPLACEMENT_COMPONETS = `./src/components/${THEME_PREFIX}`

exports.onCreateWebpackConfig = ({ actions, store }) => {

  // ユーザが作成したコンポーネント読み込んで
  // エイリアスを作成する
  const userComponents = fs
    .readdirSync(path.resolve(RELATIVE_DIR_PATH_OF_REPLACEMENT_COMPONETS))
    .reduce(
      (acc, componentName) => ({
        ...acc,
        [`${THEME_PREFIX}/${componentName.substr(0, componentName.lastIndexOf('.'))}`]: path.resolve(
          `${RELATIVE_DIR_PATH_OF_REPLACEMENT_COMPONETS}/${componentName}`
        ),
      }),
      {}
    )

  // エイリアス設定でユーザが作成したコンポーネントを先に定義することで
  // ユーザが作成したコンポーネントを優先的に読み込むようにする
  actions.setWebpackConfig({
    resolve: {
      alias: {
        ...userComponents,
        [THEME_PREFIX]: path.join(__dirname, './src/components'),
      },
    },
  })
}


// ユーザがsrc/pages未作成の場合にエラーになるのを防ぐため、無ければ作成する
// RELATIVE_DIR_PATH_OF_REPLACEMENT_COMPONETSも同様
exports.onPreBootstrap = ({ store }) => {
  const { program } = store.getState()

  const pageDir = `${program.directory}/src/pages/`
  const componentDir = `${program.directory}/src/components/`
  const replaceComponentDir = `${componentDir}/${THEME_PREFIX}/`

  mkdir(pageDir)
  mkdir(componentDir)
  mkdir(replaceComponentDir)
}

function mkdir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}
