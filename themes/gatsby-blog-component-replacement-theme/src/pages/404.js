import React from 'react'

// コンポーネント読み込みはgatsby-node.jsで指定したファイルパスから読み込む
import Layout from 'gatsby-blog-component-replacement-theme--component/Layout'

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Layout>
    )
  }
}

export default NotFoundPage
