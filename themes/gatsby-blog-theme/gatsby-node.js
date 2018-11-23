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


/*
 * Gatsbyテーマのビルド方法をwebpackに設定しています。
 * NPMモジュールの公開時は、(1)事前コンパイルするか、(2)コンパイル方法の設定追加 どちらかが必要です。
 * Gatsbyテーマの場合(2)が可能なので、ここで設定しています。
 */
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.dirname(require.resolve('gatsby-blog-theme')),
          use: [loaders.js()],
        },
      ],
    },
  })
}

// ユーザがsrc/pages未作成の場合にエラーになるのを防ぐため、無ければ作成する
exports.onPreBootstrap = ({ store }) => {
  const { program } = store.getState()
  const dir = `${program.directory}/src/pages`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}