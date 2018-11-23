import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

// 上書きするコンポーネントからもテーマ資産は使える
import profilePic from 'gatsby-blog-component-replacement-theme/src/components/profile-pic.jpg'
import { rhythm } from 'gatsby-blog-component-replacement-theme/src/utils/typography'

// テーマ側で指定したフォルダ配下にテーマ資産と同名でコンポーネントを作成して上書きする
class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Kyle Mathews`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          こんにちは！　上書きしたBioコンポーネントです。
        </p>
      </div>
    )
  }
}

export default Bio
