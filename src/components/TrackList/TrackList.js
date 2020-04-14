import React from 'react';
import './TrackList.css';
import Track from '../Track/Track.js'

class TrackList extends React.Component {
  render(){
    return (
      <div className="TrackList">
        {
          this.props.tracks && this.props.tracks.map(track => {
            return <Track onAdd={this.props.onAdd}
                          onRemove={this.props.onRemove}
                          isRemoval={this.props.isRemoval}
                          track={track} 
                          key={track.id} />
          })
        }
      </div>
    )
  }
}

export default TrackList;